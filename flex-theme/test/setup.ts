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
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      length: 0,
      key: vi.fn((index: number) => Object.keys(store)[index] || null)
    };
  })();

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: false
  });
  
  // Define global.localStorage (in Node environment)
  vi.stubGlobal('localStorage', localStorageMock);

  // Mock document methods
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
      toggle: vi.fn(),
    }
  });
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