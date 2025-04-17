import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../packages/react-components/src/components/Button/Button';

// Mock the useFlexTheme hook
vi.mock('flex-theme/react', () => ({
  useFlexTheme: () => ({
    resolvedTheme: 'light'
  })
}));

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('flex-button');
    expect(button).toHaveClass('flex-button--primary');
    expect(button).toHaveClass('flex-button--md');
    expect(button).toHaveClass('flex-button--theme-light');
  });
  
  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Secondary</Button>);
    
    const button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveClass('flex-button--secondary');
  });
  
  it('applies size classes correctly', () => {
    render(<Button size="lg">Large</Button>);
    
    const button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveClass('flex-button--lg');
  });
  
  it('applies fullWidth class when specified', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveClass('flex-button--full-width');
  });
  
  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('flex-button--disabled');
  });
  
  it('applies loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('flex-button--loading');
    
    // Check for spinner
    const spinner = button.querySelector('.flex-button__spinner');
    expect(spinner).toBeInTheDocument();
  });
  
  it('renders start icon when provided', () => {
    render(
      <Button startIcon={<span data-testid="start-icon">→</span>}>
        With Start Icon
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /with start icon/i });
    const startIcon = screen.getByTestId('start-icon');
    
    expect(startIcon).toBeInTheDocument();
    expect(button).toContainElement(startIcon);
  });
  
  it('renders end icon when provided', () => {
    render(
      <Button endIcon={<span data-testid="end-icon">→</span>}>
        With End Icon
      </Button>
    );
    
    const button = screen.getByRole('button', { name: /with end icon/i });
    const endIcon = screen.getByTestId('end-icon');
    
    expect(endIcon).toBeInTheDocument();
    expect(button).toContainElement(endIcon);
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick handler when disabled', () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('does not call onClick handler when loading', () => {
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick} loading>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('applies custom className correctly', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    
    const button = screen.getByRole('button', { name: /custom class/i });
    expect(button).toHaveClass('custom-class');
  });
  
  it('passes through other props to the button element', () => {
    render(<Button data-testid="test-button" aria-label="Test Button">Button</Button>);
    
    const button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('aria-label', 'Test Button');
  });
});
