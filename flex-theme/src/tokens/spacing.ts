/**
 * Spacing tokens for consistent layout
 */
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  xxl: '3rem',    // 48px
};

/**
 * Type for spacing token keys
 */
export type SpacingToken = keyof typeof spacing;
