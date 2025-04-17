/**
 * Color tokens for light theme
 */
export const lightColors = {
  // Primary palette
  primary: '#4361ee',
  primaryLight: '#738eef',
  primaryDark: '#2940b3',
  
  // Secondary palette
  secondary: '#6c757d',
  secondaryLight: '#adb5bd',
  secondaryDark: '#495057',
  
  // Semantic colors
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
  
  // Neutrals
  background: '#ffffff',
  surface: '#f8f9fa',
  surfaceVariant: '#f0f0f0',
  border: '#e0e0e0',
  divider: '#eeeeee',
  
  // Typography
  textPrimary: '#212529',
  textSecondary: '#6c757d',
  textDisabled: '#adb5bd',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',
};

/**
 * Color tokens for dark theme
 */
export const darkColors = {
  // Primary palette
  primary: '#738eef',
  primaryLight: '#a5b9f3',
  primaryDark: '#2940b3',
  
  // Secondary palette
  secondary: '#adb5bd',
  secondaryLight: '#ced4da',
  secondaryDark: '#6c757d',
  
  // Semantic colors
  success: '#2ecc71',
  warning: '#f39c12',
  error: '#e74c3c',
  info: '#3498db',
  
  // Neutrals
  background: '#121212',
  surface: '#1e1e1e',
  surfaceVariant: '#2a2a2a',
  border: '#333333',
  divider: '#2c2c2c',
  
  // Typography
  textPrimary: '#f8f9fa',
  textSecondary: '#adb5bd',
  textDisabled: '#6c757d',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',
};

/**
 * Type for color token keys
 */
export type ColorToken = keyof typeof lightColors;
