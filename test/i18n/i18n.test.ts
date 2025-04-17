import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  configureLocale,
  getLocale,
  getMessage,
  formatDate,
  formatTime,
  messages,
  localeConfigs
} from '../../src/i18n';
import type { Locale } from '../../src/i18n';

describe('Internationalization (i18n)', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      store
    };
  })();
  
  // Mock document
  const documentMock = {
    documentElement: {
      dir: '',
      lang: '',
      setAttribute: vi.fn(),
    }
  };
  
  // Save originals
  const originalLocalStorage = global.localStorage;
  const originalDocument = global.document;
  const originalNavigator = global.navigator;
  
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Mock document
    Object.defineProperty(global, 'document', {
      value: documentMock,
      writable: true
    });
    
    // Mock navigator
    Object.defineProperty(global, 'navigator', {
      value: {
        language: 'en-US',
        languages: ['en-US', 'en']
      },
      writable: true
    });
    
    // Clear localStorage
    localStorageMock.clear();
    
    // Reset document properties
    documentMock.documentElement.dir = '';
    documentMock.documentElement.lang = '';
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    // Restore originals
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
    
    Object.defineProperty(global, 'document', {
      value: originalDocument,
      writable: true
    });
    
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true
    });
    
    vi.resetAllMocks();
  });
  
  describe('messages', () => {
    it('should have messages for multiple locales', () => {
      expect(messages).toBeDefined();
      expect(Object.keys(messages).length).toBeGreaterThan(1);
      expect(messages['en-US']).toBeDefined();
      expect(messages['es-ES']).toBeDefined();
    });
    
    it('should have consistent message structure across locales', () => {
      const locales = Object.keys(messages) as Locale[];
      
      // Check that all locales have the same top-level keys
      const enKeys = Object.keys(messages['en-US']);
      
      for (const locale of locales) {
        const localeKeys = Object.keys(messages[locale]);
        expect(localeKeys).toEqual(expect.arrayContaining(enKeys));
      }
    });
  });
  
  describe('localeConfigs', () => {
    it('should have configs for multiple locales', () => {
      expect(localeConfigs).toBeDefined();
      expect(Object.keys(localeConfigs).length).toBeGreaterThan(1);
      expect(localeConfigs['en-US']).toBeDefined();
      expect(localeConfigs['ar-SA']).toBeDefined();
    });
    
    it('should have correct text direction for RTL languages', () => {
      expect(localeConfigs['en-US'].textDirection).toBe('ltr');
      expect(localeConfigs['ar-SA'].textDirection).toBe('rtl');
    });
    
    it('should have date and time formats', () => {
      expect(localeConfigs['en-US'].dateFormat).toBeDefined();
      expect(localeConfigs['en-US'].timeFormat).toBeDefined();
    });
  });
  
  describe('configureLocale', () => {
    it('should set document properties based on locale', () => {
      configureLocale('en-US');
      
      expect(documentMock.documentElement.dir).toBe('ltr');
      expect(documentMock.documentElement.lang).toBe('en-US');
    });
    
    it('should set RTL direction for RTL languages', () => {
      configureLocale('ar-SA');
      
      expect(documentMock.documentElement.dir).toBe('rtl');
      expect(documentMock.documentElement.lang).toBe('ar-SA');
    });
    
    it('should store locale in localStorage', () => {
      configureLocale('fr-FR');
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('flex-theme-locale', 'fr-FR');
    });
  });
  
  describe('getLocale', () => {
    it('should return stored locale from localStorage', () => {
      // Set a locale in localStorage
      localStorageMock.store['flex-theme-locale'] = 'fr-FR';
      
      expect(getLocale()).toBe('fr-FR');
    });
    
    it('should detect locale from navigator.language if not in localStorage', () => {
      // Navigator language is mocked as 'en-US'
      expect(getLocale()).toBe('en-US');
    });
    
    it('should detect locale from navigator.languages if not in localStorage', () => {
      // Change navigator.language but keep first language in navigator.languages
      Object.defineProperty(global.navigator, 'language', {
        value: 'fr-FR',
        writable: true
      });
      
      expect(getLocale()).toBe('en-US');
    });
    
    it('should fall back to language match if exact locale not supported', () => {
      // Set navigator to a language we support but with a different region
      Object.defineProperty(global.navigator, 'language', {
        value: 'es-MX',
        writable: true
      });
      
      Object.defineProperty(global.navigator, 'languages', {
        value: ['es-MX', 'es'],
        writable: true
      });
      
      // Should match 'es-ES' since we support that
      expect(getLocale()).toBe('es-ES');
    });
    
    it('should fall back to en-US if no match found', () => {
      // Set navigator to a language we don't support
      Object.defineProperty(global.navigator, 'language', {
        value: 'zh-CN',
        writable: true
      });
      
      Object.defineProperty(global.navigator, 'languages', {
        value: ['zh-CN', 'zh'],
        writable: true
      });
      
      expect(getLocale()).toBe('en-US');
    });
  });
  
  describe('getMessage', () => {
    it('should return a message for a given path', () => {
      const message = getMessage('en-US', 'themes.light');
      expect(message).toBe('Light');
    });
    
    it('should return a message in different locales', () => {
      const enMessage = getMessage('en-US', 'themes.light');
      const esMessage = getMessage('es-ES', 'themes.light');
      
      expect(enMessage).toBe('Light');
      expect(esMessage).toBe('Claro');
    });
    
    it('should replace parameters in messages', () => {
      const message = getMessage('en-US', 'actions.switchTo', { theme: 'dark' });
      expect(message).toBe('Switch to dark theme');
    });
    
    it('should fall back to en-US if locale not supported', () => {
      const message = getMessage('unsupported-locale', 'themes.light');
      expect(message).toBe('Light');
    });
    
    it('should return the path if message not found', () => {
      const message = getMessage('en-US', 'non.existent.path');
      expect(message).toBe('non.existent.path');
    });
  });
  
  describe('formatDate', () => {
    it('should format a date according to locale', () => {
      // Mock Intl.DateTimeFormat
      const originalDateTimeFormat = Intl.DateTimeFormat;
      Intl.DateTimeFormat = vi.fn().mockImplementation((locale) => ({
        format: () => locale === 'en-US' ? '12/31/2023' : '31/12/2023'
      }));
      
      const date = new Date(2023, 11, 31); // December 31, 2023
      
      const enDate = formatDate(date, 'en-US');
      const frDate = formatDate(date, 'fr-FR');
      
      expect(enDate).toBe('12/31/2023');
      expect(frDate).toBe('31/12/2023');
      
      // Restore original
      Intl.DateTimeFormat = originalDateTimeFormat;
    });
    
    it('should use current locale if none specified', () => {
      // Mock getLocale to return a specific locale
      const originalGetLocale = getLocale;
      global.getLocale = vi.fn().mockReturnValue('fr-FR');
      
      // Mock Intl.DateTimeFormat
      const originalDateTimeFormat = Intl.DateTimeFormat;
      Intl.DateTimeFormat = vi.fn().mockImplementation((locale) => ({
        format: () => locale === 'en-US' ? '12/31/2023' : '31/12/2023'
      }));
      
      const date = new Date(2023, 11, 31); // December 31, 2023
      
      const formattedDate = formatDate(date);
      
      expect(formattedDate).toBe('31/12/2023');
      
      // Restore originals
      global.getLocale = originalGetLocale;
      Intl.DateTimeFormat = originalDateTimeFormat;
    });
  });
  
  describe('formatTime', () => {
    it('should format a time according to locale', () => {
      // Mock Intl.DateTimeFormat
      const originalDateTimeFormat = Intl.DateTimeFormat;
      Intl.DateTimeFormat = vi.fn().mockImplementation((locale) => ({
        format: () => locale === 'en-US' ? '3:30 PM' : '15:30'
      }));
      
      const date = new Date(2023, 11, 31, 15, 30); // 3:30 PM
      
      const enTime = formatTime(date, 'en-US');
      const frTime = formatTime(date, 'fr-FR');
      
      expect(enTime).toBe('3:30 PM');
      expect(frTime).toBe('15:30');
      
      // Restore original
      Intl.DateTimeFormat = originalDateTimeFormat;
    });
    
    it('should use current locale if none specified', () => {
      // Mock getLocale to return a specific locale
      const originalGetLocale = getLocale;
      global.getLocale = vi.fn().mockReturnValue('fr-FR');
      
      // Mock Intl.DateTimeFormat
      const originalDateTimeFormat = Intl.DateTimeFormat;
      Intl.DateTimeFormat = vi.fn().mockImplementation((locale) => ({
        format: () => locale === 'en-US' ? '3:30 PM' : '15:30'
      }));
      
      const date = new Date(2023, 11, 31, 15, 30); // 3:30 PM
      
      const formattedTime = formatTime(date);
      
      expect(formattedTime).toBe('15:30');
      
      // Restore originals
      global.getLocale = originalGetLocale;
      Intl.DateTimeFormat = originalDateTimeFormat;
    });
  });
});
