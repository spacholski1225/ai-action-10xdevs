# Development Guide

## TypeScript Migration

This project has been migrated from JavaScript to TypeScript to improve code quality, maintainability, and developer experience.

### Migration Overview

The migration included:

1. **TypeScript Configuration**: Strict TypeScript setup with comprehensive type checking
2. **Type Definitions**: Custom type definitions for GitHub API interactions, Anthropic AI integration, and context management
3. **Build Pipeline**: Updated build process to compile TypeScript before bundling
4. **Code Quality**: Enhanced type safety and error detection

### Project Structure

```
src/
├── types/
│   ├── index.ts          # Main type exports
│   ├── github.ts         # GitHub API types
│   ├── anthropic.ts      # Anthropic AI types
│   └── context.ts        # Context management types
├── context-manager.ts    # File content and context optimization
├── github-utils.ts       # GitHub API interactions
├── code-review.ts        # AI code review logic
└── index.ts             # Main orchestration
```

### TypeScript Configuration

The project uses strict TypeScript configuration (`tsconfig.json`) with:

- **Target**: ES2022 for modern JavaScript features
- **Module System**: NodeNext for proper ESM support
- **Strict Mode**: All strict checks enabled
- **Output**: Declaration files and source maps generated
- **Type Checking**: Comprehensive error detection

### Build Process

1. **TypeScript Compilation**: `tsc` compiles TypeScript to JavaScript
2. **Bundling**: `rolldown` bundles the compiled code for GitHub Actions
3. **Output**: Generated files in `dist/` directory

### Development Commands

```bash
# Type checking only (no compilation)
npm run typecheck

# Full build (compile + bundle)
npm run build

# Bundle only (after compilation)
npm run bundle
```

### Type Safety Features

- **Strict Null Checks**: Prevents null/undefined errors
- **Type Annotations**: All functions have explicit parameter and return types
- **Interface Definitions**: Clear contracts for data structures
- **Generic Types**: Type-safe collections and utilities

### Migration Benefits

1. **Better IDE Support**: Enhanced autocomplete and error detection
2. **Compile-time Error Detection**: Catch errors before runtime
3. **Improved Documentation**: Types serve as inline documentation
4. **Refactoring Safety**: Confident code changes with type checking
5. **Team Collaboration**: Clear interfaces and contracts

### Troubleshooting

#### Common TypeScript Errors

1. **Module Resolution**: Ensure imports use `.js` extensions for compiled output
2. **Type Assertions**: Use proper type guards instead of `any` types
3. **Null Safety**: Handle potential null/undefined values explicitly

#### Build Issues

1. **Clean Build**: Remove `dist/` directory and rebuild if needed
2. **Type Errors**: Run `npm run typecheck` to identify type issues
3. **Bundle Errors**: Ensure TypeScript compilation succeeds before bundling

### Contributing

When making changes:

1. Follow existing TypeScript patterns
2. Add type annotations for new functions
3. Update type definitions when adding new interfaces
4. Run type checking before committing
5. Ensure build process completes successfully

### Future Improvements

- Add ESLint with TypeScript rules
- Implement unit tests with TypeScript
- Consider stricter compiler options
- Add pre-commit hooks for type checking