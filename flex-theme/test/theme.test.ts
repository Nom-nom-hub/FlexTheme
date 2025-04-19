import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getTheme, setTheme, toggleTheme, onThemeChange, offThemeChange, getResolvedTheme } from '../src/theme';

describe('Theme Module', () => {
  // Save original environment
  const originalLocalStorage = global.localStorage;
  
  beforeEach(() => {
    // Reset theme for each test
    setTheme('light');
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn().mockImplementation((key) => {
        if (key === 'theme') return getTheme();
        return null;
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn()
    };
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });
  
  it('should get the current theme', () => {
    expect(getTheme()).toBe('light');
  });
  
  it('should set the theme correctly', () => {
    setTheme('dark');
    expect(getTheme()).toBe('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
  });
  
  it('should toggle the theme', () => {
    setTheme('light');
    toggleTheme();
    expect(getTheme()).toBe('dark');
    toggleTheme();
    expect(getTheme()).toBe('light');
  });
  
  it('should handle system theme correctly', () => {
    setTheme('system');
    expect(getTheme()).toBe('system');
    expect(getResolvedTheme()).toBe('dark'); // mockMatchMedia returns dark
    
    // Change window.matchMedia mock to return light mode
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: !query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    
    expect(getResolvedTheme()).toBe('light');
  });
  
  it('should notify listeners of theme changes', () => {
    const listener = vi.fn();
    onThemeChange(listener);
    setTheme('dark');
    expect(listener).toHaveBeenCalledWith('dark');
    offThemeChange(listener);
    setTheme('light');
    expect(listener).toHaveBeenCalledTimes(1); // Should not be called again
  });
}); 