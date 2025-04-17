import React, { forwardRef } from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input variant
   * @default 'outline'
   */
  variant?: 'outline' | 'filled' | 'unstyled';
  
  /**
   * Input size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the input is invalid
   * @default false
   */
  isInvalid?: boolean;
  
  /**
   * Label for the input
   */
  label?: string;
  
  /**
   * Helper text to display below the input
   */
  helperText?: string;
  
  /**
   * Error message to display when isInvalid is true
   */
  errorText?: string;
  
  /**
   * Left icon or element
   */
  leftElement?: React.ReactNode;
  
  /**
   * Right icon or element
   */
  rightElement?: React.ReactNode;
  
  /**
   * Whether the input takes up the full width of its container
   * @default false
   */
  fullWidth?: boolean;
}

/**
 * Input component with theme support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'outline',
  size = 'md',
  isInvalid = false,
  label,
  helperText,
  errorText,
  leftElement,
  rightElement,
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const { resolvedTheme } = useFlexTheme();
  const inputId = id || `flex-input-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const wrapperClasses = [
    'flex-input-wrapper',
    fullWidth ? 'flex-input-wrapper--full-width' : '',
    `flex-input-wrapper--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  const inputWrapperClasses = [
    'flex-input-field-wrapper',
    `flex-input-field-wrapper--${variant}`,
    `flex-input-field-wrapper--${size}`,
    isInvalid ? 'flex-input-field-wrapper--invalid' : '',
    leftElement ? 'flex-input-field-wrapper--with-left-element' : '',
    rightElement ? 'flex-input-field-wrapper--with-right-element' : '',
    `flex-input-field-wrapper--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  const inputClasses = [
    'flex-input',
    `flex-input--${variant}`,
    `flex-input--${size}`,
    isInvalid ? 'flex-input--invalid' : '',
    `flex-input--theme-${resolvedTheme}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      {label && (
        <label 
          htmlFor={inputId} 
          className={`flex-input-label flex-input-label--theme-${resolvedTheme}`}
        >
          {label}
        </label>
      )}
      
      <div className={inputWrapperClasses}>
        {leftElement && (
          <div className="flex-input-element flex-input-element--left">
            {leftElement}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={isInvalid}
          aria-describedby={
            helperText || errorText 
              ? `${inputId}-description` 
              : undefined
          }
          data-theme={resolvedTheme}
          {...props}
        />
        
        {rightElement && (
          <div className="flex-input-element flex-input-element--right">
            {rightElement}
          </div>
        )}
      </div>
      
      {(helperText || (isInvalid && errorText)) && (
        <div 
          id={`${inputId}-description`}
          className={`flex-input-text flex-input-text--theme-${resolvedTheme} ${
            isInvalid ? 'flex-input-text--error' : ''
          }`}
        >
          {isInvalid ? errorText : helperText}
        </div>
      )}
    </div>
  );
});
