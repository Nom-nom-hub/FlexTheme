/**
 * Available theme modes
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme change listener function type
 */
export type ThemeListener = (theme: ThemeMode) => void;
