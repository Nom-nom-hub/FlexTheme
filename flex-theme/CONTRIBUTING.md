# Contributing to FlexTheme

Thank you for considering contributing to FlexTheme! This document provides guidelines and instructions for contributing to this project.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/FlexTheme.git`
3. Install dependencies: `pnpm install`
4. Run tests: `pnpm test`

## Development Workflow

1. Create a new branch for your feature or bugfix: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests to ensure everything works: `pnpm test`
4. Check bundle size: `pnpm run size`
5. Build the package: `pnpm run build`
6. Commit your changes following [conventional commits](https://www.conventionalcommits.org/)
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a pull request

## Monorepo Structure

This project is organized as a monorepo with multiple packages:

- `@teckmill/flex-theme-core`: Core functionality for theme management
- `@teckmill/flex-theme-react`: React hooks for theme management
- Additional framework integrations

## Testing

We use Vitest for testing. Please ensure all tests pass before submitting a pull request:

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

## Code Style

- Follow the existing code style
- Use TypeScript for all new code
- Document public APIs with JSDoc comments
- Keep bundle size small

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the CHANGELOG.md following the Keep a Changelog format
3. The PR should work in all supported environments
4. Ensure all CI checks pass
5. A maintainer will review and merge your PR

## Release Process

Releases are handled by the maintainers. The process is:

1. Update version in package.json files
2. Update CHANGELOG.md
3. Create a git tag: `git tag v1.x.x`
4. Push the tag: `git push origin v1.x.x`
5. Publish to npm: `pnpm -r publish --access=public`

## Questions?

If you have any questions, feel free to open an issue for discussion.
