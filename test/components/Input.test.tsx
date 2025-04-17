import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../../packages/react-components/src/components/Input/Input';

// Mock the useFlexTheme hook
vi.mock('flex-theme/react', () => ({
  useFlexTheme: () => ({
    resolvedTheme: 'light'
  })
}));

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex-input');
    expect(input).toHaveClass('flex-input--md');
    expect(input).toHaveClass('flex-input--theme-light');
  });
  
  it('renders with label when provided', () => {
    render(<Input label="Username" />);
    
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    
    const input = screen.getByRole('textbox');
    expect(label).toHaveAttribute('for', input.getAttribute('id'));
  });
  
  it('applies size classes correctly', () => {
    render(<Input size="lg" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('flex-input--lg');
    
    const wrapper = input.closest('.flex-input-field-wrapper');
    expect(wrapper).toHaveClass('flex-input-field-wrapper--lg');
  });
  
  it('applies variant classes correctly', () => {
    render(<Input variant="filled" />);
    
    const wrapper = screen.getByRole('textbox').closest('.flex-input-field-wrapper');
    expect(wrapper).toHaveClass('flex-input-field-wrapper--filled');
  });
  
  it('applies fullWidth class when specified', () => {
    render(<Input fullWidth />);
    
    const wrapper = screen.getByRole('textbox').closest('.flex-input-wrapper');
    expect(wrapper).toHaveClass('flex-input-wrapper--full-width');
  });
  
  it('applies disabled state correctly', () => {
    render(<Input disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
  
  it('applies invalid state correctly', () => {
    render(<Input isInvalid />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    
    const wrapper = input.closest('.flex-input-field-wrapper');
    expect(wrapper).toHaveClass('flex-input-field-wrapper--invalid');
  });
  
  it('renders helper text when provided', () => {
    render(<Input helperText="Enter your username" />);
    
    const helperText = screen.getByText('Enter your username');
    expect(helperText).toBeInTheDocument();
  });
  
  it('renders error text when invalid and errorText is provided', () => {
    render(<Input isInvalid errorText="Username is required" />);
    
    const errorText = screen.getByText('Username is required');
    expect(errorText).toBeInTheDocument();
    expect(errorText.parentElement).toHaveClass('flex-input-text--error');
  });
  
  it('renders left element when provided', () => {
    render(
      <Input 
        leftElement={<span data-testid="left-icon">@</span>}
      />
    );
    
    const leftIcon = screen.getByTestId('left-icon');
    expect(leftIcon).toBeInTheDocument();
    
    const wrapper = screen.getByRole('textbox').closest('.flex-input-field-wrapper');
    expect(wrapper).toHaveClass('flex-input-field-wrapper--with-left-element');
  });
  
  it('renders right element when provided', () => {
    render(
      <Input 
        rightElement={<span data-testid="right-icon">✓</span>}
      />
    );
    
    const rightIcon = screen.getByTestId('right-icon');
    expect(rightIcon).toBeInTheDocument();
    
    const wrapper = screen.getByRole('textbox').closest('.flex-input-field-wrapper');
    expect(wrapper).toHaveClass('flex-input-field-wrapper--with-right-element');
  });
  
  it('calls onChange handler when input changes', () => {
    const handleChange = vi.fn();
    
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
  
  it('applies custom className correctly', () => {
    render(<Input className="custom-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input');
  });
  
  it('passes through other props to the input element', () => {
    render(
      <Input 
        data-testid="test-input" 
        name="username" 
        placeholder="Enter username"
        maxLength={10}
      />
    );
    
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('name', 'username');
    expect(input).toHaveAttribute('placeholder', 'Enter username');
    expect(input).toHaveAttribute('maxLength', '10');
  });
  
  it('sets aria-describedby when helper or error text is provided', () => {
    render(<Input helperText="Helper text" id="test-input" />);
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'test-input-description');
    
    const helperText = screen.getByText('Helper text');
    expect(helperText).toHaveAttribute('id', 'test-input-description');
  });
});
