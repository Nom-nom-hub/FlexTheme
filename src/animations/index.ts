/**
 * FlexTheme animation utilities
 * A collection of keyframes, transitions, and utilities for animation
 * with built-in accessibility features (respects prefers-reduced-motion)
 */

// Define keyframes for common animations
export const keyframes = {
  fadeIn: `
    @keyframes flex-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes flex-fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideInTop: `
    @keyframes flex-slide-in-top {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  zoomIn: `
    @keyframes flex-zoom-in {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  spin: `
    @keyframes flex-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `
};

// Define common transition presets
export const transitions = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
  easeIn: 'all 0.3s cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'all 0.3s cubic-bezier(0, 0, 0.2, 1)',
  none: 'none'
};

/**
 * Checks if the user prefers reduced motion
 * @returns {boolean} True if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns an accessible transition value based on user preference
 * @param {keyof typeof transitions} transitionName - The name of the transition to use
 * @returns {string} The transition value, or 'none' if reduced motion is preferred
 */
export function getAccessibleTransition(
  transitionName: keyof typeof transitions = 'default'
): string {
  return prefersReducedMotion() ? 'none' : transitions[transitionName];
}

/**
 * Returns an accessible animation string based on user preference
 * @param {string} name - The name of the animation
 * @param {number} duration - The duration in seconds
 * @param {string} easing - The easing function
 * @param {number} delay - The delay in seconds
 * @param {number} iterations - The number of iterations
 * @param {string} direction - The animation direction
 * @param {string} fillMode - The fill mode
 * @returns {string} The animation string, or 'none' if reduced motion is preferred
 */
export function getAccessibleAnimation(
  name: string,
  duration: number = 0.3,
  easing: string = 'ease',
  delay: number = 0,
  iterations: number = 1,
  direction: string = 'normal',
  fillMode: string = 'both'
): string {
  if (prefersReducedMotion()) return 'none';
  return `${name} ${duration}s ${easing} ${delay}s ${iterations} ${direction} ${fillMode}`;
}

/**
 * Injects animation keyframes into the document
 * Includes a media query to disable animations when prefers-reduced-motion is set
 */
export function injectKeyframes(): void {
  if (typeof document === 'undefined') return;
  
  // Create or get existing style element
  let styleEl = document.getElementById('flex-theme-keyframes') as HTMLStyleElement;
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'flex-theme-keyframes';
    document.head.appendChild(styleEl);
  }
  
  // Combine all keyframes
  const allKeyframes = Object.values(keyframes).join('\n');
  
  // Add reduced motion media query
  const styleContent = `
    ${allKeyframes}
    
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  
  styleEl.textContent = styleContent;
}

// Export everything from this file
export * from './index'; 