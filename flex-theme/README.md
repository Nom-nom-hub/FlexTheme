# flex-theme

[![npm version](https://img.shields.io/npm/v/flex-theme.svg)](https://www.npmjs.com/package/flex-theme)
[![License](https://img.shields.io/npm/l/flex-theme.svg)](https://github.com/yourusername/flex-theme/blob/main/LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/flex-theme)](https://bundlephobia.com/package/flex-theme)
[![CI](https://github.com/yourusername/flex-theme/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/flex-theme/actions/workflows/ci.yml)

A lightweight, flexible theme management system for light/dark modes in web applications.

- 🌓 Light, dark, and auto themes with system detection
- 💾 Persists preferences using localStorage
- 🔄 Runtime reactivity with callback listeners
- ⚛️ React hook support
- 🌐 SSR-safe (no window references on server)
- 🪶 Zero dependencies
- 📦 Tree-shakable with "sideEffects: false"

## Installation

```bash
# npm
npm install flex-theme

# yarn
yarn add flex-theme

# pnpm
pnpm add flex-theme
```

## Usage

### Vanilla JavaScript/TypeScript

```typescript
import { setTheme, getTheme, toggleTheme, onThemeChange } from 'flex-theme';

// Get the current theme ('light', 'dark', or 'auto')
const currentTheme = getTheme();

// Set the theme
setTheme('dark');

// Toggle between light and dark
toggleTheme();

// Listen for theme changes
const unsubscribe = onThemeChange((theme, resolvedTheme) => {
  console.log(`Theme changed to ${theme} (resolved as ${resolvedTheme})`);
});

// Stop listening for changes
unsubscribe();

// Configure with custom options
import { configure } from 'flex-theme';

configure({
  attribute: 'data-mode', // default: 'data-theme'
  storageKey: 'my-theme', // default: 'flex-theme'
  defaultTheme: 'light'   // default: 'auto'
});
```

### React

```tsx
import { useFlexTheme } from 'flex-theme/react';

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useFlexTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved as: {resolvedTheme}</p>

      <button onClick={toggleTheme}>
        Toggle theme
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'auto')}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  );
}
```

## API

### Core API

- `getTheme()`: Returns the current theme ('light', 'dark', or 'auto')
- `getResolvedTheme()`: Returns the resolved theme ('light' or 'dark'), accounting for 'auto' setting
- `setTheme(theme)`: Sets the theme to 'light', 'dark', or 'auto'
- `toggleTheme()`: Toggles between light and dark themes
- `onThemeChange(callback)`: Registers a callback for theme changes, returns an unsubscribe function
- `configure(options)`: Configures the theme system with custom options

### React Hook

- `useFlexTheme()`: Returns an object with:
  - `theme`: Current theme ('light', 'dark', or 'auto')
  - `resolvedTheme`: Resolved theme ('light' or 'dark')
  - `setTheme`: Function to set the theme
  - `toggleTheme`: Function to toggle between light and dark

## How it works

flex-theme applies the theme by setting a `data-theme` attribute on the `<html>` element. You can then use CSS to style your application based on this attribute:

```css
:root {
  --background: #ffffff;
  --text: #000000;
}

[data-theme="dark"] {
  --background: #1a1a1a;
  --text: #ffffff;
}

body {
  background-color: var(--background);
  color: var(--text);
}
```

## Examples

Check out the examples in the [examples](./examples) directory:

- [Vanilla JS Example](./examples/vanilla/index.html)
- [React Example](./examples/react/)

## Testing

This package includes comprehensive tests to ensure reliability:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a history of changes.

## License

MIT
