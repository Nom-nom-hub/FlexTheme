import { configure } from '../index';
import { localeConfigs } from './locales';
import { messages, getMessage } from './messages';
import type { Locale } from './messages';
import type { LocaleConfig } from './locales';

/**
 * Storage key for locale preference
 */
const LOCALE_STORAGE_KEY = 'flex-theme-locale';

/**
 * Configure the theme system for a specific locale
 * @param locale Locale to configure
 */
export function configureLocale(locale: Locale): void {
  if (typeof document === 'undefined') return;
  
  const config = localeConfigs[locale];
  
  // Set text direction
  document.documentElement.dir = config.textDirection;
  document.documentElement.lang = locale;
  
  // Apply locale-specific theme if specified
  if (config.defaultTheme) {
    configure({
      defaultTheme: config.defaultTheme,
    });
  }
  
  // Store locale preference
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (e) {
    console.warn('Failed to store locale preference:', e);
  }
}

/**
 * Get the current locale
 * @returns Current locale
 */
export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en-US';
  
  // Try to get from localStorage
  try {
    const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (storedLocale && storedLocale in localeConfigs) {
      return storedLocale;
    }
  } catch (e) {
    console.warn('Failed to read locale from localStorage:', e);
  }
  
  // Detect from browser
  const browserLocales = navigator.languages || [navigator.language];
  
  for (const browserLocale of browserLocales) {
    // Try exact match
    if (browserLocale in localeConfigs) {
      return browserLocale as Locale;
    }
    
    // Try language match (e.g., 'en' for 'en-US')
    const language = browserLocale.split('-')[0];
    for (const locale of Object.keys(localeConfigs) as Locale[]) {
      if (locale.startsWith(language + '-')) {
        return locale;
      }
    }
  }
  
  return 'en-US'; // Default fallback
}

/**
 * Format a date according to the current locale
 * @param date Date to format
 * @param locale Locale to use (defaults to current locale)
 * @returns Formatted date string
 */
export function formatDate(date: Date, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const config = localeConfigs[currentLocale];
  
  // Use Intl.DateTimeFormat for proper localization
  return new Intl.DateTimeFormat(currentLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Format a time according to the current locale
 * @param date Date to format
 * @param locale Locale to use (defaults to current locale)
 * @returns Formatted time string
 */
export function formatTime(date: Date, locale?: Locale): string {
  const currentLocale = locale || getLocale();
  const config = localeConfigs[currentLocale];
  
  // Use Intl.DateTimeFormat for proper localization
  return new Intl.DateTimeFormat(currentLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: currentLocale === 'en-US' || currentLocale === 'ar-SA'
  }).format(date);
}

export { getMessage, messages, localeConfigs };
export type { Locale, LocaleConfig };
