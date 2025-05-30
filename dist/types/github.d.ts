import { getOctokit } from '@actions/github';
type Octokit = ReturnType<typeof getOctokit>;
export interface RepoInfo {
    owner: string;
    repo: string;
}
export interface PRDiffOptions {
    token: string;
    owner: string;
    repo: string;
    prNumber: number | null;
}
export interface PRDiffResult {
    diff: string;
    prNumber: number | null;
}
export interface PRCommentOptions {
    token: string;
    owner: string;
    repo: string;
    prNumber: number;
    body: string;
}
export interface FileContentOptions {
    octokit: Octokit;
    owner: string;
    repo: string;
    path: string;
    ref?: string;
    maxLines?: number;
}
export {};
