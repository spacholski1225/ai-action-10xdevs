import { OptimizeContextOptions, OptimizeContextResult } from './types/context.js';
import { FileContentOptions } from './types/github.js';
/**
 * Extract modified files from a PR diff
 * @param diff The PR diff content
 * @returns Array of modified file paths
 */
export declare function extractModifiedFiles(diff: string): string[];
/**
 * Get file content from GitHub repository
 * @param params Parameters object
 * @returns File content
 */
export declare function getFileContent({ octokit, owner, repo, path, ref, maxLines }: FileContentOptions): Promise<string>;
/**
 * Manage context to stay within token limits
 * @param params Parameters object
 * @returns Optimized context with diff and file contents
 */
export declare function optimizeContext({ diff, fileContents, modelMaxTokens, safetyFactor }: OptimizeContextOptions): OptimizeContextResult;
