import React, { useState } from 'react';
import { useFlexTheme } from 'flex-theme/react';

export interface NavbarProps {
  /**
   * Brand/logo element
   */
  brand?: React.ReactNode;
  
  /**
   * Navigation items
   */
  children: React.ReactNode;
  
  /**
   * Elements to display on the right side
   */
  rightElements?: React.ReactNode;
  
  /**
   * Whether the navbar is fixed to the top
   * @default false
   */
  fixed?: boolean;
  
  /**
   * Whether to show a shadow
   * @default true
   */
  shadow?: boolean;
  
  /**
   * Navbar variant
   * @default 'filled'
   */
  variant?: 'filled' | 'outline' | 'transparent';
  
  /**
   * Navbar color
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'neutral';
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Breakpoint for mobile menu
   * @default 'md'
   */
  mobileBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Navbar component for navigation
 */
export const Navbar: React.FC<NavbarProps> = ({
  brand,
  children,
  rightElements,
  fixed = false,
  shadow = true,
  variant = 'filled',
  color = 'primary',
  className = '',
  mobileBreakpoint = 'md',
}) => {
  const { resolvedTheme } = useFlexTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Base classes
  const navbarClasses = [
    'flex-navbar',
    `flex-navbar--${variant}`,
    `flex-navbar--${color}`,
    `flex-navbar--theme-${resolvedTheme}`,
    `flex-navbar--mobile-${mobileBreakpoint}`,
    fixed ? 'flex-navbar--fixed' : '',
    shadow ? 'flex-navbar--shadow' : '',
    isMenuOpen ? 'flex-navbar--menu-open' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <nav className={navbarClasses}>
      <div className="flex-navbar-container">
        {brand && (
          <div className="flex-navbar-brand">
            {brand}
          </div>
        )}
        
        <button
          className="flex-navbar-toggle"
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="flex-navbar-toggle-icon"></span>
        </button>
        
        <div className="flex-navbar-collapse">
          <ul className="flex-navbar-nav">
            {children}
          </ul>
          
          {rightElements && (
            <div className="flex-navbar-right">
              {rightElements}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export interface NavItemProps {
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
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  
  /**
   * Item content
   */
  children: React.ReactNode;
}

/**
 * NavItem component for navbar items
 */
export const NavItem: React.FC<NavItemProps> = ({
  active = false,
  disabled = false,
  className = '',
  onClick,
  children,
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const navItemClasses = [
    'flex-nav-item',
    `flex-nav-item--theme-${resolvedTheme}`,
    active ? 'flex-nav-item--active' : '',
    disabled ? 'flex-nav-item--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <li
      className={navItemClasses}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {children}
    </li>
  );
};

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Whether the link is active
   * @default false
   */
  active?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * NavLink component for navbar links
 */
export const NavLink: React.FC<NavLinkProps> = ({
  active = false,
  className = '',
  children,
  ...props
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const navLinkClasses = [
    'flex-nav-link',
    `flex-nav-link--theme-${resolvedTheme}`,
    active ? 'flex-nav-link--active' : '',
    props.disabled ? 'flex-nav-link--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <a
      className={navLinkClasses}
      aria-current={active ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export interface NavDropdownProps {
  /**
   * Dropdown trigger element
   */
  trigger: React.ReactNode;
  
  /**
   * Dropdown items
   */
  children: React.ReactNode;
  
  /**
   * Whether the dropdown is active
   * @default false
   */
  active?: boolean;
  
  /**
   * Whether the dropdown is disabled
   * @default false
   */
  disabled?: boolean;
  
  /**
   * Custom class name
   */
  className?: string;
  
  /**
   * Dropdown alignment
   * @default 'left'
   */
  align?: 'left' | 'right';
}

/**
 * NavDropdown component for navbar dropdowns
 */
export const NavDropdown: React.FC<NavDropdownProps> = ({
  trigger,
  children,
  active = false,
  disabled = false,
  className = '',
  align = 'left',
}) => {
  const { resolvedTheme } = useFlexTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Base classes
  const dropdownClasses = [
    'flex-nav-dropdown',
    `flex-nav-dropdown--theme-${resolvedTheme}`,
    `flex-nav-dropdown--align-${align}`,
    isOpen ? 'flex-nav-dropdown--open' : '',
    active ? 'flex-nav-dropdown--active' : '',
    disabled ? 'flex-nav-dropdown--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleBlur = (e: React.FocusEvent) => {
    // Close dropdown when focus moves outside
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };
  
  return (
    <div
      className={dropdownClasses}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <div
        className="flex-nav-dropdown-trigger"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        {trigger}
        <span className="flex-nav-dropdown-arrow">▼</span>
      </div>
      
      <div className="flex-nav-dropdown-menu">
        <ul className="flex-nav-dropdown-items">
          {children}
        </ul>
      </div>
    </div>
  );
};

export interface NavDropdownItemProps {
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
  onClick?: React.MouseEventHandler<HTMLLIElement>;
  
  /**
   * Item content
   */
  children: React.ReactNode;
}

/**
 * NavDropdownItem component for dropdown items
 */
export const NavDropdownItem: React.FC<NavDropdownItemProps> = ({
  active = false,
  disabled = false,
  className = '',
  onClick,
  children,
}) => {
  const { resolvedTheme } = useFlexTheme();
  
  // Base classes
  const itemClasses = [
    'flex-nav-dropdown-item',
    `flex-nav-dropdown-item--theme-${resolvedTheme}`,
    active ? 'flex-nav-dropdown-item--active' : '',
    disabled ? 'flex-nav-dropdown-item--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <li
      className={itemClasses}
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
    >
      {children}
    </li>
  );
};
