import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFlexTheme } from './mocks/react';
import { setTheme, configure } from './mocks/index';

// Simple mock for React hooks
vi.mock('react', () => ({
  useState: vi.fn((init) => [typeof init === 'function' ? init() : init, vi.fn()]),
  useEffect: vi.fn((cb) => cb())
}));

describe('useFlexTheme hook', () => {
  beforeEach(() => {
    // Reset to default configuration before each test
    configure({
      attribute: 'data-theme',
      storageKey: 'flex-theme',
      defaultTheme: 'auto'
    });

    // Clear mocks
    vi.clearAllMocks();
  });

  it('should have the correct API shape', () => {
    // Set initial theme
    setTheme('light');

    // Get the hook result
    const result = useFlexTheme();

    // Check the returned values
    expect(result).toHaveProperty('theme');
    expect(result).toHaveProperty('resolvedTheme');
    expect(result).toHaveProperty('setTheme');
    expect(result).toHaveProperty('toggleTheme');

    // Verify types
    expect(typeof result.setTheme).toBe('function');
    expect(typeof result.toggleTheme).toBe('function');
  });
});
