import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getTheme, setTheme, toggleTheme, onThemeChange, offThemeChange, getResolvedTheme } from '../src/theme';

describe('Theme Module', () => {
  beforeEach(() => {
    // Reset localStorage mock calls
    vi.clearAllMocks();
    
    // Reset theme for each test
    setTheme('light');
    
    // Default matchMedia mock - respond to dark mode query
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
    // Reset the localStorage mock calls from the setup
    vi.mocked(localStorage.setItem).mockClear();
    
    // Set theme to dark
    setTheme('dark');
    
    // Verify the theme was set correctly
    expect(getTheme()).toBe('dark');
    
    // Verify localStorage.setItem was called
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(vi.mocked(localStorage.setItem).mock.calls.some(
      call => call[0] === 'theme' && call[1] === 'dark'
    )).toBe(true);
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