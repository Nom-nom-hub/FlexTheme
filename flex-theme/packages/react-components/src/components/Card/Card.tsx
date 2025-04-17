import React from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Card variant
   * @default 'default'
   */
  variant?: 'default' | 'outlined' | 'elevated';
  
  /**
   * Whether to add padding to the card
   * @default true
   */
  padding?: boolean;
  
  /**
   * Whether to add a hover effect to the card
   * @default false
   */
  hoverable?: boolean;
}

/**
 * Card component with theme support
 */
export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = true,
  hoverable = false,
  children,
  className = '',
  ...props
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const baseClasses = 'flex-card';
  
  // Variant classes
  const variantClasses = `flex-card--${variant}`;
  
  // Padding classes
  const paddingClasses = padding ? 'flex-card--padded' : '';
  
  // Hover classes
  const hoverClasses = hoverable ? 'flex-card--hoverable' : '';
  
  // Theme classes
  const themeClasses = `flex-card--theme-${resolvedTheme}`;
  
  // Combine all classes
  const combinedClasses = [
    baseClasses,
    variantClasses,
    paddingClasses,
    hoverClasses,
    themeClasses,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={combinedClasses}
      data-theme={resolvedTheme}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Title of the card
   */
  title?: React.ReactNode;
  
  /**
   * Subtitle of the card
   */
  subtitle?: React.ReactNode;
  
  /**
   * Action component to display in the header
   */
  action?: React.ReactNode;
}

/**
 * Card header component
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  ...props
}) => {
  const combinedClasses = ['flex-card__header', className].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClasses} {...props}>
      {children || (
        <>
          <div className="flex-card__header-content">
            {title && <h3 className="flex-card__title">{title}</h3>}
            {subtitle && <div className="flex-card__subtitle">{subtitle}</div>}
          </div>
          {action && <div className="flex-card__action">{action}</div>}
        </>
      )}
    </div>
  );
};

/**
 * Card content component
 */
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const combinedClasses = ['flex-card__content', className].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Card footer component
 */
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const combinedClasses = ['flex-card__footer', className].filter(Boolean).join(' ');
  
  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
};
