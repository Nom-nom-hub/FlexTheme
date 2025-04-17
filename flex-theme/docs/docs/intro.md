---
sidebar_position: 1
---

# Introduction

**flex-theme** is a lightweight, flexible theme management system for light/dark modes in web applications.

## Features

- 🌓 Light, dark, and auto themes with system detection
- 💾 Persists preferences using localStorage
- 🔄 Runtime reactivity with callback listeners
- ⚛️ React hook support
- 🌐 SSR-safe (no window references on server)
- 🪶 Zero dependencies
- 📦 Tree-shakable with "sideEffects: false"
- 🌍 Internationalization support
- 📱 Mobile optimizations
- ♿ Accessibility features

## Why flex-theme?

There are many theme management libraries available, but flex-theme stands out with its:

- **Simplicity**: Easy to understand and use
- **Flexibility**: Works with any framework or vanilla JS
- **Performance**: Tiny bundle size with no dependencies
- **Extensibility**: Modular design for easy customization
- **Accessibility**: Built with a11y in mind

## Quick Example

```jsx
// Vanilla JavaScript
import { setTheme, getTheme, toggleTheme } from 'flex-theme';

// Set the theme
setTheme('dark');

// Get the current theme
const currentTheme = getTheme(); // 'dark'

// Toggle between light and dark
toggleTheme(); // Now 'light'

// React Hook
import { useFlexTheme } from 'flex-theme/react';

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useFlexTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {resolvedTheme}
    </button>
  );
}
```

Ready to get started? Check out the [Installation](./installation.md) guide.
