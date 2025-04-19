import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
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
   * Makes the button take the full width of its container
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Show a loading spinner and disables the button
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * The element to be rendered as the loading indicator
   */
  loadingIndicator?: React.ReactNode;
  
  /**
   * Optional icon to display before the button text
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Optional icon to display after the button text
   */
  rightIcon?: React.ReactNode;
}

/**
 * Button component for user interaction
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      loadingIndicator,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    // Generate class names
    const buttonClasses = [
      'flex-button',
      `flex-button-${variant}`,
      `flex-button-${size}`,
      fullWidth ? 'flex-button-full-width' : '',
      isLoading ? 'flex-button-loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');
    
    // Default loading indicator
    const defaultLoadingIndicator = (
      <div className="flex-button-spinner">
        <div className="flex-button-spinner-inner"></div>
      </div>
    );
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="flex-button-loading-indicator">
            {loadingIndicator || defaultLoadingIndicator}
          </span>
        )}
        
        {!isLoading && leftIcon && (
          <span className="flex-button-left-icon">{leftIcon}</span>
        )}
        
        <span className="flex-button-text">{children}</span>
        
        {!isLoading && rightIcon && (
          <span className="flex-button-right-icon">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button'; 