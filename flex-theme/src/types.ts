/**
 * Available theme options
 */
export type Theme = 'light' | 'dark' | 'auto';

/**
 * Configuration options for FlexTheme
 */
export interface FlexThemeConfig {
  /**
   * The attribute name to set on the HTML element
   * @default 'data-theme'
   */
  attribute?: string;

  /**
   * The key to use for localStorage
   * @default 'flex-theme'
   */
  storageKey?: string;

  /**
   * Default theme to use if no theme is stored
   * @default 'auto'
   */
  defaultTheme?: Theme;

  /**
   * Default locale to use
   * @default 'en-US'
   */
  defaultLocale?: string;

  /**
   * Whether to enable RTL support
   * @default true
   */
  enableRtl?: boolean;

  /**
   * Whether to automatically apply mobile optimizations
   * @default true
   */
  enableMobileOptimizations?: boolean;
}

/**
 * Theme change listener function
 */
export type ThemeChangeListener = (theme: Theme, resolvedTheme: 'light' | 'dark') => void;

/**
 * Return type for useFlexTheme hook and core API
 */
export interface FlexThemeResult {
  /** Current theme value ('light', 'dark', or 'auto') */
  theme: Theme;

  /** Resolved theme ('light' or 'dark'), accounting for 'auto' setting */
  resolvedTheme: 'light' | 'dark';

  /** Set the theme */
  setTheme: (theme: Theme) => void;

  /** Toggle between light and dark themes */
  toggleTheme: () => void;
}
