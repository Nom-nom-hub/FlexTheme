import React, { forwardRef } from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label for the checkbox
   */
  label?: string;
  
  /**
   * Size of the checkbox
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the checkbox is invalid
   * @default false
   */
  isInvalid?: boolean;
  
  /**
   * Helper text to display below the checkbox
   */
  helperText?: string;
  
  /**
   * Error message to display when isInvalid is true
   */
  errorText?: string;
}

/**
 * Checkbox component with theme support
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  size = 'md',
  isInvalid = false,
  helperText,
  errorText,
  className = '',
  id,
  ...props
}, ref) => {
  const { resolvedTheme } = useFlexTheme();
  const checkboxId = id || `flex-checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const wrapperClasses = [
    'flex-checkbox-wrapper',
    `flex-checkbox-wrapper--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  const checkboxClasses = [
    'flex-checkbox',
    `flex-checkbox--${size}`,
    isInvalid ? 'flex-checkbox--invalid' : '',
    `flex-checkbox--theme-${resolvedTheme}`,
    className
  ].filter(Boolean).join(' ');
  
  const labelClasses = [
    'flex-checkbox-label',
    `flex-checkbox-label--${size}`,
    `flex-checkbox-label--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      <div className="flex-checkbox-container">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={checkboxClasses}
          aria-invalid={isInvalid}
          aria-describedby={
            helperText || errorText 
              ? `${checkboxId}-description` 
              : undefined
          }
          data-theme={resolvedTheme}
          {...props}
        />
        
        <div className={`flex-checkbox-custom flex-checkbox-custom--${size} flex-checkbox-custom--theme-${resolvedTheme}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        
        {label && (
          <label 
            htmlFor={checkboxId} 
            className={labelClasses}
          >
            {label}
          </label>
        )}
      </div>
      
      {(helperText || (isInvalid && errorText)) && (
        <div 
          id={`${checkboxId}-description`}
          className={`flex-checkbox-text flex-checkbox-text--theme-${resolvedTheme} ${
            isInvalid ? 'flex-checkbox-text--error' : ''
          }`}
        >
          {isInvalid ? errorText : helperText}
        </div>
      )}
    </div>
  );
});
