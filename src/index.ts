import * as core from "@actions/core";
import {
  getPRDiff,
  extractPRNumber,
  getRepoInfo,
  commentOnPR,
} from "./github-utils.js";
import { performAICodeReview } from "./code-review.js";
import { 
  extractModifiedFiles, 
  getFileContent, 
  optimizeContext 
} from "./context-manager.js";
import { getOctokit } from "@actions/github";

/**
 * Main function that orchestrates the PR diff retrieval and AI review
 */
async function run(): Promise<void> {
  try {
    // Get inputs and context
    const githubToken = process.env.GITHUB_TOKEN;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
    const maxFileLines = parseInt(process.env.MAX_FILE_LINES || "500", 10);
    const modelName = process.env.MODEL_NAME || "claude-3-5-haiku-20241022";
    const safetyFactor = parseFloat(process.env.CONTEXT_SAFETY_FACTOR || "0.9");
    
    // Model token limits (approximate)
    const MODEL_TOKEN_LIMITS: Record<string, number> = {
      "claude-3-5-haiku-20241022": 200000,
      "claude-sonnet-4-20250514": 200000,
    };
    
    const modelMaxTokens = MODEL_TOKEN_LIMITS[modelName] || 100000;

    if (!githubToken) {
      throw new Error("GITHUB_TOKEN is required");
    }

    if (!anthropicApiKey) {
      throw new Error("ANTHROPIC_API_KEY is required");
    }

    // Get PR details
    const prNumber = extractPRNumber();
    const {owner, repo} = getRepoInfo();

    // Set PR_NUMBER in the environment for the comment step
    if (prNumber) {
      console.log(`PR number: ${prNumber}`);
    }

    // Get the PR diff
    const {diff} = await getPRDiff({
      token: githubToken,
      owner,
      repo,
      prNumber,
    });
    
    // Extract modified files from diff
    const modifiedFiles = extractModifiedFiles(diff);
    console.log(`Found ${modifiedFiles.length} modified files in diff`);
    
    // Initialize Octokit for file retrieval
    const octokit = getOctokit(githubToken);
    
    // Get content of modified files
    const fileContentsMap: Record<string, string> = {};
    
    for (const filePath of modifiedFiles) {
      try {
        // For PRs, use base branch as reference to get original file
        const content = await getFileContent({
          octokit,
          owner,
          repo,
          path: filePath,
          ref: prNumber ? `HEAD~1` : 'HEAD~1', // Get file before changes
          maxLines: maxFileLines
        });
        
        fileContentsMap[filePath] = content;
        console.log(`Retrieved content for ${filePath} (${content.length} bytes)`);
      } catch (error: any) {
        console.warn(`Error retrieving content for ${filePath}: ${error.message}`);
      }
    }
    
    // Optimize context to fit within token limits
    const { diff: optimizedDiff, fileContents: optimizedFileContents } = optimizeContext({
      diff,
      fileContents: fileContentsMap,
      modelMaxTokens,
      safetyFactor
    });
    
    console.log(`Optimized context with ${Object.keys(optimizedFileContents).length} files`);
    
    // Perform AI review with enhanced context
    const reviewText = await performAICodeReview(
      optimizedDiff, 
      optimizedFileContents, 
      anthropicApiKey,
      { model: modelName }
    );

    // Comment on the PR with the review
    if (prNumber) {
      await commentOnPR({
        token: githubToken,
        owner,
        repo,
        prNumber,
        body: `## AI Review Feedback:\n\n${reviewText}`,
      });
    } else {
      // Log the review if not a PR
      console.log("AI Review Feedback:");
      console.log(reviewText);
    }

    console.log("AI review completed successfully");
  } catch (error: any) {
    core.setFailed(`Action failed with error: ${error.message}`);
    console.error(error);
  }
}

// Run the main function
run();