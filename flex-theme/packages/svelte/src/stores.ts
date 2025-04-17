import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { 
  getTheme, 
  getResolvedTheme, 
  setTheme as setFlexTheme, 
  toggleTheme as toggleFlexTheme, 
  onThemeChange,
  getLocale,
  configureLocale,
  getMessage,
  type Theme,
  type Locale
} from 'flex-theme';

// Create stores
export const theme: Writable<Theme> = writable(getTheme());
export const resolvedTheme: Writable<'light' | 'dark'> = writable(getResolvedTheme());
export const locale: Writable<Locale> = writable(getLocale());

// Subscribe to theme changes
if (typeof window !== 'undefined') {
  onThemeChange((newTheme, newResolvedTheme) => {
    theme.set(newTheme);
    resolvedTheme.set(newResolvedTheme);
  });
}

/**
 * Set the theme
 * @param newTheme Theme to set
 */
export function setTheme(newTheme: Theme): void {
  setFlexTheme(newTheme);
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  toggleFlexTheme();
}

/**
 * Set the locale
 * @param newLocale Locale to set
 */
export function setLocale(newLocale: Locale): void {
  configureLocale(newLocale);
  locale.set(newLocale);
}

/**
 * Get a translated message
 * @param path Path to the message
 * @param params Parameters to replace in the message
 * @returns Translated message
 */
export function t(path: string, params?: Record<string, string>): string {
  let currentLocale: Locale;
  locale.subscribe(value => {
    currentLocale = value;
  })();
  
  return getMessage(currentLocale, path, params);
}

/**
 * Derived store for translated messages
 * @param path Path to the message
 * @param params Parameters to replace in the message
 * @returns Readable store with the translated message
 */
export function translate(path: string, params?: Record<string, string>): Readable<string> {
  return derived(locale, $locale => getMessage($locale, path, params));
}
