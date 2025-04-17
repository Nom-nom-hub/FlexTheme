import React, { useState } from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface SidebarProps {
  /**
   * Sidebar content
   */
  children: React.ReactNode;
  
  /**
   * Whether the sidebar is expanded
   * @default true
   */
  expanded?: boolean;
  
  /**
   * Whether the sidebar is collapsible
   * @default true
   */
  collapsible?: boolean;
  
  /**
   * Width of the expanded sidebar
   * @default '240px'
   */
  width?: string;
  
  /**
   * Width of the collapsed sidebar
   * @default '64px'
   */
  collapsedWidth?: string;
  
  /**
   * Whether the sidebar is fixed to the side
   * @default false
   */
  fixed?: boolean;
  
  /**
   * Whether to show a shadow
   * @default true
   */
  shadow?: boolean;
  
  /**
   * Sidebar position
   * @default 'left'
   */
  position?: 'left' | 'right';
  
  /**
   * Sidebar variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outline' | 'transparent';
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Callback when expanded state changes
   */
  onExpandedChange?: (expanded: boolean) => void;
}

/**
 * Sidebar component for navigation
 */
export const Sidebar: React.FC<SidebarProps> = ({
  children,
  expanded = true,
  collapsible = true,
  width = '240px',
  collapsedWidth = '64px',
  fixed = false,
  shadow = true,
  position = 'left',
  variant = 'filled',
  className = '',
  onExpandedChange,
}) => {
  const { resolvedTheme } = useFlexTheme();
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Base classes
  const sidebarClasses = [
    'flex-sidebar',
    `flex-sidebar--${variant}`,
    `flex-sidebar--theme-${resolvedTheme}`,
    `flex-sidebar--position-${position}`,
    fixed ? 'flex-sidebar--fixed' : '',
    shadow ? 'flex-sidebar--shadow' : '',
    isExpanded ? 'flex-sidebar--expanded' : 'flex-sidebar--collapsed',
    className
  ].filter(Boolean).join(' ');
  
  // Handle toggle
  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    
    if (onExpandedChange) {
      onExpandedChange(newExpanded);
    }
  };
  
  return (
    <aside
      className={sidebarClasses}
      style={{
        width: isExpanded ? width : collapsedWidth,
      }}
    >
      <div className="flex-sidebar-content">
        {children}
      </div>
      
      {collapsible && (
        <button
          className="flex-sidebar-toggle"
          onClick={handleToggle}
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span className="flex-sidebar-toggle-icon">
            {position === 'left' ? (isExpanded ? '◀' : '▶') : (isExpanded ? '▶' : '◀')}
          </span>
        </button>
      )}
    </aside>
  );
};

export interface SidebarSectionProps {
  /**
   * Section title
   */
  title?: React.ReactNode;
  
  /**
   * Section content
   */
  children: React.ReactNode;
  
  /**
   * Whether the section is collapsible
   * @default false
   */
  collapsible?: boolean;
  
  /**
   * Whether the section is expanded
   * @default true
   */
  expanded?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * SidebarSection component for grouping sidebar items
 */
export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  children,
  collapsible = false,
  expanded = true,
  className = '',
}) => {
  const { resolvedTheme } = useFlexTheme();
  const [isExpanded, setIsExpanded] = useState(expanded);
  
  // Base classes
  const sectionClasses = [
    'flex-sidebar-section',
    `flex-sidebar-section--theme-${resolvedTheme}`,
    collapsible ? 'flex-sidebar-section--collapsible' : '',
    isExpanded ? 'flex-sidebar-section--expanded' : 'flex-sidebar-section--collapsed',
    className
  ].filter(Boolean).join(' ');
  
  // Handle toggle
  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <div className={sectionClasses}>
      {title && (
        <div
          className="flex-sidebar-section-header"
          onClick={handleToggle}
        >
          <span className="flex-sidebar-section-title">{title}</span>
          
          {collapsible && (
            <span className="flex-sidebar-section-icon">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
      )}
      
      <div className="flex-sidebar-section-content">
        {children}
      </div>
    </div>
  );
};

export interface SidebarItemProps {
  /**
   * Item icon
   */
  icon?: React.ReactNode;
  
  /**
   * Item label
   */
  label: React.ReactNode;
  
  /**
   * Whether the item is active
   * @default false
   */
  active?: boolean;
  
  /**
   * Whether the item is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Click handler
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * SidebarItem component for sidebar navigation items
 */
export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  disabled = false,
  className = '',
  onClick,
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const itemClasses = [
    'flex-sidebar-item',
    `flex-sidebar-item--theme-${resolvedTheme}`,
    active ? 'flex-sidebar-item--active' : '',
    disabled ? 'flex-sidebar-item--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={itemClasses}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {icon && (
        <span className="flex-sidebar-item-icon">{icon}</span>
      )}
      
      <span className="flex-sidebar-item-label">{label}</span>
    </div>
  );
};
