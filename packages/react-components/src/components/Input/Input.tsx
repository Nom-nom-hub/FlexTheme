import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Input label
   */
  label?: React.ReactNode;
  
  /**
   * Helper text to display below the input
   */
  helperText?: React.ReactNode;
  
  /**
   * Icon to display at the start of the input
   */
  leftIcon?: React.ReactNode;
  
  /**
   * Icon to display at the end of the input
   */
  rightIcon?: React.ReactNode;
  
  /**
   * Size of the input
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Variant of the input
   * @default 'outline'
   */
  variant?: 'outline' | 'filled' | 'unstyled';
  
  /**
   * Whether the input is invalid
   */
  isInvalid?: boolean;
  
  /**
   * Error message to display when isInvalid is true
   */
  errorMessage?: string;
  
  /**
   * Whether the input is full width
   */
  fullWidth?: boolean;
}

/**
 * Input component for text input
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      label,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      variant = 'outline',
      isInvalid,
      errorMessage,
      fullWidth = false,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const inputId = id || `flex-input-${Math.random().toString(36).substring(2, 9)}`;
    
    // Combine class names
    const inputWrapperClasses = [
      'flex-input-wrapper',
      `flex-input-${variant}`,
      `flex-input-${size}`,
      fullWidth ? 'flex-input-full-width' : '',
      disabled ? 'flex-input-disabled' : '',
      isInvalid ? 'flex-input-invalid' : '',
      className
    ]
      .filter(Boolean)
      .join(' ');
    
    return (
      <div className={inputWrapperClasses}>
        {label && (
          <label htmlFor={inputId} className="flex-input-label">
            {label}
          </label>
        )}
        
        <div className="flex-input-container">
          {leftIcon && (
            <div className="flex-input-icon flex-input-left-icon">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`flex-input ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`}
            disabled={disabled}
            aria-invalid={isInvalid}
            {...props}
          />
          
          {rightIcon && (
            <div className="flex-input-icon flex-input-right-icon">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && !isInvalid && (
          <div className="flex-input-helper">
            {helperText}
          </div>
        )}
        
        {isInvalid && errorMessage && (
          <div className="flex-input-error">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 