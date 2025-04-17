import { afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => {
      return store[key] || null;
    }),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock matchMedia
const matchMediaMock = vi.fn().mockImplementation((query) => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };
});

// Mock setTimeout to execute immediately in tests
vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
  if (typeof fn === 'function') fn();
  return 0 as any;
});

// Mock document.documentElement
const documentElementMock = {
  setAttribute: vi.fn(),
  getAttribute: vi.fn(),
};

// Setup before each test
beforeEach(() => {
  // Setup localStorage mock
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  // Setup matchMedia mock
  Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

  // Setup document.documentElement mock
  Object.defineProperty(document, 'documentElement', { value: documentElementMock });

  // Clear all mocks
  vi.clearAllMocks();
});

// Cleanup after each test
afterEach(() => {
  localStorageMock.clear();
});
