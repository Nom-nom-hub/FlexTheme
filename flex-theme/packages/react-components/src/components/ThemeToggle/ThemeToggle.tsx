import React from 'react';
import { useFlexTheme } from 'flex-theme/react';
import type { Theme } from 'flex-theme';

export interface ThemeToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /**
   * Icon to display for light theme
   * @default '☀️'
   */
  lightIcon?: React.ReactNode;
  
  /**
   * Icon to display for dark theme
   * @default '🌙'
   */
  darkIcon?: React.ReactNode;
  
  /**
   * Icon to display for auto theme
   * @default '⚙️'
   */
  autoIcon?: React.ReactNode;
  
  /**
   * Whether to show the theme label
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Whether to cycle through themes (light -> dark -> auto)
   * @default false
   */
  cycleThemes?: boolean;
  
  /**
   * Callback when theme changes
   */
  onChange?: (theme: Theme) => void;
  
  /**
   * Button variant
   * @default 'icon'
   */
  variant?: 'icon' | 'button' | 'select';
}

/**
 * ThemeToggle component with theme support
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  lightIcon = '☀️',
  darkIcon = '🌙',
  autoIcon = '⚙️',
  showLabel = false,
  cycleThemes = false,
  onChange,
  variant = 'icon',
  className = '',
  ...props
}) => {
  const { theme, resolvedTheme, setTheme } = useFlexTheme();
  
  // Get the current icon based on theme
  const getIcon = () => {
    if (theme === 'auto') return autoIcon;
    return resolvedTheme === 'light' ? lightIcon : darkIcon;
  };
  
  // Get the current label based on theme
  const getLabel = () => {
    if (theme === 'auto') return 'Auto';
    return resolvedTheme === 'light' ? 'Light' : 'Dark';
  };
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    onChange?.(newTheme);
  };
  
  // Handle button click
  const handleClick = () => {
    if (cycleThemes) {
      // Cycle through light -> dark -> auto
      const nextTheme: Theme = 
        theme === 'light' ? 'dark' : 
        theme === 'dark' ? 'auto' : 'light';
      
      handleThemeChange(nextTheme);
    } else {
      // Toggle between light and dark
      handleThemeChange(resolvedTheme === 'light' ? 'dark' : 'light');
    }
  };
  
  // Handle select change
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleThemeChange(e.target.value as Theme);
  };
  
  // Base classes
  const baseClasses = 'flex-theme-toggle';
  
  // Variant classes
  const variantClasses = `flex-theme-toggle--${variant}`;
  
  // Theme classes
  const themeClasses = `flex-theme-toggle--theme-${resolvedTheme}`;
  
  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variantClasses,
    themeClasses,
    className
  ].filter(Boolean).join(' ');
  
  // Render based on variant
  if (variant === 'select') {
    return (
      <div className={combinedClasses} data-theme={resolvedTheme}>
        <select
          value={theme}
          onChange={handleSelectChange}
          className="flex-theme-toggle__select"
          aria-label="Select theme"
          {...props}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto (System)</option>
        </select>
      </div>
    );
  }
  
  // For icon and button variants
  return (
    <button
      type="button"
      onClick={handleClick}
      className={combinedClasses}
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
      data-theme={resolvedTheme}
      {...props}
    >
      <span className="flex-theme-toggle__icon">{getIcon()}</span>
      {showLabel && <span className="flex-theme-toggle__label">{getLabel()}</span>}
    </button>
  );
};
