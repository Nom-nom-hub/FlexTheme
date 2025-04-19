import { expect, vi, beforeAll, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock window.matchMedia and localStorage before tests
beforeAll(() => {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Setup localStorage with a minimal implementation
  if (!window.localStorage) {
    const storage = new Map();
    window.localStorage = {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
      clear: () => storage.clear(),
      length: 0,
      key: () => null,
    };
  }

  // Mock document methods for classList
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.classList = {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(() => false),
      toggle: vi.fn(),
    };
  }
});

// Setup spies before each test
beforeEach(() => {
  // Spy on localStorage methods
  vi.spyOn(localStorage, 'getItem');
  vi.spyOn(localStorage, 'setItem');
  vi.spyOn(localStorage, 'removeItem');
  vi.spyOn(localStorage, 'clear');
});