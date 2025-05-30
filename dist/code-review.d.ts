import { AICodeReviewOptions } from './types/anthropic.js';
/**
 * Performs an AI code review on a PR diff using Anthropic's Claude model
 * @param prDiff The PR diff to review
 * @param fileContents Map of file paths to their full content
 * @param apiKey Anthropic API key
 * @param options Additional options
 * @returns The AI review feedback
 */
export declare function performAICodeReview(prDiff: string, fileContents: Record<string, string> | undefined, apiKey: string, options: AICodeReviewOptions): Promise<string>;
