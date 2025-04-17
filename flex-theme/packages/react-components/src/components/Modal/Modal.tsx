import React, { useEffect, useRef } from 'react';
import { useFlexTheme } from 'flex-theme/react';
import { createPortal } from 'react-dom';

export interface ModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when the modal is closed
   */
  onClose: () => void;
  
  /**
   * Modal title
   */
  title?: React.ReactNode;
  
  /**
   * Modal content
   */
  children: React.ReactNode;
  
  /**
   * Modal footer
   */
  footer?: React.ReactNode;
  
  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Whether to close the modal when clicking outside
   * @default true
   */
  closeOnOverlayClick?: boolean;
  
  /**
   * Whether to close the modal when pressing Escape
   * @default true
   */
  closeOnEsc?: boolean;
  
  /**
   * Whether to show a close button
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Whether to center the modal vertically
   * @default true
   */
  isCentered?: boolean;
  
  /**
   * Custom class for the modal
   */
  className?: string;
}

/**
 * Modal component with theme support
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  isCentered = true,
  className = '',
}) => {
  const { resolvedTheme } = useFlexTheme();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  // Store the previously focused element
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);
  
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);
  
  // Handle focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus the modal
      modalRef.current.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);
  
  // Handle overlay click
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  // Base classes
  const overlayClasses = [
    'flex-modal-overlay',
    isCentered ? 'flex-modal-overlay--centered' : '',
    `flex-modal-overlay--theme-${resolvedTheme}`
  ].filter(Boolean).join(' ');
  
  const modalClasses = [
    'flex-modal',
    `flex-modal--${size}`,
    `flex-modal--theme-${resolvedTheme}`,
    className
  ].filter(Boolean).join(' ');
  
  if (!isOpen) {
    return null;
  }
  
  return createPortal(
    <div 
      className={overlayClasses}
      onClick={handleOverlayClick}
      data-theme={resolvedTheme}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className={modalClasses}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className={`flex-modal-header flex-modal-header--theme-${resolvedTheme}`}>
            {title && (
              <h3 className={`flex-modal-title flex-modal-title--theme-${resolvedTheme}`}>
                {title}
              </h3>
            )}
            
            {showCloseButton && (
              <button 
                className={`flex-modal-close flex-modal-close--theme-${resolvedTheme}`}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className={`flex-modal-body flex-modal-body--theme-${resolvedTheme}`}>
          {children}
        </div>
        
        {footer && (
          <div className={`flex-modal-footer flex-modal-footer--theme-${resolvedTheme}`}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
