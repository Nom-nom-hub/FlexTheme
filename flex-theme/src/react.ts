import { useEffect, useState } from 'react';
import {
  getTheme,
  getResolvedTheme,
  setTheme,
  toggleTheme,
  onThemeChange,
  getLocale,
  configureLocale,
  getMessage
} from './index';
import type { Theme, FlexThemeResult } from './types';
import type { Locale } from './i18n';

/**
 * React hook for using FlexTheme
 *
 * @param options Configuration options
 * @returns FlexThemeResult object with theme state and methods
 */
export function useFlexTheme(options?: {
  /**
   * Locale to use for translations
   */
  locale?: Locale;
}): FlexThemeResult & {
  /**
   * Current locale
   */
  locale: Locale;

  /**
   * Set the locale
   */
  setLocale: (locale: Locale) => void;

  /**
   * Get a translated message
   */
  t: (path: string, params?: Record<string, string>) => string;
} {
  // Initialize state with current values
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(getResolvedTheme);
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Use provided locale or get from system
    return options?.locale || getLocale();
  });

  // Subscribe to theme changes
  useEffect(() => {
    // Update state when theme changes
    const unsubscribe = onThemeChange((newTheme, newResolvedTheme) => {
      setThemeState(newTheme);
      setResolvedTheme(newResolvedTheme);
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  // Apply locale when it changes
  useEffect(() => {
    configureLocale(locale);
  }, [locale]);

  // Set locale function
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  // Translation function
  const t = (path: string, params?: Record<string, string>) => {
    return getMessage(locale, path, params);
  };

  // Return the theme API with i18n support
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    locale,
    setLocale,
    t,
  };
}
