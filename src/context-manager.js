/**
 * Extract modified files from a PR diff
 * @param {string} diff The PR diff content
 * @returns {string[]} Array of modified file paths
 */
export function extractModifiedFiles(diff) {
  const filePathRegex = /^diff --git a\/(.*?) b\/(.*?)$/gm;
  const modifiedFiles = new Set();
  
  let match;
  while ((match = filePathRegex.exec(diff)) !== null) {
    modifiedFiles.add(match[1]);
  }
  
  return Array.from(modifiedFiles);
}

/**
 * Get file content from GitHub repository
 * @param {Object} params Parameters object
 * @param {Object} params.octokit Octokit instance
 * @param {string} params.owner Repository owner
 * @param {string} params.repo Repository name
 * @param {string} params.path File path
 * @param {string} params.ref Git reference (default: 'HEAD')
 * @param {number} params.maxLines Maximum lines to include (default: 500)
 * @returns {Promise<string>} File content
 */
export async function getFileContent({
  octokit,
  owner,
  repo,
  path,
  ref = 'HEAD',
  maxLines = 500
}) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref
    });
    
    // GitHub API returns content as base64
    const content = Buffer.from(response.data.content, 'base64').toString();
    
    // Limit to maxLines if needed
    const lines = content.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + 
        `\n\n// File truncated to ${maxLines} lines. Complete file has ${lines.length} lines.`;
    }
    
    return content;
  } catch (error) {
    console.warn(`Cannot retrieve file content for ${path}: ${error.message}`);
    return `// Cannot retrieve file content: ${error.message}`;
  }
}

/**
 * Estimate token count (Claude uses ~4 characters per token)
 * @param {string} text Text to estimate tokens for
 * @returns {number} Estimated token count
 */
function estimateTokenCount(text) {
  return Math.ceil(text.length / 4);
}

/**
 * Manage context to stay within token limits
 * @param {Object} params Parameters object
 * @param {string} params.diff PR diff content
 * @param {Object} params.fileContents Map of file paths to their content
 * @param {number} params.modelMaxTokens Maximum tokens for the model (default: 200000)
 * @param {number} params.safetyFactor Safety factor to stay below limits (default: 0.9)
 * @returns {Object} Optimized context with diff and file contents
 */
export function optimizeContext({
  diff,
  fileContents,
  modelMaxTokens = 200000,
  safetyFactor = 0.9
}) {
  const tokenLimit = modelMaxTokens * safetyFactor;
  
  // Always include diff
  const diffTokens = estimateTokenCount(diff);
  let remainingTokens = tokenLimit - diffTokens;
  
  // Base prompt tokens (approximate)
  const basePromptTokens = 1000;
  remainingTokens -= basePromptTokens;
  
  // If already over limit with just diff, return only diff
  if (remainingTokens <= 0) {
    console.warn("Diff alone exceeds token limit, no room for file context");
    return {
      diff,
      fileContents: {},
      estimatedTokens: diffTokens + basePromptTokens
    };
  }
  
  // Sort files by size (smallest first to include more files)
  const sortedFiles = Object.entries(fileContents).sort(
    ([, contentA], [, contentB]) => 
      estimateTokenCount(contentA) - estimateTokenCount(contentB)
  );
  
  // Include as many files as possible
  const optimizedFileContents = {};
  for (const [path, content] of sortedFiles) {
    const contentTokens = estimateTokenCount(content);
    
    if (contentTokens <= remainingTokens) {
      // Include entire file
      optimizedFileContents[path] = content;
      remainingTokens -= contentTokens;
    } else if (remainingTokens > 500) {
      // Include truncated file
      const truncatedContent = content.substring(0, remainingTokens * 4);
      optimizedFileContents[path] = truncatedContent + 
        "\n\n// File truncated due to token limitations";
      remainingTokens = 0;
      break;
    } else {
      // Skip file if not enough tokens
      console.warn(`Skipping file ${path} due to token limitations`);
      break;
    }
  }
  
  return {
    diff,
    fileContents: optimizedFileContents,
    estimatedTokens: tokenLimit - remainingTokens
  };
}