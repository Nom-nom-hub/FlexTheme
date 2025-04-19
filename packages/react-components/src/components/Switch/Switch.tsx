import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Switch.css';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label for the switch
   */
  label?: React.ReactNode;
  
  /**
   * Description text to display below the label
   */
  description?: React.ReactNode;
  
  /**
   * Size of the switch
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the switch is invalid
   */
  isInvalid?: boolean;
  
  /**
   * Error message to display when isInvalid is true
   */
  errorMessage?: string;
  
  /**
   * Custom colors for the switch
   */
  colorScheme?: string;
}

/**
 * Switch component for boolean toggle inputs
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      label,
      description,
      size = 'md',
      isInvalid,
      errorMessage,
      className = '',
      disabled,
      colorScheme,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const switchId = id || `flex-switch-${Math.random().toString(36).substring(2, 9)}`;
    
    // Combine class names
    const switchClasses = [
      'flex-switch-container',
      `flex-switch-${size}`,
      disabled ? 'flex-switch-disabled' : '',
      isInvalid ? 'flex-switch-invalid' : '',
      colorScheme ? `flex-switch-${colorScheme}` : '',
      className
    ]
      .filter(Boolean)
      .join(' ');
    
    return (
      <div className={switchClasses}>
        <div className="flex-switch-inner">
          <input
            ref={ref}
            id={switchId}
            type="checkbox"
            role="switch"
            className="flex-switch-input"
            disabled={disabled}
            aria-invalid={isInvalid}
            {...props}
          />
          
          <label 
            htmlFor={switchId} 
            className="flex-switch-label"
          >
            <span className="flex-switch-track">
              <span className="flex-switch-thumb" />
            </span>
            
            {label && (
              <span className="flex-switch-text">
                {label}
              </span>
            )}
          </label>
        </div>
        
        {description && (
          <div className="flex-switch-description">
            {description}
          </div>
        )}
        
        {isInvalid && errorMessage && (
          <div className="flex-switch-error">
            {errorMessage}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch'; 