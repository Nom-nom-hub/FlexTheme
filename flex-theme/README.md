# FlexTheme

[![npm version](https://img.shields.io/npm/v/flex-theme.svg?style=flat)](https://www.npmjs.com/package/flex-theme)
[![bundle size](https://img.shields.io/bundlephobia/minzip/flex-theme)](https://bundlephobia.com/package/flex-theme)
[![license](https://img.shields.io/npm/l/flex-theme.svg)](https://github.com/Nom-nom-hub/FlexTheme/blob/main/LICENSE)

A flexible, lightweight theming system for web applications with built-in dark mode support.

## Features

- 🌓 Light/dark/system theme modes
- 🔄 Automatic system preference detection
- 💾 Persistent theme storage
- 🔌 Framework agnostic (works with React, Vue, Angular, or vanilla JS)
- 🧩 TypeScript support with full type definitions
- 🏎️ Tiny footprint (~1.3KB minified and gzipped)
- 🌐 SSR-friendly implementation
- 🧠 Simple, intuitive API

## Installation

```bash
npm install flex-theme
# or
yarn add flex-theme
# or
pnpm add flex-theme
```

## Basic Usage

```javascript
import { getTheme, setTheme, toggleTheme } from 'flex-theme';

// Get the current theme ('light', 'dark', or 'system')
const currentTheme = getTheme(); 

// Set the theme
setTheme('dark');

// Toggle between light and dark
toggleTheme(); 

// Listen for theme changes
import { onThemeChange } from 'flex-theme';

// Register a listener
const unsubscribe = onThemeChange((theme) => {
  console.log(`Theme changed to: ${theme}`);
});

// Later, unsubscribe when no longer needed
unsubscribe();
```

## React Integration

```jsx
import { useFlexTheme } from 'flex-theme';

function ThemeToggle() {
  const { theme, toggleTheme } = useFlexTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

## API Reference

### Core Functions

| Function | Description |
|----------|-------------|
| `getTheme()` | Returns the current theme ('light', 'dark', or 'system') |
| `setTheme(theme)` | Sets the theme to the specified value |
| `toggleTheme()` | Toggles between light and dark themes |
| `getResolvedTheme()` | Returns the resolved theme ('light' or 'dark'), taking into account system preferences when set to 'system' |
| `onThemeChange(callback)` | Registers a callback to be called when the theme changes |
| `offThemeChange(callback)` | Removes a previously registered theme change callback |

### React Hooks

| Hook | Description |
|------|-------------|
| `useFlexTheme()` | Returns an object with theme state and methods to control it |
| `useSystemTheme()` | Returns the system's preferred theme ('light' or 'dark') |
| `useThemeWithStorage()` | Theme hook with localStorage persistence |

## Browser Support

FlexTheme works in all modern browsers (Chrome, Firefox, Safari, Edge).

## License

MIT © [Teck] 