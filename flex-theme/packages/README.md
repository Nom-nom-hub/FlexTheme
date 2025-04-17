# flex-theme Monorepo

This directory contains the monorepo structure for flex-theme packages.

## Packages

- **@flex-theme/core**: Core functionality for theme management
- **@flex-theme/react**: React hooks for theme management

## Development

### Setup

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Install dependencies
pnpm install
```

### Commands

```bash
# Build all packages
pnpm build

# Run tests for all packages
pnpm test

# Run development mode for all packages
pnpm dev
```

## Package Structure

Each package has its own:
- `package.json`
- `tsconfig.json`
- `src` directory
- `test` directory

## Publishing

Packages are published individually but versioned together.

```bash
# From the root directory
pnpm -r publish
```
