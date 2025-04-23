# 10x AI Action

A GitHub Action that provides AI-powered code review for pull requests using Google's Gemini AI.

## Features

- Uses GitHub Actions SDK instead of shell scripts for better reliability
- Gets PR diffs using the GitHub API
- Analyzes code changes with Google's Gemini AI
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
      - uses: przeprogramowani/ai-action@master
        with:
          GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
```

## How It Works

This action uses a modular approach:

1. **GitHub API Integration**: Uses the GitHub SDK (`@actions/github`) to fetch PR diffs programmatically
2. **AI Analysis**: Processes the diff through Google's Gemini AI model for code review
3. **Comment Generation**: Posts the AI feedback as a comment on the PR

## Development

The action is structured in a modular way:

- `src/github-utils.js` - Handles GitHub API interactions
- `src/use-ai.js` - Contains the AI review logic
- `src/index.js` - Main orchestration file
- `action.yml` - Defines the GitHub Action

To modify:

1. Clone the repository
2. Make changes to the source files
3. Run `npm run build` to update the dist directory
4. Commit and push your changes
