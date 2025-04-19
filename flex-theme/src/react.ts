import React, { useState, useEffect } from 'react';
import { getTheme, setTheme, toggleTheme, onThemeChange, getResolvedTheme } from './theme';
type Theme = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

interface UseFlexThemeReturn {
  /**
   * Current theme ('light', 'dark', or 'auto')
   */
  theme: Theme;
  
  /**
   * Resolved theme ('light' or 'dark')
   * Takes into account the 'auto' setting
   */
  resolvedTheme: ResolvedTheme;
  
  /**
   * Function to set the theme
   */
  setTheme: (theme: Theme) => void;
  
  /**
   * Function to toggle between light and dark themes
   */
  toggleTheme: () => void;
}

/**
 * React hook for using the FlexTheme system
 * @returns Object with theme state and methods
 */
export function useFlexTheme(): UseFlexThemeReturn {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  useEffect(() => {
    // Handle theme changes
    const unsubscribe = onThemeChange((newTheme) => {
      setThemeState(newTheme as Theme);
      setResolvedTheme(getResolvedTheme());
    });
    // Initialize state
    const initialTheme = getTheme();
    setThemeState(initialTheme as Theme);
    setResolvedTheme(getResolvedTheme());
    
    // Cleanup subscription
    return unsubscribe;
  }, []);

  const setThemeWrapper = (newTheme: Theme) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWrapper,
    toggleTheme
  };
}

/**
 * Component Props with children
 */
interface ThemeProviderProps {
  /**
   * Initial theme to use (optional)
   */
  defaultTheme?: Theme;
  
  /**
   * Children to render
   */
  children: React.ReactNode;
}

/**
 * Theme provider component for React applications
 * This is optional - the theme system works without this component
 */
export function ThemeProvider({ defaultTheme, children }: ThemeProviderProps): React.ReactElement {
  useEffect(() => {
    // Set initial theme if provided
    if (defaultTheme) {
      setTheme(defaultTheme as 'light' | 'dark' | 'system');
    }
  }, [defaultTheme]);
  
  return React.createElement(React.Fragment, null, children);
}

/**
 * React hook for detecting system theme preferences
 */
export function useSystemTheme(): 'light' | 'dark' {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    // Check if window is available (for SSR)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? 'dark' : 'light');
      };
      
      // Set initial value
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
      
      // Add listener
      mediaQuery.addEventListener('change', handleChange);
      
      // Cleanup
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, []);
  
  return systemTheme;
}

/**
 * React hook for theme with localStorage persistence
 */
export function useThemeWithStorage(): [Theme, (theme: Theme) => void] {
  const [theme, setCurrentTheme] = useState<Theme>('light');
  
  const setThemeWithStorage = (newTheme: Theme) => {
    setTheme(newTheme as 'light' | 'dark' | 'system');
    // Store in localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  return [theme, setThemeWithStorage];
}

