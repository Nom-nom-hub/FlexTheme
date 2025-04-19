import React, { useState, useEffect, useRef, ReactNode, HTMLAttributes } from 'react';
import './Transition.css';

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

export type TransitionType = 
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom'
  | 'none';

export interface TransitionProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the component should be shown
   */
  in: boolean;
  
  /**
   * Duration of the transition in milliseconds
   * @default 300
   */
  duration?: number;
  
  /**
   * Delay before the transition starts in milliseconds
   * @default 0
   */
  delay?: number;
  
  /**
   * Type of transition animation
   * @default 'fade'
   */
  type?: TransitionType;
  
  /**
   * Whether to unmount the component when it's not shown
   * @default true
   */
  unmountOnExit?: boolean;
  
  /**
   * Callback fired when the transition begins
   */
  onEnter?: () => void;
  
  /**
   * Callback fired when the transition has completed
   */
  onEntered?: () => void;
  
  /**
   * Callback fired when the exit transition begins
   */
  onExit?: () => void;
  
  /**
   * Callback fired when the exit transition has completed
   */
  onExited?: () => void;
  
  /**
   * Children to render
   */
  children: ReactNode;
  
  /**
   * Whether to respect the prefers-reduced-motion setting
   * @default true
   */
  respectReducedMotion?: boolean;
}

/**
 * Transition component for animating elements in and out of the DOM
 */
export const Transition: React.FC<TransitionProps> = ({
  in: inProp,
  duration = 300,
  delay = 0,
  type = 'fade',
  unmountOnExit = true,
  onEnter,
  onEntered,
  onExit,
  onExited,
  children,
  respectReducedMotion = true,
  className = '',
  style: styleProp,
  ...props
}) => {
  const [state, setState] = useState<TransitionState>(inProp ? 'entered' : 'exited');
  const nodeRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = useRef<boolean>(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && respectReducedMotion) {
      prefersReducedMotion.current = 
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    }
  }, [respectReducedMotion]);
  
  // Handle transition state changes
  useEffect(() => {
    const performTransition = () => {
      // Clear any existing timeout
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      
      if (inProp) {
        // Show the component
        if (state === 'exited') {
          // First set to entering
          setState('entering');
          onEnter?.();
          
          // After duration, set to entered
          timeoutRef.current = window.setTimeout(() => {
            setState('entered');
            onEntered?.();
          }, prefersReducedMotion.current ? 0 : duration);
        }
      } else {
        // Hide the component
        if (state === 'entering' || state === 'entered') {
          // First set to exiting
          setState('exiting');
          onExit?.();
          
          // After duration, set to exited
          timeoutRef.current = window.setTimeout(() => {
            setState('exited');
            onExited?.();
          }, prefersReducedMotion.current ? 0 : duration);
        }
      }
    };
    
    // Perform transition after the specified delay
    const delayTimeout = window.setTimeout(
      performTransition,
      delay && !prefersReducedMotion.current ? delay : 0
    );
    
    return () => {
      window.clearTimeout(delayTimeout);
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [inProp, duration, delay, prefersReducedMotion, state, onEnter, onEntered, onExit, onExited]);
  
  // Don't render if exited and unmountOnExit is true
  if (state === 'exited' && unmountOnExit) {
    return null;
  }
  
  // Prepare styles for the transition
  const transitionDuration = prefersReducedMotion.current ? 0 : duration;
  const transitionStyle: React.CSSProperties = {
    transitionDuration: `${transitionDuration}ms`,
    transitionDelay: `${delay}ms`,
    ...styleProp,
  };
  
  // Prepare class names
  const classes = [
    'flex-transition',
    `flex-transition-${type}`,
    `flex-transition-${state}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <div
      ref={nodeRef}
      className={classes}
      style={transitionStyle}
      {...props}
    >
      {children}
    </div>
  );
}; 