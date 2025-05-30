export interface OptimizeContextOptions {
  diff: string;
  fileContents: Record<string, string>;
  modelMaxTokens?: number;
  safetyFactor?: number;
}

export interface OptimizeContextResult {
  diff: string;
  fileContents: Record<string, string>;
  estimatedTokens: number;
}