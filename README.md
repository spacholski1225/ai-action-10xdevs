# 10x AI Action

A GitHub Action that provides AI-powered code review for pull requests using Anthropic AI.

## Features

- Uses GitHub Actions SDK instead of shell scripts for better reliability
- Gets PR diffs using the GitHub API
- Analyzes code changes with Anthropic AI
- Posts review comments on pull requests
- Works with both PR events and direct commits

## Usage

Add this action to your workflow:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: spacholski1225/ai-action-10xdevs@git-diff
        with:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## How It Works

This action uses a modular approach:

1. **GitHub API Integration**: Uses the GitHub SDK (`@actions/github`) to fetch PR diffs programmatically
2. **AI Analysis**: Processes the diff through Anthropic AI model for code review
3. **Comment Generation**: Posts the AI feedback as a comment on the PR

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

### TypeScript Configuration

The project uses strict TypeScript configuration with:
- Strict null checking
- No implicit any types
- Unused parameter detection
- Comprehensive type safety

### Build Process

- `npm run typecheck` - Type checking without compilation
- `npm run build` - Full build (TypeScript compilation + bundling)
- `npm run bundle` - Bundle the compiled JavaScript
