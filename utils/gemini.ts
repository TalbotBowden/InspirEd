import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const API_KEY =
  Constants.expoConfig?.extra?.STUDIO_GEMINI_KEY ||
  (typeof process !== "undefined" && process.env?.STUDIO_GEMINI_KEY) ||
  "";

if (!API_KEY) {
  console.warn("STUDIO_GEMINI_KEY not found. AI features will not work.");
  console.log("Constants.expoConfig?.extra:", Constants.expoConfig?.extra);
  console.log("process.env.STUDIO_GEMINI_KEY:", typeof process !== "undefined" ? process.env?.STUDIO_GEMINI_KEY : "process not defined");
}

const genAI = new GoogleGenerativeAI(API_KEY);

function getReadingLevelGuidance(readingLevel: number): string {
  if (readingLevel <= 6) {
    return "Use very simple words and short sentences (under 10 words). Explain everything like you're talking to a 6th grader.";
  } else if (readingLevel <= 8) {
    return "Use clear, straightforward language. Keep sentences under 15 words. Avoid complex medical jargon.";
  } else if (readingLevel <= 10) {
    return "Use moderate vocabulary appropriate for a high school student. Technical terms are okay if explained simply.";
  } else {
    return "Use standard medical terminology with clear explanations. Write at a college reading level.";
  }
}

export async function generateVisitSummary(
  audioUri: string,
  readingLevel: number
): Promise<any> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const audioData = await FileSystem.readAsStringAsync(audioUri, {
      encoding: "base64",
    });

    const mimeType = audioUri.toLowerCase().endsWith(".m4a")
      ? "audio/mp4"
      : "audio/mpeg";

    const readingGuidance = getReadingLevelGuidance(readingLevel);

    const prompt = `You are a medical visit assistant helping parents of children with chronic pulmonary conditions.

First, transcribe this audio recording of a doctor's visit. Then create a helpful summary.

${readingGuidance}

Please provide your response in the following JSON format:
{
  "transcript": "full transcription here",
  "summary": "2-3 sentence overview of the visit",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "diagnoses": ["diagnosis 1", "diagnosis 2"],
  "actions": ["action 1", "action 2"],
  "medicalTerms": [
    {
      "term": "Medical Term",
      "explanation": "Simple explanation adapted to reading level"
    }
  ]
}

Important:
- Write the summary and explanations at the specified reading level
- Focus on what matters to parents: what was said, what it means, what to do
- Explain medical terms in plain language
- Be supportive and clear`;

    const result = await model.generateContent([
      {
        inlineData: {
          data: audioData,
          mimeType: mimeType,
        },
      },
      prompt,
    ]);

    const response = result.response.text();
    
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      transcript: parsed.transcript || "",
      summary: parsed.summary || "Visit summary not available",
      keyPoints: parsed.keyPoints || [],
      diagnoses: parsed.diagnoses || [],
      actions: parsed.actions || [],
      medicalTerms: parsed.medicalTerms || [],
    };
  } catch (error) {
    console.error("Error generating visit summary:", error);
    
    return {
      transcript: "",
      summary: "We had trouble processing this recording. Please try again or contact support if the problem continues.",
      keyPoints: ["Unable to process audio at this time"],
      diagnoses: [],
      actions: ["Try recording again with clear audio"],
      medicalTerms: [],
    };
  }
}

export async function askQuestionAboutVisit(
  question: string,
  visitContext: string,
  readingLevel: number
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const readingGuidance = getReadingLevelGuidance(readingLevel);

    const prompt = `You are a medical assistant helping parents understand their child's doctor visit.

Visit context:
${visitContext}

Parent's question: ${question}

${readingGuidance}

Please answer the question based on the visit notes above. If the information isn't in the visit notes, say so and suggest they ask their doctor. Be supportive, clear, and helpful.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error answering question:", error);
    return "I'm having trouble answering that right now. Please try again or ask your doctor directly.";
  }
}

export async function suggestPlannerQuestions(
  visitHistory: any[]
): Promise<string[]> {
  try {
    if (visitHistory.length === 0) {
      return [
        "How is my child's lung function?",
        "What symptoms should I watch for?",
        "Are there any new treatment options?",
        "How can we improve daily breathing?",
      ];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const recentVisits = visitHistory
      .slice(0, 3)
      .map((v) => v.summary || "No summary")
      .join("\n\n");

    const prompt = `Based on these recent doctor visits for a child with a chronic pulmonary condition, suggest 4-5 important questions the parent should ask at their next visit.

Recent visits:
${recentVisits}

Return ONLY a JSON array of question strings, like:
["Question 1?", "Question 2?", "Question 3?"]`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Could not parse questions");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Error suggesting questions:", error);
    return [
      "How is my child's condition progressing?",
      "What should I watch for between visits?",
      "Are there any changes to the treatment plan?",
      "What can we do to help at home?",
    ];
  }
}

export function calculateSMOG(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    .length;
  const words = text.split(/\s+/).filter((w) => w.trim().length > 0);

  let polysyllables = 0;
  words.forEach((word) => {
    const syllables = word.match(/[aeiouy]{1,2}/gi)?.length || 0;
    if (syllables >= 3) polysyllables++;
  });

  if (sentences === 0) return 8;

  const smog = 1.043 * Math.sqrt((polysyllables * 30) / sentences) + 3.1291;
  return Math.round(smog);
}
