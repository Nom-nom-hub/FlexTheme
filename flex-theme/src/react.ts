import { useState, useEffect } from 'react';
import { getTheme, setTheme, toggleTheme, onThemeChange, offThemeChange } from './theme';
import { ThemeMode } from './types';

/**
 * React hook for accessing and updating the current theme
 */
export function useTheme(): [ThemeMode, (theme: ThemeMode) => void] {
  const [theme, setCurrentTheme] = useState<ThemeMode>(getTheme());

  useEffect(() => {
    const handleThemeChange = (newTheme: ThemeMode) => {
      setCurrentTheme(newTheme);
    };

    // Subscribe to theme changes
    onThemeChange(handleThemeChange);

    // Cleanup subscription
    return () => {
      offThemeChange(handleThemeChange);
    };
  }, []);

  return [theme, setTheme];
}

/**
 * React hook for toggling between light and dark themes
 */
export function useToggleTheme(): [ThemeMode, () => void] {
  const [theme] = useTheme();
  
  const handleToggle = () => {
    toggleTheme();
  };

  return [theme, handleToggle];
}

/**
 * React hook for detecting system theme preferences
 */
export function useSystemTheme(): ThemeMode {
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
export function useThemeWithStorage(): [ThemeMode, (theme: ThemeMode) => void] {
  const [theme, setCurrentTheme] = useTheme();
  
  const setThemeWithStorage = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    
    // Store in localStorage if available
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', newTheme);
    }
  };
  
  return [theme, setThemeWithStorage];
}

