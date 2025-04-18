export * from './performance';
export * from './code-splitting';
export * from './tree-shaking';

// Utility functions
export const isServer = typeof window === 'undefined';
export const isClient = !isServer;

export const toggleTheme = (currentTheme: 'light' | 'dark'): 'light' | 'dark' => {
  return currentTheme === 'light' ? 'dark' : 'light';
};
