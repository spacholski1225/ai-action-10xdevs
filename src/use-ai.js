import {GoogleGenAI} from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const prDiff = process.env.PR_DIFF;

if (!prDiff) {
  throw new Error("PR_DIFF is not set");
}

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `
      You are a senior software engineer reviewing a pull request.
      Provide short example of a feedback to Pull Request - imagine that you are a reviewer.
      The PR diff is:

      <diff>
      ${prDiff}
      </diff>

      Focus on the following:
      - Code readability - is the code easy to understand?
      - Code performance - is the code efficient?
      - Code style - is the code style consistent?
      - Code duplication - is the code duplicated?
      - Code quality - is the code of high quality?

      You are allowed to use "N/A" for cases where the PR does not bring any changes in given area.
      `,
  });
  console.log(response.text);
}

main();
