import { ThemeMode, ThemeListener } from './types';

// Default theme
let currentTheme: ThemeMode = 'system';

// Array to store theme change listeners
const listeners: ThemeListener[] = [];

/**
 * Initialize theme from localStorage or system preference
 */
function initTheme(): void {
  // Skip if not in browser environment
  if (typeof window === 'undefined') return;
  
  // Try to get from localStorage
  const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
  
  if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
    currentTheme = savedTheme;
  } else {
    // Default to system preference
    currentTheme = 'system';
  }
  
  // Apply theme to document
  applyTheme();
}

/**
 * Apply the current theme to the document
 */
function applyTheme(): void {
  // Skip if not in browser environment
  if (typeof window === 'undefined' || !document) return;
  
  let effectiveTheme = currentTheme;
  
  // If theme is 'system', determine from system preferences
  if (effectiveTheme === 'system') {
    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  
  // Apply theme to document
  if (effectiveTheme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
  
  // Store in localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', currentTheme);
  }
}

/**
 * Get the current theme
 */
export function getTheme(): ThemeMode {
  return currentTheme;
}

/**
 * Set the theme
 */
export function setTheme(theme: ThemeMode): void {
  if (!['light', 'dark', 'system'].includes(theme)) {
    console.error(`Invalid theme: ${theme}. Must be 'light', 'dark', or 'system'`);
    return;
  }
  
  currentTheme = theme;
  applyTheme();
  
  // Notify listeners
  listeners.forEach(listener => listener(theme));
}

/**
 * Toggle between light and dark themes
 */
export function toggleTheme(): void {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

/**
 * Register a theme change listener
 */
export function onThemeChange(listener: ThemeListener): void {
  listeners.push(listener);
}

/**
 * Remove a theme change listener
 */
export function offThemeChange(listener: ThemeListener): void {
  const index = listeners.indexOf(listener);
  if (index !== -1) {
    listeners.splice(index, 1);
  }
}

// Initialize theme if in browser environment
if (typeof window !== 'undefined') {
  initTheme();
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system') {
      applyTheme();
      // Notify listeners
      listeners.forEach(listener => listener(currentTheme));
    }
  });
}

// Export a ThemeProvider component for frameworks that need it
export const ThemeProvider = ({ children }: { children: any }) => {
  // This is a simple wrapper that doesn't actually do anything
  // since our theme management is global
  return children;
};
