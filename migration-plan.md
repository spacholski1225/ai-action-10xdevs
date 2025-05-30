# TypeScript Migration Plan for 10x AI Action

## 1. Project Overview

The 10x AI Action is a GitHub Action that provides AI-powered code review for pull requests using Anthropic AI. The codebase consists of several JavaScript files structured in a modular way:

- `src/index.js` - Main orchestration file
- `src/github-utils.js` - Handles GitHub API interactions
- `src/code-review.js` - Integrates with Anthropic AI for code review
- `src/context-manager.js` - Manages context and file optimization
- `action.yml` - Defines the GitHub Action configuration

## 2. Migration Goals

- Convert all JavaScript files to TypeScript with strict type checking
- Maintain the existing functionality and architecture
- Ensure compatibility with GitHub Actions environment
- Set up a TypeScript build pipeline to replace the current rolldown configuration
- Document the migration process and changes

## 3. Detailed Migration Plan

```mermaid
gantt
    title TypeScript Migration Plan
    dateFormat YYYY-MM-DD
    section Setup
    Setup TypeScript Configuration            :setup, 2025-05-30, 1d
    Update Build Process                      :build, after setup, 1d
    section Migration
    Create Type Definitions                   :types, after setup, 2d
    Migrate src/context-manager.js            :cm, after types, 1d
    Migrate src/github-utils.js               :gu, after types, 1d
    Migrate src/code-review.js                :cr, after types, 1d
    Migrate src/index.js                      :idx, after cm, after gu, after cr, 1d
    section Validation
    Test Migration                            :test, after idx, 1d
    Update Documentation                      :docs, after test, 1d
```

### 3.1. Setup TypeScript Configuration

1. **Install TypeScript and Required Dependencies**:
   ```bash
   npm install --save-dev typescript @types/node @types/actions/core @types/actions/github
   ```

2. **Create `tsconfig.json` with Strict Configuration**:
   ```json
   {
     "compilerOptions": {
       "target": "es2022",
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "esModuleInterop": true,
       "strict": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitAny": true,
       "noImplicitThis": true,
       "alwaysStrict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noImplicitReturns": true,
       "noFallthroughCasesInSwitch": true,
       "forceConsistentCasingInFileNames": true,
       "outDir": "./dist",
       "declaration": true,
       "sourceMap": true,
       "lib": ["es2022"],
       "types": ["node", "@actions/core", "@actions/github"]
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

### 3.2. Define Common Types

Create a `src/types` directory with the following type definition files:

1. **`src/types/index.ts`**:
   ```typescript
   // Export all types from the directory
   export * from './github.js';
   export * from './anthropic.js';
   export * from './context.js';
   ```

2. **`src/types/github.ts`**:
   ```typescript
   import { Octokit } from '@actions/github';

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
   ```

3. **`src/types/anthropic.ts`**:
   ```typescript
   export interface AICodeReviewOptions {
     model: string;
     maxTokens?: number;
   }
   ```

4. **`src/types/context.ts`**:
   ```typescript
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
   ```

### 3.3. Update Build Process

1. **Update `package.json` Build Script**:
   ```json
   "scripts": {
     "build": "tsc && npm run bundle",
     "bundle": "npx rolldown -c rolldown.config.js"
   }
   ```

2. **Update `rolldown.config.js` to Handle TypeScript**:
   ```javascript
   export default {
     input: 'dist/index.js',
     output: {
       file: 'dist/index.cjs',
       format: 'cjs'
     },
     external: [
       '@actions/core',
       '@actions/github',
       '@anthropic-ai/sdk',
       '@google/genai',
       'dotenv',
       'fs'
     ]
   };
   ```

### 3.4. Migrate Individual Files

For each source file:
1. Rename to `.ts` extension
2. Add type annotations for functions and parameters
3. Add explicit return types
4. Apply strict null checking
5. Import types from the types directory

#### 3.4.1. File Migration Checklist

- [ ] src/context-manager.ts
- [ ] src/github-utils.ts
- [ ] src/code-review.ts
- [ ] src/index.ts

### 3.5. Update Package.json

Update `package.json` to include TypeScript dependencies and configuration:

```json
{
  "name": "10x-ai-action",
  "version": "1.0.0",
  "description": "AI-powered PR reviewer that uses GitHub SDK and Google Gemini",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc && npm run bundle",
    "bundle": "npx rolldown -c rolldown.config.js",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@actions/core": "1.11.1",
    "@actions/github": "6.0.0",
    "@anthropic-ai/sdk": "^0.51.0",
    "@google/genai": "0.9.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.0",
    "rolldown": "1.0.0-beta.8"
  }
}
```

## 4. Testing and Validation Strategy

### 4.1. Local Testing

1. Build the TypeScript project:
   ```bash
   npm run build
   ```

2. Verify that the build process succeeds without errors.

3. Run a local test with sample PR data to ensure the action functions as expected.

### 4.2. GitHub Actions Testing

1. Create a test branch and push the TypeScript changes.

2. Set up a workflow that uses the action against a test PR.

3. Verify that the action executes correctly and provides the expected code review comments.

## 5. Documentation Updates

### 5.1. Update README.md

Add information about TypeScript to the README:

```markdown
## Development

This action is written in TypeScript and structured in a modular way:

- `src/github-utils.ts` - Handles GitHub API interactions
- `src/code-review.ts` - Contains the AI review logic
- `src/context-manager.ts` - Handles context optimization and file content management
- `src/index.ts` - Main orchestration file
- `src/types/` - TypeScript type definitions
- `action.yml` - Defines the GitHub Action

To modify:

1. Clone the repository
2. Make changes to the source files
3. Run `npm run build` to compile TypeScript and update the dist directory
4. Commit and push your changes
```

### 5.2. Add TypeScript Configuration Documentation

Create a `DEVELOPMENT.md` file with information about the TypeScript setup and migration.

## 6. Migration Timeline and Approach

The migration should be approached systematically:

1. **Setup Phase (Day 1)**:
   - Install TypeScript and dependencies
   - Configure TypeScript with strict settings
   - Set up the initial build pipeline

2. **Type Definition Phase (Day 1-2)**:
   - Create core type definitions
   - Document type interfaces

3. **Migration Phase (Day 2-3)**:
   - Convert files one by one, starting with helper modules
   - Apply strict typing to all functions and variables
   - Test each module as it's converted

4. **Integration Phase (Day 3-4)**:
   - Ensure all modules work together correctly
   - Optimize type definitions based on integration testing

5. **Validation Phase (Day 4-5)**:
   - Perform comprehensive testing
   - Update documentation
   - Finalize the migration

## 7. Potential Challenges and Mitigation

1. **Challenge**: Strict null checking might reveal potential null reference issues.
   **Mitigation**: Use non-null assertions, optional chaining, or proper null checks.

2. **Challenge**: Type definitions for third-party libraries might be incomplete.
   **Mitigation**: Create custom type definitions or use type assertions where needed.

3. **Challenge**: Build process changes might affect how the action is executed.
   **Mitigation**: Test the action thoroughly in a GitHub Actions environment.

4. **Challenge**: Type errors in existing code might be difficult to resolve.
   **Mitigation**: Introduce temporary type assertions while fixing the underlying issues.