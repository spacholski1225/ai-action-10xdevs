import { PRDiffOptions, PRDiffResult, RepoInfo, PRCommentOptions } from './types/github.js';
/**
 * Get a PR diff using the GitHub API
 * @param options Options for getting the diff
 * @returns The PR diff and PR number
 */
export declare function getPRDiff({ token, owner, repo, prNumber }: PRDiffOptions): Promise<PRDiffResult>;
/**
 * Extract the PR number from the GitHub context
 * @returns The PR number or null if not a PR
 */
export declare function extractPRNumber(): number | null;
/**
 * Get the repository owner and name from the GitHub context
 * @returns Object containing owner and repo
 */
export declare function getRepoInfo(): RepoInfo;
/**
 * Comment on a pull request
 * @param options Options for commenting on the PR
 */
export declare function commentOnPR({ token, owner, repo, prNumber, body }: PRCommentOptions): Promise<void>;
