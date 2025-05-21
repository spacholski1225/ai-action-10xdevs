import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Performs an AI code review on a PR diff using Anthropic's Claude model
 * @param {string} prDiff The PR diff to review
 * @param {string} apiKey Anthropic API key
 * @returns {Promise<string>} The AI review feedback
 */
export async function performAICodeReview(prDiff, apiKey) {
  if (!prDiff) {
    throw new Error("PR diff is empty or not provided");
  }

  if (!apiKey) {
    throw new Error("Anthropic API key is required");
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a senior software engineer reviewing a pull request.
        Conduct a thorough review of the PR based on provided diff.

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

        You are allowed to use "N/A" for cases where the PR does not bring any changes in given area.`
      }]
    });

    return response.content[0].text;
  } catch (error) {
    console.error("Error during AI review:", error);
    throw error;
  }
}
