import React from 'react';
import { useFlexTheme } from 'flex-theme/react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Whether the button should take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  endIcon?: React.ReactNode;
}

/**
 * Button component with theme support
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  startIcon,
  endIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const baseClasses = 'flex-button';
  
  // Variant classes
  const variantClasses = `flex-button--${variant}`;
  
  // Size classes
  const sizeClasses = `flex-button--${size}`;
  
  // Width classes
  const widthClasses = fullWidth ? 'flex-button--full-width' : '';
  
  // State classes
  const stateClasses = [
    disabled ? 'flex-button--disabled' : '',
    loading ? 'flex-button--loading' : '',
    `flex-button--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variantClasses,
    sizeClasses,
    widthClasses,
    stateClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      data-theme={resolvedTheme}
      {...props}
    >
      {loading && (
        <span className="flex-button__spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      {startIcon && <span className="flex-button__start-icon">{startIcon}</span>}
      
      {children && <span className="flex-button__content">{children}</span>}
      
      {endIcon && <span className="flex-button__end-icon">{endIcon}</span>}
    </button>
  );
};
