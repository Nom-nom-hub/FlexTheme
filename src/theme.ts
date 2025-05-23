import { Theme, ResolvedTheme, ThemeConfig } from './types';

// Default configuration
const defaultConfig: ThemeConfig = {
  attribute: 'data-theme',
  defaultTheme: 'auto',
  storageKey: 'flex-theme'
};

// Current configuration
let config = { ...defaultConfig };

// Callbacks for theme changes
const themeChangeCallbacks: Array<(theme: Theme, resolvedTheme: ResolvedTheme) => void> = [];

/**
 * Safely check if window.matchMedia is available and matches the query
 * @param query Media query to check
 * @returns True if the media query matches, false otherwise
 */
function safeMatchMedia(query: string): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  
  return window.matchMedia(query).matches;
}

/**
 * Configure the theme system
 * @param options Configuration options
 */
export function configure(options: Partial<ThemeConfig>): void {
  config = { ...config, ...options };
  
  // Re-initialize with new config
  if (typeof window !== 'undefined') {
    initializeTheme();
  }
}

// Simplified theme module for building
export type Theme = 'light' | 'dark' | 'system';

// Default theme
let currentTheme: Theme = 'system';

/**
 * Get the current theme
 */
export function getTheme(): Theme {
  return currentTheme;
}

/**
 * Get the resolved theme (light or dark)
 * Takes into account the 'auto' setting
 * @returns The resolved theme ('light' or 'dark')
 */
export function getResolvedTheme(): ResolvedTheme {
  const theme = getTheme();
  
  if (theme === 'auto') {
    // Use system preference for auto theme
    return safeMatchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
  }
  
  return theme;
}

/**
 * Set the theme
 */
export function setTheme(theme: Theme): void {
  if (!['light', 'dark', 'system'].includes(theme)) {
    console.error(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'system'`);
    return;
  }
  
  currentTheme = theme;
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * Apply the theme to the DOM
 * @param theme The theme to apply
 */
function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return;
  
  const resolvedTheme = theme === 'auto'
    ? (safeMatchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light')
    : theme;
  
  document.documentElement.setAttribute(config.attribute, resolvedTheme);
}

/**
 * Initialize the theme system
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getTheme();
  applyThemeToDOM(theme);
  
  // Listen for system preference changes
  if (typeof window.matchMedia === 'function') {
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Use modern event listener if available, fall back to deprecated method
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', () => {
          if (getTheme() === 'auto') {
            applyThemeToDOM('auto');
            
            // Notify subscribers
            const resolvedTheme = getResolvedTheme();
            themeChangeCallbacks.forEach(callback => callback('auto', resolvedTheme));
          }
        });
      } else if (mediaQuery.addListener) {
        // Deprecated but needed for older browsers
        mediaQuery.addListener(() => {
          if (getTheme() === 'auto') {
            applyThemeToDOM('auto');
            
            // Notify subscribers
            const resolvedTheme = getResolvedTheme();
            themeChangeCallbacks.forEach(callback => callback('auto', resolvedTheme));
          }
        });
      }
    } catch (e) {
      console.error('Error setting up media query listener:', e);
    }
  }
}

/**
 * Register a callback for theme changes
 * @param callback Function to call when the theme changes
 * @returns Function to unregister the callback
 */
export function onThemeChange(
  callback: (theme: Theme, resolvedTheme: ResolvedTheme) => void
): () => void {
  themeChangeCallbacks.push(callback);
  
  return () => {
    const index = themeChangeCallbacks.indexOf(callback);
    if (index !== -1) {
      themeChangeCallbacks.splice(index, 1);
    }
  };
}

// Initialize on import if in browser environment
if (typeof window !== 'undefined') {
  initializeTheme();
}

// Export a ThemeProvider component for frameworks that need it
export const ThemeProvider = ({ children }: { children: any }) => {
  // This is a simple wrapper that doesn't actually do anything
  // since our theme management is global
  return children;
};
