import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const CLOUD_FUNCTION_BASE_URL =
  Constants.expoConfig?.extra?.CLOUD_FUNCTION_BASE_URL ||
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_CLOUD_FUNCTION_BASE_URL) ||
  "";

if (!CLOUD_FUNCTION_BASE_URL) {
  console.warn(
    "CLOUD_FUNCTION_BASE_URL not found. AI features will not work. Please deploy Cloud Functions and set EXPO_PUBLIC_CLOUD_FUNCTION_BASE_URL."
  );
}

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
    if (!CLOUD_FUNCTION_BASE_URL) {
      throw new Error("Cloud Function URL not configured");
    }

    const audioData = await FileSystem.readAsStringAsync(audioUri, {
      encoding: "base64",
    });

    const mimeType = audioUri.toLowerCase().endsWith(".m4a")
      ? "audio/mp4"
      : "audio/mpeg";

    const response = await fetch(`${CLOUD_FUNCTION_BASE_URL}/transcribeAndSummarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        audioData,
        mimeType,
        readingLevel,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process audio");
    }

    const result = await response.json();

    return {
      transcript: result.transcript || "",
      summary: result.summary || "Visit summary not available",
      keyPoints: result.keyPoints || [],
      diagnoses: result.diagnoses || [],
      actions: result.actions || [],
      medicalTerms: result.medicalTerms || [],
    };
  } catch (error) {
    console.error("Error generating visit summary:", error);

    return {
      transcript: "",
      summary:
        "We had trouble processing this recording. Please try again or contact support if the problem continues.",
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
    if (!CLOUD_FUNCTION_BASE_URL) {
      throw new Error("Cloud Function URL not configured");
    }

    const response = await fetch(`${CLOUD_FUNCTION_BASE_URL}/answerQuestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        visitContext,
        readingLevel,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to answer question");
    }

    const result = await response.json();
    return result.answer || "I couldn't generate an answer. Please try again.";
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

    if (!CLOUD_FUNCTION_BASE_URL) {
      throw new Error("Cloud Function URL not configured");
    }

    const response = await fetch(`${CLOUD_FUNCTION_BASE_URL}/suggestQuestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        visitHistory,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to suggest questions");
    }

    const result = await response.json();
    return result.questions || [];
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
