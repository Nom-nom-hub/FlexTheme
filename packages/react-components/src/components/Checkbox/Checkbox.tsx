import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label for the checkbox
   */
  label?: React.ReactNode;

  /**
   * Description text to display below the label
   */
  description?: React.ReactNode;

  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Custom icon to display when checkbox is checked
   */
  icon?: React.ReactNode;

  /**
   * Whether the checkbox is invalid
   */
  isInvalid?: boolean;

  /**
   * Error message to display when isInvalid is true
   */
  errorMessage?: string;
}

/**
 * Checkbox component for boolean input
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      description,
      size = 'md',
      icon,
      isInvalid,
      errorMessage,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const checkboxId = id || `flex-checkbox-${Math.random().toString(36).substring(2, 9)}`;
    
    // Combine class names
    const checkboxClasses = [
      'flex-checkbox-container',
      `flex-checkbox-${size}`,
      disabled ? 'flex-checkbox-disabled' : '',
      isInvalid ? 'flex-checkbox-invalid' : '',
      className
    ]
      .filter(Boolean)
      .join(' ');
    
    return (
      <div className={checkboxClasses}>
        <div className="flex-checkbox-inner">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="flex-checkbox-input"
            disabled={disabled}
            aria-invalid={isInvalid}
            {...props}
          />
          
          <label 
            htmlFor={checkboxId} 
            className="flex-checkbox-label"
          >
            <span className="flex-checkbox-control">
              {icon || (
                <svg
                  className="flex-checkbox-check"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.5 7L6 9.5L10.5 4.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            
            {label && (
              <span className="flex-checkbox-text">
                {label}
              </span>
            )}
          </label>
        </div>
        
        {description && (
          <div className="flex-checkbox-description">
            {description}
          </div>
        )}
        
        {isInvalid && errorMessage && (
          <div className="flex-checkbox-error">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox'; 