import { keyframes } from './keyframes';
import { transitions } from './transitions';

/**
 * Check if the user prefers reduced motion
 * @returns True if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get a transition value that respects the user's motion preferences
 * @param transition The transition to use
 * @returns The transition value, or 'none' if the user prefers reduced motion
 */
export function getAccessibleTransition(transition: keyof typeof transitions = 'default'): string {
  return prefersReducedMotion() ? transitions.none : transitions[transition];
}

/**
 * Get an animation value that respects the user's motion preferences
 * @param name The animation name
 * @param duration The animation duration in seconds
 * @param timingFunction The animation timing function
 * @param delay The animation delay in seconds
 * @param iterationCount The animation iteration count
 * @param direction The animation direction
 * @param fillMode The animation fill mode
 * @returns The animation value, or 'none' if the user prefers reduced motion
 */
export function getAccessibleAnimation(
  name: string,
  duration = 0.3,
  timingFunction = 'ease',
  delay = 0,
  iterationCount = 1,
  direction = 'normal',
  fillMode = 'both'
): string {
  if (prefersReducedMotion()) {
    return 'none';
  }
  
  return `${name} ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode}`;
}

/**
 * Inject keyframes into the document
 */
export function injectKeyframes(): void {
  if (typeof document === 'undefined') return;
  
  const styleId = 'flex-theme-keyframes';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  
  // Combine all keyframes
  const allKeyframes = Object.values(keyframes).join('\n');
  
  // Add media query for reduced motion
  const reducedMotionStyles = `
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
  
  styleEl.textContent = allKeyframes + reducedMotionStyles;
}
