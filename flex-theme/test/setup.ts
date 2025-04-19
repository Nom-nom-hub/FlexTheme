import { expect, vi, beforeAll } from 'vitest';
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

  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn().mockImplementation((key: string) => null),
    setItem: vi.fn().mockImplementation((key: string, value: string) => {}),
    removeItem: vi.fn().mockImplementation((key: string) => {}),
    clear: vi.fn().mockImplementation(() => {}),
    length: 0,
    key: vi.fn().mockImplementation((index: number) => null),
  };

  // Use vi.stubGlobal to mock localStorage globally
  vi.stubGlobal('localStorage', localStorageMock);

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

// Mock browser APIs that might not be available in the test environment
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
};

// Mock localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Mock document methods
document.documentElement.classList = {
  add: jest.fn(),
  remove: jest.fn(),
  contains: jest.fn(),
  toggle: jest.fn(),
}; 