/**
 * Calculates the contrast ratio between two colors
 * @param foreground Foreground color in hex format (e.g., #ffffff)
 * @param background Background color in hex format (e.g., #000000)
 * @returns Contrast ratio (1-21)
 */
export function calculateContrastRatio(foreground: string, background: string): number {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    // Calculate relative luminance
    const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  };
  
  const luminance1 = getLuminance(foreground);
  const luminance2 = getLuminance(background);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Checks if a color combination meets WCAG accessibility standards
 * @param foreground Foreground color in hex format
 * @param background Background color in hex format
 * @param level Accessibility level (AA or AAA)
 * @param isLargeText Whether the text is large (>=18pt or >=14pt bold)
 * @returns Whether the combination is accessible
 */
export function isAccessible(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(foreground, background);
  
  if (level === 'AA') {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  } else { // AAA
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
}

/**
 * Converts a hex color to RGB
 * @param hex Hex color string
 * @returns RGB object
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Converts RGB to hex
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns Hex color string
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Adjusts a color's lightness
 * @param hex Hex color string
 * @param amount Amount to adjust (-100 to 100)
 * @returns Adjusted hex color
 */
function adjustLightness(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  
  // Convert RGB to HSL
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  
  // Adjust lightness
  const newL = Math.max(0, Math.min(1, l + amount / 100));
  
  // Simple lightness adjustment (not perfect but works for our purpose)
  const factor = newL / l || 0;
  
  return rgbToHex(r * factor, g * factor, b * factor);
}

/**
 * Suggests an accessible color based on a base color and background
 * @param baseColor Base color to adjust
 * @param background Background color
 * @param level Accessibility level to meet
 * @param isLargeText Whether the text is large
 * @returns Adjusted color that meets accessibility standards
 */
export function suggestAccessibleColor(
  baseColor: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): string {
  // If already accessible, return the base color
  if (isAccessible(baseColor, background, level, isLargeText)) {
    return baseColor;
  }
  
  const { r, g, b } = hexToRgb(baseColor);
  const bgRgb = hexToRgb(background);
  
  // Determine if we need to lighten or darken
  const baseLuminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const bgLuminance = (0.299 * bgRgb.r + 0.587 * bgRgb.g + 0.114 * bgRgb.b) / 255;
  
  const shouldLighten = bgLuminance < 0.5;
  
  // Iteratively adjust the color until it meets the requirements
  let adjustedColor = baseColor;
  let step = shouldLighten ? 5 : -5;
  let adjustment = 0;
  
  while (!isAccessible(adjustedColor, background, level, isLargeText) && Math.abs(adjustment) <= 100) {
    adjustment += step;
    adjustedColor = adjustLightness(baseColor, adjustment);
  }
  
  return adjustedColor;
}

/**
 * Checks if a color is light or dark
 * @param color Hex color string
 * @returns True if the color is light
 */
export function isLightColor(color: string): boolean {
  const { r, g, b } = hexToRgb(color);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
