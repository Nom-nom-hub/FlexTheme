/**
 * FlexTheme internationalization (i18n) utilities
 * Provides support for multi-language applications with locale handling
 */

import { Locale, LocaleConfig } from '../types';

// Default locale configurations
export const localeConfigs: Record<string, LocaleConfig> = {
  'en-US': {
    name: 'English (US)',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    direction: 'ltr',
  },
  'fr-FR': {
    name: 'Français',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    direction: 'ltr',
  },
  'ar-SA': {
    name: 'العربية',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'hh:mm A',
    direction: 'rtl',
  },
  'ja-JP': {
    name: '日本語',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm',
    direction: 'ltr',
  },
};

// Default translation messages
export const messages: Record<string, Record<string, string>> = {
  'en-US': {
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.auto': 'System',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'error.general': 'An error occurred',
  },
  'fr-FR': {
    'theme.light': 'Clair',
    'theme.dark': 'Sombre',
    'theme.auto': 'Système',
    'common.loading': 'Chargement...',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'error.general': 'Une erreur est survenue',
  },
  'ar-SA': {
    'theme.light': 'فاتح',
    'theme.dark': 'داكن',
    'theme.auto': 'النظام',
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'error.general': 'حدث خطأ',
  },
  'ja-JP': {
    'theme.light': 'ライト',
    'theme.dark': 'ダーク',
    'theme.auto': 'システム',
    'common.loading': '読み込み中...',
    'common.save': '保存',
    'common.cancel': 'キャンセル',
    'error.general': 'エラーが発生しました',
  },
};

// Storage key for saved locale
const LOCALE_STORAGE_KEY = 'flex-theme-locale';

// Default locale
const DEFAULT_LOCALE = 'en-US';

// Callbacks for locale changes
const localeChangeCallbacks: Array<(locale: string) => void> = [];

/**
 * Gets the current locale
 * @returns {string} The current locale string
 */
export function getLocale(): string {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  
  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
  
  if (storedLocale && localeConfigs[storedLocale]) {
    return storedLocale;
  }
  
  // Try to detect from browser
  const browserLocale = navigator.language;
  if (localeConfigs[browserLocale]) {
    return browserLocale;
  }
  
  return DEFAULT_LOCALE;
}

/**
 * Sets the current locale
 * @param {string} locale - The locale to set
 * @returns {boolean} True if the locale was set successfully
 */
export function setLocale(locale: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Validate locale
  if (!localeConfigs[locale]) {
    console.warn(`Locale "${locale}" not supported`);
    return false;
  }
  
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  
  // Apply RTL attributes if needed
  const direction = localeConfigs[locale].direction;
  document.documentElement.setAttribute('dir', direction);
  document.documentElement.setAttribute('lang', locale);
  
  // Notify subscribers
  localeChangeCallbacks.forEach(callback => callback(locale));
  
  return true;
}

/**
 * Gets a translation message for the current locale
 * @param {string} key - The message key
 * @param {string} fallback - Fallback text if translation is missing
 * @returns {string} The translated message
 */
export function getMessage(key: string, fallback: string = key): string {
  const locale = getLocale();
  return messages[locale]?.[key] || fallback;
}

/**
 * Register a callback for locale changes
 * @param {Function} callback - The callback to register
 * @returns {Function} Function to unregister the callback
 */
export function onLocaleChange(callback: (locale: string) => void): () => void {
  localeChangeCallbacks.push(callback);
  
  return () => {
    const index = localeChangeCallbacks.indexOf(callback);
    if (index !== -1) {
      localeChangeCallbacks.splice(index, 1);
    }
  };
}

/**
 * Formats a date according to the current locale
 * @param {Date|number|string} date - The date to format
 * @param {string} format - Optional custom format
 * @returns {string} The formatted date string
 */
export function formatDate(date: Date | number | string, format?: string): string {
  const locale = getLocale();
  const dateObj = new Date(date);
  
  // Use Intl.DateTimeFormat for formatting
  const formatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  
  return formatter.format(dateObj);
}

/**
 * Initialize the i18n module
 * Sets the locale based on storage or browser preference
 */
export function initializeI18n(): void {
  if (typeof window === 'undefined') return;
  
  const currentLocale = getLocale();
  setLocale(currentLocale);
}

// Export everything
export * from './index'; 