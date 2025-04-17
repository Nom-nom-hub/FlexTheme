import React, { forwardRef } from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Label for the switch
   */
  label?: string;
  
  /**
   * Size of the switch
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether the switch is invalid
   * @default false
   */
  isInvalid?: boolean;
  
  /**
   * Helper text to display below the switch
   */
  helperText?: string;
  
  /**
   * Error message to display when isInvalid is true
   */
  errorText?: string;
  
  /**
   * Position of the label
   * @default 'right'
   */
  labelPosition?: 'left' | 'right';
}

/**
 * Switch component with theme support
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  size = 'md',
  isInvalid = false,
  helperText,
  errorText,
  labelPosition = 'right',
  className = '',
  id,
  ...props
}, ref) => {
  const { resolvedTheme } = useFlexTheme();
  const switchId = id || `flex-switch-${Math.random().toString(36).substring(2, 9)}`;
  
  // Base classes
  const wrapperClasses = [
    'flex-switch-wrapper',
    `flex-switch-wrapper--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  const containerClasses = [
    'flex-switch-container',
    `flex-switch-container--label-${labelPosition}`,
    `flex-switch-container--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  const switchClasses = [
    'flex-switch',
    `flex-switch--${size}`,
    isInvalid ? 'flex-switch--invalid' : '',
    `flex-switch--theme-${resolvedTheme}`,
    className
  ].filter(Boolean).join(' ');
  
  const labelClasses = [
    'flex-switch-label',
    `flex-switch-label--${size}`,
    `flex-switch-label--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  return (
    <div className={wrapperClasses}>
      <div className={containerClasses}>
        {label && labelPosition === 'left' && (
          <label 
            htmlFor={switchId} 
            className={labelClasses}
          >
            {label}
          </label>
        )}
        
        <div className={`flex-switch-track flex-switch-track--${size} flex-switch-track--theme-${resolvedTheme} ${
          isInvalid ? 'flex-switch-track--invalid' : ''
        }`}>
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            className={switchClasses}
            aria-invalid={isInvalid}
            aria-describedby={
              helperText || errorText 
                ? `${switchId}-description` 
                : undefined
            }
            data-theme={resolvedTheme}
            {...props}
          />
          <div className={`flex-switch-thumb flex-switch-thumb--${size} flex-switch-thumb--theme-${resolvedTheme}`} />
        </div>
        
        {label && labelPosition === 'right' && (
          <label 
            htmlFor={switchId} 
            className={labelClasses}
          >
            {label}
          </label>
        )}
      </div>
      
      {(helperText || (isInvalid && errorText)) && (
        <div 
          id={`${switchId}-description`}
          className={`flex-switch-text flex-switch-text--theme-${resolvedTheme} ${
            isInvalid ? 'flex-switch-text--error' : ''
          }`}
        >
          {isInvalid ? errorText : helperText}
        </div>
      )}
    </div>
  );
});
