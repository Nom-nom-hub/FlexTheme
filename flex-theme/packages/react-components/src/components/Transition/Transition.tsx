import React, { useState, useEffect, useRef } from 'react';
import { prefersReducedMotion } from 'flex-theme/animations';

export type TransitionType = 
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom'
  | 'none';

export interface TransitionProps {
  /**
   * Whether the component is visible
   */
  in: boolean;
  
  /**
   * The type of transition
   * @default 'fade'
   */
  type?: TransitionType;
  
  /**
   * The duration of the transition in milliseconds
   * @default 300
   */
  duration?: number;
  
  /**
   * The delay before the transition starts in milliseconds
   * @default 0
   */
  delay?: number;
  
  /**
   * Whether to unmount the component when it's not visible
   * @default true
   */
  unmount?: boolean;
  
  /**
   * The content to transition
   */
  children: React.ReactNode;
  
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Transition component for animating elements
 */
export const Transition: React.FC<TransitionProps> = ({
  in: inProp,
  type = 'fade',
  duration = 300,
  delay = 0,
  unmount = true,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(inProp);
  const [shouldRender, setShouldRender] = useState(inProp);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = prefersReducedMotion();
  
  // Handle visibility changes
  useEffect(() => {
    if (inProp) {
      // Show immediately
      setShouldRender(true);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set visible after a small delay to trigger the transition
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      // Hide with transition
      setIsVisible(false);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Unmount after the transition completes
      if (unmount) {
        timeoutRef.current = setTimeout(() => {
          setShouldRender(false);
        }, duration + delay);
      }
    }
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inProp, duration, delay, unmount]);
  
  // If reduced motion is preferred, skip transitions
  if (reducedMotion) {
    return inProp || !unmount ? <>{children}</> : null;
  }
  
  // Don't render if not visible and unmount is true
  if (!shouldRender) {
    return null;
  }
  
  // Get transition styles
  const getTransitionStyles = () => {
    const baseStyles: React.CSSProperties = {
      transition: `all ${duration}ms ease ${delay}ms`,
    };
    
    const visibleStyles: React.CSSProperties = {
      opacity: 1,
      transform: 'none',
    };
    
    const hiddenStyles: React.CSSProperties = {
      opacity: 0,
    };
    
    // Add transform based on transition type
    switch (type) {
      case 'slide-up':
        hiddenStyles.transform = 'translateY(20px)';
        break;
      case 'slide-down':
        hiddenStyles.transform = 'translateY(-20px)';
        break;
      case 'slide-left':
        hiddenStyles.transform = 'translateX(20px)';
        break;
      case 'slide-right':
        hiddenStyles.transform = 'translateX(-20px)';
        break;
      case 'zoom':
        hiddenStyles.transform = 'scale(0.95)';
        break;
      case 'none':
        return {}; // No transition
    }
    
    return {
      ...baseStyles,
      ...(isVisible ? visibleStyles : hiddenStyles),
    };
  };
  
  return (
    <div 
      className={`flex-transition flex-transition--${type} ${className}`}
      style={getTransitionStyles()}
    >
      {children}
    </div>
  );
};
