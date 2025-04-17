import React from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface BreadcrumbItem {
  /**
   * Label for the breadcrumb item
   */
  label: React.ReactNode;
  
  /**
   * URL for the breadcrumb item
   */
  href?: string;
  
  /**
   * Icon for the breadcrumb item
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the item is active (current page)
   * @default false
   */
  active?: boolean;
  
  /**
   * Click handler
   */
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
}

export interface BreadcrumbsProps {
  /**
   * Array of breadcrumb items
   */
  items: BreadcrumbItem[];
  
  /**
   * Separator between breadcrumb items
   * @default '/'
   */
  separator?: React.ReactNode;
  
  /**
   * Maximum number of items to show
   * If there are more items, they will be collapsed
   * @default 0 (show all)
   */
  maxItems?: number;
  
  /**
   * Label for the collapsed items
   * @default '...'
   */
  collapsedLabel?: React.ReactNode;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Breadcrumbs component for navigation
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = '/',
  maxItems = 0,
  collapsedLabel = '...',
  className = '',
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const breadcrumbsClasses = [
    'flex-breadcrumbs',
    `flex-breadcrumbs--theme-${resolvedTheme}`,
    className
  ].filter(Boolean).join(' ');
  
  // Handle item collapse
  const visibleItems = maxItems > 0 && items.length > maxItems
    ? [
        ...items.slice(0, 1),
        { label: collapsedLabel },
        ...items.slice(items.length - (maxItems - 2))
      ]
    : items;
  
  return (
    <nav className={breadcrumbsClasses} aria-label="Breadcrumbs">
      <ol className="flex-breadcrumbs-list">
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;
          
          // Item classes
          const itemClasses = [
            'flex-breadcrumbs-item',
            item.active || isLast ? 'flex-breadcrumbs-item--active' : '',
          ].filter(Boolean).join(' ');
          
          return (
            <li key={index} className={itemClasses}>
              {item.href && !item.active ? (
                <a
                  href={item.href}
                  className="flex-breadcrumbs-link"
                  onClick={item.onClick}
                  aria-current={item.active ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="flex-breadcrumbs-icon">{item.icon}</span>
                  )}
                  <span className="flex-breadcrumbs-text">{item.label}</span>
                </a>
              ) : (
                <span
                  className="flex-breadcrumbs-text"
                  aria-current={item.active ? 'page' : undefined}
                  onClick={item.onClick}
                >
                  {item.icon && (
                    <span className="flex-breadcrumbs-icon">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="flex-breadcrumbs-separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
