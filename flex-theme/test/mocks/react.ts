import { useEffect, useState } from 'react';
import { getTheme, getResolvedTheme, setTheme, toggleTheme, onThemeChange } from './index';
import type { Theme, FlexThemeResult } from '../../src/types';

/**
 * React hook for using FlexTheme
 * 
 * @returns FlexThemeResult object with theme state and methods
 */
export function useFlexTheme(): FlexThemeResult {
  // Initialize state with current values
  const [theme, setThemeState] = useState<Theme>(getTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(getResolvedTheme);
  
  // Subscribe to theme changes
  useEffect(() => {
    // Update state when theme changes
    const unsubscribe = onThemeChange((newTheme, newResolvedTheme) => {
      setThemeState(newTheme);
      setResolvedTheme(newResolvedTheme);
    });
    
    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Return the theme API
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
