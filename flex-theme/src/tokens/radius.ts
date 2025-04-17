/**
 * Border radius tokens for consistent component styling
 */
export const radius = {
  none: '0',
  sm: '0.125rem',  // 2px
  md: '0.25rem',   // 4px
  lg: '0.5rem',    // 8px
  xl: '1rem',      // 16px
  full: '9999px',  // Fully rounded (for circles, pills)
};

/**
 * Type for radius token keys
 */
export type RadiusToken = keyof typeof radius;
