// Export core functionality
export {
  getTheme,
  getResolvedTheme,
  setTheme,
  toggleTheme,
  onThemeChange,
  configure,
} from './core';

// Export types
export type {
  Theme,
  FlexThemeConfig,
  ThemeChangeListener,
  FlexThemeResult,
} from './types';

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

// Export plugins
export * from './plugins';
