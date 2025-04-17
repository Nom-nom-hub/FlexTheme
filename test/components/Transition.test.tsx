import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Transition } from '../../packages/react-components/src/components/Transition/Transition';

// Mock the prefersReducedMotion function
vi.mock('flex-theme/animations', () => ({
  prefersReducedMotion: vi.fn().mockReturnValue(false)
}));

describe('Transition Component', () => {
  // Mock timers
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });
  
  it('renders children when in is true', () => {
    render(
      <Transition in={true}>
        <div>Content</div>
      </Transition>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('does not render children when in is false and unmount is true', () => {
    render(
      <Transition in={false} unmount={true}>
        <div>Content</div>
      </Transition>
    );
    
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
  
  it('renders children when in is false but unmount is false', () => {
    render(
      <Transition in={false} unmount={false}>
        <div>Content</div>
      </Transition>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  
  it('applies transition styles based on type', () => {
    render(
      <Transition in={true} type="fade">
        <div>Content</div>
      </Transition>
    );
    
    // Advance timers to trigger the transition
    act(() => {
      vi.advanceTimersByTime(10);
    });
    
    const transitionElement = screen.getByText('Content').parentElement;
    expect(transitionElement).toHaveClass('flex-transition');
    expect(transitionElement).toHaveClass('flex-transition--fade');
    
    // Check computed styles
    expect(transitionElement).toHaveStyle({
      opacity: 1,
      transform: 'none'
    });
  });
  
  it('applies different styles for different transition types', () => {
    const { rerender } = render(
      <Transition in={false} type="slide-up">
        <div>Content</div>
      </Transition>
    );
    
    let transitionElement = screen.getByText('Content').parentElement;
    expect(transitionElement).toHaveClass('flex-transition--slide-up');
    expect(transitionElement).toHaveStyle({
      opacity: 0,
      transform: 'translateY(20px)'
    });
    
    rerender(
      <Transition in={false} type="zoom">
        <div>Content</div>
      </Transition>
    );
    
    transitionElement = screen.getByText('Content').parentElement;
    expect(transitionElement).toHaveClass('flex-transition--zoom');
    expect(transitionElement).toHaveStyle({
      opacity: 0,
      transform: 'scale(0.95)'
    });
  });
  
  it('applies custom duration and delay', () => {
    render(
      <Transition in={true} duration={500} delay={200}>
        <div>Content</div>
      </Transition>
    );
    
    // Advance timers to trigger the transition
    act(() => {
      vi.advanceTimersByTime(10);
    });
    
    const transitionElement = screen.getByText('Content').parentElement;
    expect(transitionElement).toHaveStyle({
      transition: 'all 500ms ease 200ms'
    });
  });
  
  it('unmounts children after transition completes when in changes to false', () => {
    const { rerender } = render(
      <Transition in={true} duration={300}>
        <div>Content</div>
      </Transition>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    
    rerender(
      <Transition in={false} duration={300}>
        <div>Content</div>
      </Transition>
    );
    
    // Content should still be visible during transition
    expect(screen.getByText('Content')).toBeInTheDocument();
    
    // Advance timers to complete the transition
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Content should be unmounted after transition
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });
  
  it('skips transitions when reduced motion is preferred', () => {
    // Mock prefersReducedMotion to return true
    const prefersReducedMotion = require('flex-theme/animations').prefersReducedMotion;
    prefersReducedMotion.mockReturnValue(true);
    
    render(
      <Transition in={true}>
        <div>Content</div>
      </Transition>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
    
    // No transition wrapper should be applied
    expect(screen.getByText('Content').parentElement?.classList.contains('flex-transition')).toBe(false);
  });
  
  it('applies custom className correctly', () => {
    render(
      <Transition in={true} className="custom-transition">
        <div>Content</div>
      </Transition>
    );
    
    const transitionElement = screen.getByText('Content').parentElement;
    expect(transitionElement).toHaveClass('custom-transition');
  });
});
