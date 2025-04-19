/**
 * FlexTheme type definitions
 */

// Theme types
export type Theme = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

// Theme configuration options
export interface ThemeConfig {
  attribute?: string;
  defaultTheme?: Theme;
  storageKey?: string;
}

// Locale types for i18n
export type Locale = string;

// Configuration for locales
export interface LocaleConfig {
  name: string;
  dateFormat: string;
  timeFormat: string;
  direction: 'ltr' | 'rtl';
}

// Preset theme definition
export interface ThemePreset {
  name: string;
  colors: Record<string, string>;
  fonts?: {
    body?: string;
    heading?: string;
    mono?: string;
  };
  radii?: {
    sm?: string;
    md?: string;
    lg?: string;
    full?: string;
  };
  spacing?: Record<string, string>;
  shadows?: Record<string, string>;
} 