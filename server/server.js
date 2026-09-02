import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());



const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "StudyFlow AI server is working!",
  });
});

// Gemini summary
app.post("/api/summarize", async (req, res) => {
  console.log("Received summary request");

  try {
    const { text } = req.body;

    console.log("Text received:", text?.substring(0, 100));

    if (!text) {
      return res.status(400).json({
        error: "No text was provided.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `You are a friendly tutor for an 8th standard student.

Convert the following school notes into simple study notes.

Use:
- A clear title
- Short bullet points
- Important definitions
- Important facts
- Very simple language

Only use information from the provided notes.

NOTES:

${text}`,
    });

    console.log("Gemini response received");

    res.json({
      summary: response.text,
    });

  } catch (error) {
    console.error("GEMINI ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message || "Gemini request failed.",
    });
  }
});
// Generate flashcards
app.post("/api/flashcards", async (req, res) => {
  console.log("Received flashcard request");

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "No text was provided.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `You are a friendly tutor for an 8th standard student.

Create exactly 5 useful flashcards from the following school notes.

Return ONLY valid JSON.
Do not use markdown.
Do not add any explanation.

Use exactly this format:

[
  {
    "question": "What is photosynthesis?",
    "answer": "Photosynthesis is the process by which green plants make their food using sunlight."
  }
]

Rules:
- Create exactly 5 flashcards.
- Questions should test important concepts from the notes.
- Answers should be short and easy to understand.
- Use language suitable for an 8th standard student.
- Use ONLY information from the notes.
- Do not invent information.

NOTES:

${text}`,
    });

    const rawText = response.text.trim();

    console.log("Gemini flashcard response:");
    console.log(rawText);

    let cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const flashcards = JSON.parse(cleanedText);

    if (!Array.isArray(flashcards)) {
      throw new Error("Gemini did not return a flashcard array.");
    }

    if (flashcards.length === 0) {
      throw new Error("Gemini returned no flashcards.");
    }

    for (const card of flashcards) {
      if (!card.question || !card.answer) {
        throw new Error("Gemini returned an invalid flashcard.");
      }
    }

    res.json({
      flashcards: flashcards,
    });

  } catch (error) {
    console.error("FLASHCARD ERROR:", error);

    res.status(500).json({
      error: error.message || "Failed to create flashcards.",
    });
  }
});

// Generate quiz
app.post("/api/quiz", async (req, res) => {
  console.log("Received quiz request");

  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "No text was provided.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: `You are a quiz creator for an 8th standard student.

Create exactly 5 multiple-choice questions from these school notes.

Return ONLY valid JSON.
Do not use markdown.
Do not add any explanation.

Use exactly this format:

[
  {
    "question": "Question here",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0
  }
]

The answer number must be:
0 = first option
1 = second option
2 = third option
3 = fourth option

Use ONLY information from the notes.

NOTES:

${text}`,
    });

    const rawText = response.text.trim();

console.log("Gemini quiz response:");
console.log(rawText);

let cleanedText = rawText;

// Remove markdown code fences if Gemini adds them
cleanedText = cleanedText
  .replace(/^```json\s*/i, "")
  .replace(/^```\s*/i, "")
  .replace(/\s*```$/i, "")
  .trim();

const quiz = JSON.parse(cleanedText);

if (!Array.isArray(quiz)) {
  throw new Error("Gemini did not return a quiz array.");
}

if (quiz.length === 0) {
  throw new Error("Gemini returned an empty quiz.");
}

for (const question of quiz) {
  if (
    !question.question ||
    !Array.isArray(question.options) ||
    question.options.length !== 4 ||
    typeof question.answer !== "number"
  ) {
    throw new Error("Gemini returned an invalid question format.");
  }
}

    res.json({
      quiz: quiz,
    });

  } catch (error) {
    console.error("QUIZ ERROR:", error);

    res.status(500).json({
      error: error.message || "Failed to create quiz.",
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AI server running on port ${PORT}`);
});