/**
 * Typography tokens for consistent text styling
 */
export const typography = {
  fontFamily: {
    base: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    xxl: '1.5rem',    // 24px
    display: '2rem',  // 32px
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

/**
 * Types for typography token keys
 */
export type FontFamilyToken = keyof typeof typography.fontFamily;
export type FontWeightToken = keyof typeof typography.fontWeight;
export type FontSizeToken = keyof typeof typography.fontSize;
export type LineHeightToken = keyof typeof typography.lineHeight;
