/**
 * Translation messages for flex-theme
 */
export const messages = {
  'en-US': {
    themes: {
      light: 'Light',
      dark: 'Dark',
      auto: 'System'
    },
    actions: {
      toggleTheme: 'Toggle theme',
      setTheme: 'Set theme',
      switchTo: 'Switch to {theme} theme'
    }
  },
  'es-ES': {
    themes: {
      light: 'Claro',
      dark: 'Oscuro',
      auto: 'Sistema'
    },
    actions: {
      toggleTheme: 'Cambiar tema',
      setTheme: 'Establecer tema',
      switchTo: 'Cambiar a tema {theme}'
    }
  },
  'fr-FR': {
    themes: {
      light: 'Clair',
      dark: 'Sombre',
      auto: 'Système'
    },
    actions: {
      toggleTheme: 'Changer de thème',
      setTheme: 'Définir le thème',
      switchTo: 'Passer au thème {theme}'
    }
  },
  'de-DE': {
    themes: {
      light: 'Hell',
      dark: 'Dunkel',
      auto: 'System'
    },
    actions: {
      toggleTheme: 'Thema umschalten',
      setTheme: 'Thema festlegen',
      switchTo: 'Zum {theme} Thema wechseln'
    }
  },
  'ja-JP': {
    themes: {
      light: 'ライト',
      dark: 'ダーク',
      auto: 'システム'
    },
    actions: {
      toggleTheme: 'テーマを切り替える',
      setTheme: 'テーマを設定する',
      switchTo: '{theme}テーマに切り替える'
    }
  },
  'ar-SA': {
    themes: {
      light: 'فاتح',
      dark: 'داكن',
      auto: 'النظام'
    },
    actions: {
      toggleTheme: 'تبديل السمة',
      setTheme: 'تعيين السمة',
      switchTo: 'التبديل إلى السمة {theme}'
    }
  }
};

/**
 * Type for supported locales
 */
export type Locale = keyof typeof messages;

/**
 * Get a message from the translations
 * @param locale Locale to use
 * @param path Path to the message (e.g., 'themes.light')
 * @param params Parameters to replace in the message
 * @returns Translated message
 */
export function getMessage(locale: Locale | string, path: string, params: Record<string, string> = {}): string {
  // Default to en-US if locale is not supported
  const supportedLocale = (locale in messages) ? locale as Locale : 'en-US';
  
  // Get the message from the path
  const parts = path.split('.');
  let result: any = messages[supportedLocale];
  
  for (const part of parts) {
    if (result && typeof result === 'object' && part in result) {
      result = result[part];
    } else {
      return path; // Fallback to the path itself
    }
  }
  
  if (typeof result !== 'string') {
    return path;
  }
  
  // Replace parameters
  let message = result;
  Object.entries(params).forEach(([key, value]) => {
    message = message.replace(`{${key}}`, value);
  });
  
  return message;
}
