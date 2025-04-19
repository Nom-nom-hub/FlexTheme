import React, { useEffect, useRef, useState, useCallback, HTMLAttributes } from 'react';
import './Modal.css';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  
  /**
   * Callback when the modal should close
   */
  onClose: () => void;
  
  /**
   * Modal title displayed in the header
   */
  title?: React.ReactNode;
  
  /**
   * Size of the modal
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  /**
   * Whether to close the modal when clicking outside of it
   * @default true
   */
  closeOnOverlayClick?: boolean;
  
  /**
   * Whether to close the modal when pressing the Escape key
   * @default true
   */
  closeOnEsc?: boolean;
  
  /**
   * Whether to show a close button in the header
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Content for the modal header
   * If not provided, the title will be used
   */
  headerContent?: React.ReactNode;
  
  /**
   * Content for the modal footer
   */
  footerContent?: React.ReactNode;
  
  /**
   * Custom z-index for the modal
   */
  zIndex?: number;
  
  /**
   * Custom styles for various parts of the modal
   */
  styles?: {
    overlay?: React.CSSProperties;
    content?: React.CSSProperties;
    header?: React.CSSProperties;
    body?: React.CSSProperties;
    footer?: React.CSSProperties;
  };
}

/**
 * Modal component for dialogs and popovers
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  headerContent,
  footerContent,
  zIndex,
  styles,
  children,
  className = '',
  ...props
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle mounting and focus management
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      
      if (focusableElements?.length) {
        focusableElements[0].focus();
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }
    
    const timer = setTimeout(() => {
      setIsMounted(false);
    }, 300); // Match transition duration
    
    return () => {
      clearTimeout(timer);
    };
  }, [isOpen]);
  
  // Handle escape key press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (closeOnEsc && e.key === 'Escape') {
      onClose();
    }
  }, [closeOnEsc, onClose]);
  
  // Add escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);
  
  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Combine class names
  const modalClasses = [
    'flex-modal',
    `flex-modal-${size}`,
    isOpen ? 'flex-modal-open' : 'flex-modal-closed',
    className
  ]
    .filter(Boolean)
    .join(' ');
  
  // Don't render anything if not mounted
  if (!isMounted && !isOpen) {
    return null;
  }
  
  return (
    <div 
      className="flex-modal-overlay" 
      onClick={handleOverlayClick}
      style={{
        ...styles?.overlay,
        zIndex: zIndex,
      }}
    >
      <div
        ref={modalRef}
        className={modalClasses}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'flex-modal-title' : undefined}
        style={styles?.content}
        {...props}
      >
        {(headerContent || title) && (
          <div className="flex-modal-header" style={styles?.header}>
            {headerContent || (
              <h2 id="flex-modal-title" className="flex-modal-title">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                className="flex-modal-close"
                aria-label="Close modal"
                onClick={onClose}
              >
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
        )}
        
        <div className="flex-modal-body" style={styles?.body}>
          {children}
        </div>
        
        {footerContent && (
          <div className="flex-modal-footer" style={styles?.footer}>
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );
}; 