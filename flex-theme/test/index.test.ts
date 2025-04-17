import { describe, it, expect, vi, beforeEach } from 'vitest';
// Import from our mock version that doesn't auto-initialize
import { getTheme, setTheme, toggleTheme, onThemeChange, configure } from './mocks/index';

describe('flex-theme core', () => {
  beforeEach(() => {
    // Reset to default configuration before each test
    configure({
      attribute: 'data-theme',
      storageKey: 'flex-theme',
      defaultTheme: 'auto'
    });
  });

  describe('getTheme', () => {
    it('should return the default theme when no theme is stored', () => {
      expect(getTheme()).toBe('auto');
    });

    it('should return the stored theme from localStorage', () => {
      localStorage.setItem('flex-theme', 'dark');
      expect(getTheme()).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should store the theme in localStorage', () => {
      setTheme('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('flex-theme', 'light');
    });

    it('should apply the theme to the HTML element', () => {
      setTheme('dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should resolve "auto" theme based on system preference', () => {
      // Mock system preference to dark
      vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
        return {
          matches: true, // This will make getSystemTheme() return 'dark'
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        };
      });

      setTheme('auto');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      // Start with light theme
      setTheme('light');
      vi.clearAllMocks(); // Clear previous calls

      toggleTheme();
      expect(localStorage.setItem).toHaveBeenCalledWith('flex-theme', 'dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should toggle from dark to light', () => {
      // Start with dark theme
      setTheme('dark');
      vi.clearAllMocks(); // Clear previous calls

      toggleTheme();
      expect(localStorage.setItem).toHaveBeenCalledWith('flex-theme', 'light');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });
  });

  describe('onThemeChange', () => {
    it('should call listeners when theme changes', () => {
      const listener = vi.fn();
      const unsubscribe = onThemeChange(listener);

      setTheme('dark');
      expect(listener).toHaveBeenCalledWith('dark', 'dark');

      setTheme('light');
      expect(listener).toHaveBeenCalledWith('light', 'light');
    });

    it('should not call listeners after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = onThemeChange(listener);

      setTheme('dark');
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();
      setTheme('light');
      expect(listener).toHaveBeenCalledTimes(1); // Still only called once
    });
  });

  describe('configure', () => {
    it('should update the configuration', () => {
      configure({
        attribute: 'data-mode',
        storageKey: 'my-theme',
        defaultTheme: 'light'
      });

      setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('my-theme', 'dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });

    it('should use default values for missing options', () => {
      configure({
        attribute: 'data-mode'
      });

      setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('flex-theme', 'dark');
      expect(document.documentElement.setAttribute).toHaveBeenCalledWith('data-mode', 'dark');
    });
  });

  describe('SSR safety', () => {
    it('should handle SSR environment gracefully', () => {
      // Mock window to be undefined
      const originalWindow = global.window;
      // @ts-ignore - Intentionally setting window to undefined for testing
      global.window = undefined;

      // These should not throw errors
      expect(() => getTheme()).not.toThrow();
      expect(() => setTheme('dark')).not.toThrow();
      expect(() => toggleTheme()).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });
});
