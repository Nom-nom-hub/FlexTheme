import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  keyframes, 
  transitions, 
  prefersReducedMotion, 
  getAccessibleTransition, 
  getAccessibleAnimation,
  injectKeyframes
} from '../../src/animations';

describe('Animation utilities', () => {
  // Mock window.matchMedia
  const originalMatchMedia = window.matchMedia;
  let matchMediaMock: any;
  
  beforeEach(() => {
    // Default to not preferring reduced motion
    matchMediaMock = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    window.matchMedia = matchMediaMock;
  });
  
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.resetAllMocks();
    
    // Clean up any injected styles
    const styleEl = document.getElementById('flex-theme-keyframes');
    if (styleEl) {
      styleEl.remove();
    }
  });
  
  describe('keyframes', () => {
    it('should export keyframe definitions', () => {
      expect(keyframes).toBeDefined();
      expect(keyframes.fadeIn).toBeDefined();
      expect(keyframes.fadeOut).toBeDefined();
      expect(keyframes.slideInTop).toBeDefined();
      expect(keyframes.zoomIn).toBeDefined();
      expect(keyframes.spin).toBeDefined();
    });
    
    it('should have valid CSS keyframe syntax', () => {
      // Check a few keyframes for valid syntax
      expect(keyframes.fadeIn).toContain('@keyframes flex-fade-in');
      expect(keyframes.fadeIn).toContain('from {');
      expect(keyframes.fadeIn).toContain('to {');
      expect(keyframes.fadeIn).toContain('opacity: 0');
      expect(keyframes.fadeIn).toContain('opacity: 1');
    });
  });
  
  describe('transitions', () => {
    it('should export transition definitions', () => {
      expect(transitions).toBeDefined();
      expect(transitions.default).toBeDefined();
      expect(transitions.fast).toBeDefined();
      expect(transitions.slow).toBeDefined();
      expect(transitions.easeIn).toBeDefined();
      expect(transitions.none).toBeDefined();
    });
    
    it('should have valid CSS transition syntax', () => {
      expect(transitions.default).toMatch(/all \d+(\.\d+)?s \w+/);
      expect(transitions.none).toBe('none');
    });
  });
  
  describe('prefersReducedMotion', () => {
    it('should return false when user does not prefer reduced motion', () => {
      // Already mocked to return false
      expect(prefersReducedMotion()).toBe(false);
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
    
    it('should return true when user prefers reduced motion', () => {
      // Mock to return true
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      expect(prefersReducedMotion()).toBe(true);
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });
  });
  
  describe('getAccessibleTransition', () => {
    it('should return the specified transition when reduced motion is not preferred', () => {
      expect(getAccessibleTransition('default')).toBe(transitions.default);
      expect(getAccessibleTransition('fast')).toBe(transitions.fast);
      expect(getAccessibleTransition('slow')).toBe(transitions.slow);
    });
    
    it('should return "none" when reduced motion is preferred', () => {
      // Mock to prefer reduced motion
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      expect(getAccessibleTransition('default')).toBe('none');
      expect(getAccessibleTransition('fast')).toBe('none');
      expect(getAccessibleTransition('slow')).toBe('none');
    });
    
    it('should use "default" transition when no transition is specified', () => {
      expect(getAccessibleTransition()).toBe(transitions.default);
    });
  });
  
  describe('getAccessibleAnimation', () => {
    it('should return animation string when reduced motion is not preferred', () => {
      const animation = getAccessibleAnimation('flex-fade-in', 0.3, 'ease', 0, 1, 'normal', 'both');
      expect(animation).toBe('flex-fade-in 0.3s ease 0s 1 normal both');
    });
    
    it('should return "none" when reduced motion is preferred', () => {
      // Mock to prefer reduced motion
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      const animation = getAccessibleAnimation('flex-fade-in', 0.3, 'ease', 0, 1, 'normal', 'both');
      expect(animation).toBe('none');
    });
    
    it('should use default values when not all parameters are specified', () => {
      const animation = getAccessibleAnimation('flex-fade-in');
      expect(animation).toBe('flex-fade-in 0.3s ease 0s 1 normal both');
    });
  });
  
  describe('injectKeyframes', () => {
    it('should inject keyframes into the document head', () => {
      injectKeyframes();
      
      const styleEl = document.getElementById('flex-theme-keyframes');
      expect(styleEl).not.toBeNull();
      expect(styleEl?.tagName).toBe('STYLE');
      expect(styleEl?.textContent).toContain('@keyframes flex-fade-in');
      expect(styleEl?.textContent).toContain('@media (prefers-reduced-motion: reduce)');
    });
    
    it('should update existing style element if it already exists', () => {
      // Create a style element first
      const styleEl = document.createElement('style');
      styleEl.id = 'flex-theme-keyframes';
      styleEl.textContent = 'test';
      document.head.appendChild(styleEl);
      
      injectKeyframes();
      
      const updatedStyleEl = document.getElementById('flex-theme-keyframes');
      expect(updatedStyleEl).toBe(styleEl);
      expect(updatedStyleEl?.textContent).not.toBe('test');
      expect(updatedStyleEl?.textContent).toContain('@keyframes flex-fade-in');
    });
  });
});
