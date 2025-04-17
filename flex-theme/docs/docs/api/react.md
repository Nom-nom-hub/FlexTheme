---
sidebar_position: 2
---

# React API

The React API provides hooks and components for using flex-theme in React applications.

## useFlexTheme Hook

```typescript
function useFlexTheme(options?: {
  locale?: Locale;
}): {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, params?: Record<string, string>) => string;
}
```

The `useFlexTheme` hook provides access to the theme state and methods for changing the theme.

### Parameters

- `options` (optional): Configuration options
  - `locale` (optional): The locale to use for translations

### Returns

- `theme`: The current theme ('light', 'dark', or 'auto')
- `resolvedTheme`: The resolved theme ('light' or 'dark'), accounting for 'auto' setting
- `setTheme`: Function to set the theme
- `toggleTheme`: Function to toggle between light and dark themes
- `locale`: The current locale
- `setLocale`: Function to set the locale
- `t`: Function to get a translated message

### Example

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

## Internationalization Example

```jsx
import { useFlexTheme } from 'flex-theme/react';

function LocalizedThemeToggle() {
  const { theme, setTheme, locale, setLocale, t } = useFlexTheme();

  return (
    <div>
      <p>{t('themes.current')}: {t(`themes.${theme}`)}</p>
      
      <button onClick={() => setTheme('light')}>
        {t('themes.light')}
      </button>
      
      <button onClick={() => setTheme('dark')}>
        {t('themes.dark')}
      </button>
      
      <select 
        value={locale} 
        onChange={(e) => setLocale(e.target.value)}
      >
        <option value="en-US">English</option>
        <option value="es-ES">Español</option>
        <option value="fr-FR">Français</option>
      </select>
    </div>
  );
}
```
