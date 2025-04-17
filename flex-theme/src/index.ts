import { Theme, FlexThemeConfig, ThemeChangeListener, FlexThemeResult } from './types';

// Default configuration
const defaultConfig: Required<FlexThemeConfig> = {
  attribute: 'data-theme',
  storageKey: 'flex-theme',
  defaultTheme: 'auto',
  defaultLocale: 'en-US',
  enableRtl: true,
  enableMobileOptimizations: true,
};

// Store configuration
let config = { ...defaultConfig };

// Store for theme change listeners
const listeners: Set<ThemeChangeListener> = new Set();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Get the current system color scheme preference
 */
function getSystemTheme(): 'light' | 'dark' {
  if (!isBrowser) return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Get the stored theme from localStorage
 */
function getStoredTheme(): Theme | null {
  if (!isBrowser) return null;

  try {
    return localStorage.getItem(config.storageKey) as Theme | null;
  } catch (e) {
    console.warn('Failed to read theme from localStorage:', e);
    return null;
  }
}

/**
 * Store the theme in localStorage
 */
function storeTheme(theme: Theme): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(config.storageKey, theme);
  } catch (e) {
    console.warn('Failed to store theme in localStorage:', e);
  }
}

/**
 * Apply the theme to the HTML element
 */
function applyTheme(theme: Theme): void {
  if (!isBrowser) return;

  const resolvedTheme = theme === 'auto' ? getSystemTheme() : theme;
  const html = document.documentElement;

  html.setAttribute(config.attribute, resolvedTheme);

  // Notify listeners
  listeners.forEach(listener => {
    listener(theme, resolvedTheme);
  });
}

/**
 * Initialize the theme system
 */
function initialize(): void {
  if (!isBrowser) return;

  // Set up system theme change listener
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Modern approach (newer browsers)
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', () => {
      const currentTheme = getTheme();
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  }
  // Legacy approach (older browsers)
  else if ('addListener' in mediaQuery) {
    // @ts-ignore - For older browsers
    mediaQuery.addListener(() => {
      const currentTheme = getTheme();
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  }

  // Apply initial theme
  const storedTheme = getStoredTheme();
  const initialTheme = storedTheme || config.defaultTheme;
  applyTheme(initialTheme);

  // Apply internationalization
  if (config.enableRtl) {
    // Import and use i18n functionality
    import('./i18n').then(({ getLocale, configureLocale }) => {
      const locale = getLocale();
      configureLocale(locale);
    }).catch(err => {
      console.warn('Failed to load i18n module:', err);
    });
  }

  // Apply mobile optimizations
  if (config.enableMobileOptimizations) {
    // Import and use mobile utilities
    import('./utils/mobile').then(({ applyMobileOptimizations, setupMobileViewport }) => {
      applyMobileOptimizations();
      setupMobileViewport();
    }).catch(err => {
      console.warn('Failed to load mobile utilities:', err);
    });
  }

  // Apply CSS variables
  import('./utils/cssVariables').then(({ injectCSSVariables }) => {
    injectCSSVariables();
  }).catch(err => {
    console.warn('Failed to load CSS variables utilities:', err);
  });
}

/**
 * Configure the theme system
 */
export function configure(userConfig: FlexThemeConfig = {}): void {
  config = {
    ...defaultConfig,
    ...userConfig,
  };

  // Re-initialize with new config
  initialize();
}

/**
 * Get the current theme
 */
export function getTheme(): Theme {
  if (!isBrowser) return config.defaultTheme;
  return (getStoredTheme() || config.defaultTheme);
}

/**
 * Get the resolved theme (light or dark)
 */
export function getResolvedTheme(): 'light' | 'dark' {
  const theme = getTheme();
  return theme === 'auto' ? getSystemTheme() : theme;
}

/**
 * Set the theme
 */
export function setTheme(theme: Theme): void {
  if (!isBrowser) return;

  storeTheme(theme);
  applyTheme(theme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const currentTheme = getTheme();
  const resolvedTheme = getResolvedTheme();

  if (resolvedTheme === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
}

/**
 * Register a theme change listener
 */
export function onThemeChange(listener: ThemeChangeListener): () => void {
  listeners.add(listener);

  // Return a function to remove the listener
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Get the full theme API
 */
export function useFlexTheme(): FlexThemeResult {
  if (!isBrowser) {
    return {
      theme: config.defaultTheme,
      resolvedTheme: config.defaultTheme === 'auto' ? 'light' : config.defaultTheme,
      setTheme,
      toggleTheme,
    };
  }

  return {
    theme: getTheme(),
    resolvedTheme: getResolvedTheme(),
    setTheme,
    toggleTheme,
  };
}

// Initialize on load
if (isBrowser) {
  // Use setTimeout to ensure this runs after the DOM is ready
  setTimeout(() => {
    initialize();
  }, 0);
}

export type { Theme, FlexThemeConfig, ThemeChangeListener, FlexThemeResult } from './types';

// Export tokens
export * from './tokens';

// Export utilities
export * from './utils';

// Export i18n
export * from './i18n';

// Export animations
export * from './animations';

// Export presets
export * from './presets';
