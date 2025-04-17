import { lightColors, darkColors, spacing, typography, radius, lightShadows, darkShadows } from 'flex-theme/tokens';

interface TailwindPluginOptions {
  /**
   * Prefix for CSS variables
   * @default 'flex'
   */
  prefix?: string;
  
  /**
   * Whether to include spacing variables
   * @default true
   */
  includeSpacing?: boolean;
  
  /**
   * Whether to include typography variables
   * @default true
   */
  includeTypography?: boolean;
  
  /**
   * Whether to include radius variables
   * @default true
   */
  includeRadius?: boolean;
  
  /**
   * Whether to include shadow variables
   * @default true
   */
  includeShadows?: boolean;
}

/**
 * Tailwind CSS plugin for flex-theme
 * @param options Plugin options
 * @returns Tailwind plugin
 */
function createFlexThemePlugin(options: TailwindPluginOptions = {}) {
  const {
    prefix = 'flex',
    includeSpacing = true,
    includeTypography = true,
    includeRadius = true,
    includeShadows = true
  } = options;
  
  // Create the plugin
  return function(api: any) {
    const { addBase, theme } = api;
    
    // Generate CSS variables for light theme
    const lightThemeVars: Record<string, string> = {};
    
    // Add color variables
    Object.entries(lightColors).forEach(([key, value]) => {
      lightThemeVars[`--${prefix}-color-${key}`] = value;
    });
    
    // Add spacing variables if enabled
    if (includeSpacing) {
      Object.entries(spacing).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-spacing-${key}`] = value;
      });
    }
    
    // Add typography variables if enabled
    if (includeTypography) {
      Object.entries(typography.fontFamily).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-font-family-${key}`] = value;
      });
      
      Object.entries(typography.fontSize).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-font-size-${key}`] = value;
      });
      
      Object.entries(typography.lineHeight).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-line-height-${key}`] = String(value);
      });
      
      Object.entries(typography.fontWeight).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-font-weight-${key}`] = String(value);
      });
    }
    
    // Add radius variables if enabled
    if (includeRadius) {
      Object.entries(radius).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-radius-${key}`] = value;
      });
    }
    
    // Add shadow variables if enabled
    if (includeShadows) {
      Object.entries(lightShadows).forEach(([key, value]) => {
        lightThemeVars[`--${prefix}-shadow-${key}`] = value;
      });
    }
    
    // Generate CSS variables for dark theme
    const darkThemeVars: Record<string, string> = {};
    
    // Add color variables
    Object.entries(darkColors).forEach(([key, value]) => {
      darkThemeVars[`--${prefix}-color-${key}`] = value;
    });
    
    // Add shadow variables if enabled
    if (includeShadows) {
      Object.entries(darkShadows).forEach(([key, value]) => {
        darkThemeVars[`--${prefix}-shadow-${key}`] = value;
      });
    }
    
    // Add the variables to the base styles
    addBase({
      ':root': lightThemeVars,
      '[data-theme="dark"]': darkThemeVars
    });
    
    // Return the plugin configuration
    return {
      theme: {
        extend: {
          colors: Object.fromEntries(
            Object.keys(lightColors).map(key => [
              key,
              `var(--${prefix}-color-${key})`
            ])
          ),
          spacing: includeSpacing
            ? Object.fromEntries(
                Object.keys(spacing).map(key => [
                  key,
                  `var(--${prefix}-spacing-${key})`
                ])
              )
            : {},
          fontFamily: includeTypography
            ? Object.fromEntries(
                Object.keys(typography.fontFamily).map(key => [
                  key,
                  `var(--${prefix}-font-family-${key})`
                ])
              )
            : {},
          fontSize: includeTypography
            ? Object.fromEntries(
                Object.keys(typography.fontSize).map(key => [
                  key,
                  `var(--${prefix}-font-size-${key})`
                ])
              )
            : {},
          lineHeight: includeTypography
            ? Object.fromEntries(
                Object.keys(typography.lineHeight).map(key => [
                  key,
                  `var(--${prefix}-line-height-${key})`
                ])
              )
            : {},
          fontWeight: includeTypography
            ? Object.fromEntries(
                Object.keys(typography.fontWeight).map(key => [
                  key,
                  `var(--${prefix}-font-weight-${key})`
                ])
              )
            : {},
          borderRadius: includeRadius
            ? Object.fromEntries(
                Object.keys(radius).map(key => [
                  key,
                  `var(--${prefix}-radius-${key})`
                ])
              )
            : {},
          boxShadow: includeShadows
            ? Object.fromEntries(
                Object.keys(lightShadows).map(key => [
                  key,
                  `var(--${prefix}-shadow-${key})`
                ])
              )
            : {}
        }
      }
    };
  };
}

// Export the plugin creator
export default createFlexThemePlugin;
