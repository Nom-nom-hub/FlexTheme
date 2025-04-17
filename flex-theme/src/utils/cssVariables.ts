import { 
  lightColors, 
  darkColors, 
  spacing, 
  typography, 
  radius, 
  lightShadows, 
  darkShadows 
} from '../tokens';

/**
 * Generates CSS variables from design tokens
 * @returns CSS string with all variables
 */
export function generateCSSVariables(): string {
  // Generate color variables
  const lightColorVars = Object.entries(lightColors).map(([key, value]) => 
    `--color-${key}: ${value};`
  ).join('\n  ');
  
  const darkColorVars = Object.entries(darkColors).map(([key, value]) => 
    `--color-${key}: ${value};`
  ).join('\n  ');
  
  // Generate spacing variables
  const spacingVars = Object.entries(spacing).map(([key, value]) => 
    `--spacing-${key}: ${value};`
  ).join('\n  ');
  
  // Generate typography variables
  const fontFamilyVars = Object.entries(typography.fontFamily).map(([key, value]) => 
    `--font-family-${key}: ${value};`
  ).join('\n  ');
  
  const fontSizeVars = Object.entries(typography.fontSize).map(([key, value]) => 
    `--font-size-${key}: ${value};`
  ).join('\n  ');
  
  const lineHeightVars = Object.entries(typography.lineHeight).map(([key, value]) => 
    `--line-height-${key}: ${value};`
  ).join('\n  ');
  
  const fontWeightVars = Object.entries(typography.fontWeight).map(([key, value]) => 
    `--font-weight-${key}: ${value};`
  ).join('\n  ');
  
  // Generate radius variables
  const radiusVars = Object.entries(radius).map(([key, value]) => 
    `--radius-${key}: ${value};`
  ).join('\n  ');
  
  // Generate shadow variables
  const lightShadowVars = Object.entries(lightShadows).map(([key, value]) => 
    `--shadow-${key}: ${value};`
  ).join('\n  ');
  
  const darkShadowVars = Object.entries(darkShadows).map(([key, value]) => 
    `--shadow-${key}: ${value};`
  ).join('\n  ');
  
  // Combine all variables
  return `
:root {
  /* Colors */
  ${lightColorVars}
  
  /* Spacing */
  ${spacingVars}
  
  /* Typography */
  ${fontFamilyVars}
  ${fontSizeVars}
  ${lineHeightVars}
  ${fontWeightVars}
  
  /* Radius */
  ${radiusVars}
  
  /* Shadows */
  ${lightShadowVars}
}

[data-theme="dark"] {
  /* Colors */
  ${darkColorVars}
  
  /* Shadows */
  ${darkShadowVars}
}
  `.trim();
}

/**
 * Injects CSS variables into the document head
 */
export function injectCSSVariables(): void {
  if (typeof document === 'undefined') return;
  
  const styleId = 'flex-theme-variables';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }
  
  styleEl.textContent = generateCSSVariables();
}

/**
 * Gets a CSS variable value
 * @param name Variable name without the -- prefix
 * @returns The CSS variable value
 */
export function getCSSVariable(name: string): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();
}

/**
 * Sets a CSS variable value
 * @param name Variable name without the -- prefix
 * @param value Value to set
 */
export function setCSSVariable(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty(`--${name}`, value);
}
