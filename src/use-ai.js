import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents:
      "Provide short example of a feedback to Pull Request - imagine that you are a reviewer.",
  });
  console.log(response.text);
}

main();
