const { onRequest } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.STUDIO_GEMINI_KEY);

function getReadingLevelGuidance(readingLevel) {
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

exports.transcribeAndSummarize = onRequest(
  {
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { audioData, mimeType, readingLevel } = req.body;

      if (!audioData || !mimeType || readingLevel === undefined) {
        return res.status(400).json({
          error: "Missing required fields: audioData, mimeType, or readingLevel",
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
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

      return res.json({
        transcript: parsed.transcript || "",
        summary: parsed.summary || "Visit summary not available",
        keyPoints: parsed.keyPoints || [],
        diagnoses: parsed.diagnoses || [],
        actions: parsed.actions || [],
        medicalTerms: parsed.medicalTerms || [],
      });
    } catch (error) {
      console.error("Error in transcribeAndSummarize:", error);
      return res.status(500).json({
        error: "Failed to process audio",
        details: error.message,
      });
    }
  }
);

exports.answerQuestion = onRequest(
  {
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 60,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { question, visitContext, readingLevel } = req.body;

      if (!question || !visitContext || readingLevel === undefined) {
        return res.status(400).json({
          error: "Missing required fields: question, visitContext, or readingLevel",
        });
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      const readingGuidance = getReadingLevelGuidance(readingLevel);

      const prompt = `You are a medical assistant helping parents understand their child's doctor visit.

Visit context:
${visitContext}

Parent's question: ${question}

${readingGuidance}

Please answer the question based on the visit notes above. If the information isn't in the visit notes, say so and suggest they ask their doctor. Be supportive, clear, and helpful.`;

      const result = await model.generateContent(prompt);
      const answer = result.response.text();

      return res.json({ answer });
    } catch (error) {
      console.error("Error in answerQuestion:", error);
      return res.status(500).json({
        error: "Failed to answer question",
        details: error.message,
      });
    }
  }
);

exports.suggestQuestions = onRequest(
  {
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 60,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { visitHistory } = req.body;

      if (!visitHistory || !Array.isArray(visitHistory)) {
        return res.status(400).json({
          error: "Missing or invalid visitHistory array",
        });
      }

      if (visitHistory.length === 0) {
        return res.json({
          questions: [
            "How is my child's lung function?",
            "What symptoms should I watch for?",
            "Are there any new treatment options?",
            "How can we improve daily breathing?",
          ],
        });
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

      const questions = JSON.parse(jsonMatch[0]);
      return res.json({ questions });
    } catch (error) {
      console.error("Error in suggestQuestions:", error);
      return res.status(500).json({
        error: "Failed to suggest questions",
        details: error.message,
      });
    }
  }
);
