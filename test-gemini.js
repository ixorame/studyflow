import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents:
        "Explain photosynthesis to an 8th standard student in 3 simple points.",
    });

    console.log("\nGemini response:\n");
    console.log(response.text);

  } catch (error) {
    console.error("\nGEMINI ERROR:\n");
    console.error(error);
  }
}

testGemini();