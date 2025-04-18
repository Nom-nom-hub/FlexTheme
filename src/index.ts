// Export core functionality
export {
  getTheme,
  setTheme,
  toggleTheme,
  onThemeChange,
  offThemeChange,
  ThemeProvider
} from './theme';

// Import and export types
import { ThemeMode, ThemeListener } from './types';
export { ThemeMode, ThemeListener };

// Export React-specific functionality
export {
  useTheme,
  useToggleTheme,
  useSystemTheme,
  useThemeWithStorage
} from './react';
