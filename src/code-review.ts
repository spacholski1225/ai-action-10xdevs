import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { AICodeReviewOptions } from './types/anthropic.js';

dotenv.config();

/**
 * Performs an AI code review on a PR diff using Anthropic's Claude model
 * @param prDiff The PR diff to review
 * @param fileContents Map of file paths to their full content
 * @param apiKey Anthropic API key
 * @param options Additional options
 * @returns The AI review feedback
 */
export async function performAICodeReview(
  prDiff: string, 
  fileContents: Record<string, string> = {}, 
  apiKey: string, 
  options: AICodeReviewOptions
): Promise<string> {
  if (!prDiff) {
    throw new Error("PR diff is empty or not provided");
  }

  if (!apiKey) {
    throw new Error("Anthropic API key is required");
  }

  const {
    model,
    maxTokens = 5000
  } = options;

  if (!model) {
    throw new Error("Model must be provided in options");
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  // Create file context section if available
  let fileContextSection = "";
  if (Object.keys(fileContents).length > 0) {
    fileContextSection = `
    <existing_files>
    ${Object.entries(fileContents).map(([path, content]) => `
      <file path="${path}">
      ${content}
      </file>
    `).join("\n")}
    </existing_files>
    `;
  }

  try {
    const requestPayload = {
      model: model,
      max_tokens: maxTokens,
      messages: [{
        role: "user" as const,
        content: `You are a senior software engineer tasked with reviewing a pull request. Your goal is to conduct a thorough review based on the provided file context and pull request diff, focusing on specific areas and adhering to given code standards.

First, review the context of the existing files:

<file_context>
${fileContextSection}
</file_context>

Now, examine the pull request diff:

<pr_diff>
${prDiff}
</pr_diff>

In your review, focus on the following areas:

1. Code readability
2. Code performance
3. Code style
4. Code duplication
5. Code quality
6. Consistency with existing files

When reviewing, keep in mind these naming conventions:

- File names: kebab-case (e.g., kebab-case-example)
- Classes and interfaces: PascalCase (e.g., ExampleClass)
- Variables and fields: camelCase (e.g., exampleVariable)
- Interfaces with required methods: Start with 'I' (e.g., IValidation), except for request-response models
- Non-exported functions and methods: camelCase (e.g., doSmth())
- Exported functions and methods: PascalCase (e.g., DoSmth())
- Parameters shared with SE API: under_score (e.g., client_id)
- Constant variables: UPPER_SCORE (e.g., MAX_WEIGHT)

Also, consider these good code practices:

- Use strong types when possible
- Use const and let, never var
- Don't mix await/async with Promise().Then().Catch()
- Use === and !== instead of == or !=
- Use assignment operators (+, +=) instead of concat()
- Use shorter forms to check null or empty string values
- Use null safe access pointer '?'
- Create const functions instead of statement functions
- Keep communication models and third-party connector helpers outside main SE Connect methods
- Remove unused imports and packages

Before providing your final review, break down your thought process for each focus area in <code_review_analysis> tags. For each area:
a. List relevant code snippets or line numbers
b. Identify potential issues
c. Suggest improvements based on the given standards and practices

After analyzing all areas, summarize the most critical issues found across all areas. This analysis will help ensure a thorough interpretation of the code.

In your final review, use markdown formatting to structure your feedback. Only include areas where improvements are needed. If an area doesn't require changes, omit it from your review. Be specific in your feedback, referencing line numbers or code snippets when applicable. Provide clear suggestions for improvement based on the given code standards and best practices.

Here's an example of how your final review should be structured in markdown:

\`\`\`markdown
# Pull Request Review

## Code Readability
[Your feedback and suggestions for improvement]

## Code Performance
[Your feedback and suggestions for improvement]

...

## Consistency with Existing Files
[Your feedback and suggestions for improvement]

\`\`\`

Please proceed with your analysis and review of the pull request.`
      }]
    };

    console.log("=== ANTHROPIC API REQUEST ===");
    console.log("Model:", requestPayload.model);
    console.log("Max tokens:", requestPayload.max_tokens);
    console.log("Message role:", requestPayload.messages[0].role);
    console.log("Message content length:", requestPayload.messages[0].content.length);
    console.log("Full request payload:", JSON.stringify(requestPayload, null, 2));
    console.log("=== END REQUEST ===");

    const response = await anthropic.messages.create(requestPayload);

    console.log("=== ANTHROPIC API RESPONSE ===");
    console.log("Response ID:", response.id);
    console.log("Response model:", response.model);
    console.log("Response type:", response.type);
    console.log("Response role:", response.role);
    console.log("Usage:", JSON.stringify(response.usage, null, 2));
    const textContent = response.content[0];
    if (textContent.type === 'text') {
      console.log("Content length:", textContent.text.length);
    }
    console.log("Full response:", JSON.stringify(response, null, 2));
    console.log("=== END RESPONSE ===");

    // Filter out the code_review_analysis section before returning
    const firstContent = response.content[0];
    if (firstContent.type === 'text') {
      const filteredResponse = firstContent.text.replace(/<code_review_analysis>[\s\S]*?<\/code_review_analysis>/g, '');
      return filteredResponse;
    }
    
    throw new Error("Unexpected response content type from Anthropic API");
  } catch (error: any) {
    console.error("Error during AI review:", error);
    throw error;
  }
}