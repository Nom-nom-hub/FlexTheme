---
sidebar_position: 3
---

# Usage

flex-theme can be used with any JavaScript framework or with vanilla JavaScript.

## Vanilla JavaScript

```javascript
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

## React

```jsx
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
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  );
}
```

## Vue

```vue
<script setup>
import { useFlexTheme } from '@flex-theme/vue';

const { theme, resolvedTheme, setTheme, toggleTheme } = useFlexTheme();
</script>

<template>
  <div>
    <p>Current theme: {{ theme }}</p>
    <p>Resolved as: {{ resolvedTheme }}</p>
    
    <button @click="toggleTheme">
      Toggle theme
    </button>
    
    <select 
      :value="theme" 
      @change="e => setTheme(e.target.value)"
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="auto">Auto</option>
    </select>
  </div>
</template>
```

## Angular

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { FlexThemeService } from '@flex-theme/angular';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <p>Current theme: {{ themeService.theme$ | async }}</p>
      <p>Resolved as: {{ themeService.resolvedTheme$ | async }}</p>
      
      <button (click)="themeService.toggleTheme()">
        Toggle theme
      </button>
      
      <select 
        [value]="themeService.theme$ | async" 
        (change)="themeService.setTheme($event.target.value)"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
      </select>
    </div>
  `
})
export class AppComponent {
  constructor(public themeService: FlexThemeService) {}
}
```

## Tailwind CSS

```javascript
// tailwind.config.js
const flexTheme = require('@flex-theme/tailwind');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flexTheme()
  ],
}
```

## CSS Variables

flex-theme applies the theme by setting a `data-theme` attribute on the `<html>` element. You can use this attribute to style your application:

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

flex-theme also provides a set of CSS variables that you can use in your application. These variables are automatically injected into the document when the theme is initialized.

```css
body {
  background-color: var(--color-background);
  color: var(--color-textPrimary);
}

.button {
  background-color: var(--color-primary);
  color: var(--color-textOnPrimary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}
```
