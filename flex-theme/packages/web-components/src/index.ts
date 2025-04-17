import { FlexThemeToggle } from './theme-toggle';

// Define custom elements
if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
  if (!customElements.get('flex-theme-toggle')) {
    customElements.define('flex-theme-toggle', FlexThemeToggle);
  }
}

// Export components
export { FlexThemeToggle };

// Re-export from flex-theme
export { 
  getTheme, 
  getResolvedTheme, 
  setTheme, 
  toggleTheme, 
  onThemeChange, 
  configure,
  getLocale,
  configureLocale,
  getMessage,
  formatDate,
  formatTime,
} from 'flex-theme';

// Re-export types
export type { 
  Theme, 
  FlexThemeConfig, 
  ThemeChangeListener, 
  FlexThemeResult,
  Locale,
} from 'flex-theme';
