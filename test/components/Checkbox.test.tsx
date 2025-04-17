import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from '../../packages/react-components/src/components/Checkbox/Checkbox';

// Mock the useFlexTheme hook
vi.mock('flex-theme/react', () => ({
  useFlexTheme: () => ({
    resolvedTheme: 'light'
  })
}));

describe('Checkbox Component', () => {
  it('renders correctly with default props', () => {
    render(<Checkbox />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass('flex-checkbox');
    expect(checkbox).toHaveClass('flex-checkbox--md');
    expect(checkbox).toHaveClass('flex-checkbox--theme-light');
    expect(checkbox).not.toBeChecked();
  });
  
  it('renders with label when provided', () => {
    render(<Checkbox label="Accept terms" />);
    
    const checkbox = screen.getByRole('checkbox');
    const label = screen.getByText('Accept terms');
    
    expect(label).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id');
    expect(label).toHaveAttribute('for', checkbox.getAttribute('id'));
  });
  
  it('applies size classes correctly', () => {
    render(<Checkbox size="lg" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('flex-checkbox--lg');
    
    const customCheckbox = checkbox.nextElementSibling;
    expect(customCheckbox).toHaveClass('flex-checkbox-custom--lg');
  });
  
  it('applies checked state correctly', () => {
    render(<Checkbox checked />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
  
  it('applies invalid state correctly', () => {
    render(<Checkbox isInvalid />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('flex-checkbox--invalid');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });
  
  it('renders helper text when provided', () => {
    render(<Checkbox helperText="This is helper text" />);
    
    const helperText = screen.getByText('This is helper text');
    expect(helperText).toBeInTheDocument();
  });
  
  it('renders error text when invalid and errorText is provided', () => {
    render(<Checkbox isInvalid errorText="This field is required" />);
    
    const errorText = screen.getByText('This field is required');
    expect(errorText).toBeInTheDocument();
    expect(errorText.parentElement).toHaveClass('flex-checkbox-text--error');
  });
  
  it('calls onChange handler when clicked', () => {
    const handleChange = vi.fn();
    
    render(<Checkbox onChange={handleChange} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onChange handler when disabled', () => {
    const handleChange = vi.fn();
    
    render(<Checkbox onChange={handleChange} disabled />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).not.toHaveBeenCalled();
  });
  
  it('applies custom className correctly', () => {
    render(<Checkbox className="custom-checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });
  
  it('passes through other props to the input element', () => {
    render(<Checkbox data-testid="test-checkbox" name="test" value="test-value" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveAttribute('name', 'test');
    expect(checkbox).toHaveAttribute('value', 'test-value');
  });
  
  it('sets aria-describedby when helper or error text is provided', () => {
    render(<Checkbox helperText="Helper text" id="test-checkbox" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-describedby', 'test-checkbox-description');
    
    const helperText = screen.getByText('Helper text');
    expect(helperText.parentElement).toHaveAttribute('id', 'test-checkbox-description');
  });
});
