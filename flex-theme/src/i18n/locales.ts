import type { Theme } from '../types';
import type { Locale } from './messages';

/**
 * Configuration for a locale
 */
export interface LocaleConfig {
  /**
   * Text direction
   */
  textDirection: 'ltr' | 'rtl';
  
  /**
   * Date format
   */
  dateFormat: string;
  
  /**
   * Time format
   */
  timeFormat: string;
  
  /**
   * Default theme for this locale
   */
  defaultTheme?: Theme;
}

/**
 * Configuration for supported locales
 */
export const localeConfigs: Record<Locale, LocaleConfig> = {
  'en-US': {
    textDirection: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A'
  },
  'es-ES': {
    textDirection: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm'
  },
  'fr-FR': {
    textDirection: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm'
  },
  'de-DE': {
    textDirection: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm'
  },
  'ja-JP': {
    textDirection: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: 'HH:mm'
  },
  'ar-SA': {
    textDirection: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'h:mm A',
    defaultTheme: 'light' // Cultural preference
  }
};
