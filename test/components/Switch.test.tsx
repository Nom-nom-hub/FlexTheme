import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../../packages/react-components/src/components/Switch/Switch';

// Mock the useFlexTheme hook
vi.mock('flex-theme/react', () => ({
  useFlexTheme: () => ({
    resolvedTheme: 'light'
  })
}));

describe('Switch Component', () => {
  it('renders correctly with default props', () => {
    render(<Switch />);
    
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeInTheDocument();
    expect(switchInput).toHaveClass('flex-switch');
    expect(switchInput).toHaveClass('flex-switch--md');
    expect(switchInput).toHaveClass('flex-switch--theme-light');
    expect(switchInput).not.toBeChecked();
  });
  
  it('renders with label when provided', () => {
    render(<Switch label="Enable notifications" />);
    
    const switchInput = screen.getByRole('checkbox');
    const label = screen.getByText('Enable notifications');
    
    expect(label).toBeInTheDocument();
    expect(switchInput).toHaveAttribute('id');
    expect(label).toHaveAttribute('for', switchInput.getAttribute('id'));
  });
  
  it('applies size classes correctly', () => {
    render(<Switch size="lg" />);
    
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toHaveClass('flex-switch--lg');
    
    const track = switchInput.closest('.flex-switch-track');
    expect(track).toHaveClass('flex-switch-track--lg');
    
    const thumb = track?.querySelector('.flex-switch-thumb');
    expect(thumb).toHaveClass('flex-switch-thumb--lg');
  });
  
  it('applies checked state correctly', () => {
    render(<Switch checked />);
    
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeChecked();
  });
  
  it('applies invalid state correctly', () => {
    render(<Switch isInvalid />);
    
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toHaveAttribute('aria-invalid', 'true');
    
    const track = switchInput.closest('.flex-switch-track');
    expect(track).toHaveClass('flex-switch-track--invalid');
  });
  
  it('renders helper text when provided', () => {
    render(<Switch helperText="Receive notifications" />);
    
    const helperText = screen.getByText('Receive notifications');
    expect(helperText).toBeInTheDocument();
  });
  
  it('renders error text when invalid and errorText is provided', () => {
    render(<Switch isInvalid errorText="This field is required" />);
    
    const errorText = screen.getByText('This field is required');
    expect(errorText).toBeInTheDocument();
    expect(errorText.parentElement).toHaveClass('flex-switch-text--error');
  });
  
  it('positions label correctly based on labelPosition', () => {
    const { rerender } = render(<Switch label="Label" labelPosition="right" />);
    
    let container = screen.getByRole('checkbox').closest('.flex-switch-container');
    expect(container).toHaveClass('flex-switch-container--label-right');
    
    rerender(<Switch label="Label" labelPosition="left" />);
    
    container = screen.getByRole('checkbox').closest('.flex-switch-container');
    expect(container).toHaveClass('flex-switch-container--label-left');
  });
  
  it('calls onChange handler when clicked', () => {
    const handleChange = vi.fn();
    
    render(<Switch onChange={handleChange} />);
    
    const switchInput = screen.getByRole('checkbox');
    fireEvent.click(switchInput);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onChange handler when disabled', () => {
    const handleChange = vi.fn();
    
    render(<Switch onChange={handleChange} disabled />);
    
    const switchInput = screen.getByRole('checkbox');
    fireEvent.click(switchInput);
    
    expect(handleChange).not.toHaveBeenCalled();
  });
  
  it('applies custom className correctly', () => {
    render(<Switch className="custom-switch" />);
    
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toHaveClass('custom-switch');
  });
  
  it('passes through other props to the input element', () => {
    render(<Switch data-testid="test-switch" name="notifications" value="enabled" />);
    
    const switchInput = screen.getByTestId('test-switch');
    expect(switchInput).toHaveAttribute('name', 'notifications');
    expect(switchInput).toHaveAttribute('value', 'enabled');
  });
  
  it('sets aria-describedby when helper or error text is provided', () => {
    render(<Switch helperText="Helper text" id="test-switch" />);
    
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toHaveAttribute('aria-describedby', 'test-switch-description');
    
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveAttribute('id', 'test-switch-description');
  });
});
