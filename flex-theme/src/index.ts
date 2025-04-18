// Export theme functionality
export { getTheme, setTheme, toggleTheme, onThemeChange, offThemeChange } from './theme';

// Export React hooks
export { 
  useToggleTheme,
  useSystemTheme, 
  useThemeWithStorage,
  useTheme as useReactTheme
} from './react';

// Export types
export type { ThemeMode, ThemeListener } from './types'; 