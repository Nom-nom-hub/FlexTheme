import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from '../../packages/react-components/src/components/Modal/Modal';

// Mock the useFlexTheme hook
vi.mock('flex-theme/react', () => ({
  useFlexTheme: () => ({
    resolvedTheme: 'light'
  })
}));

// Mock createPortal
vi.mock('react-dom', () => {
  const originalModule = vi.importActual('react-dom');
  return {
    ...originalModule,
    createPortal: vi.fn((children) => children)
  };
});

describe('Modal Component', () => {
  // Mock document.body.style
  const originalBodyStyle = document.body.style;
  
  beforeEach(() => {
    // Reset body style
    document.body.style.overflow = '';
    
    // Mock focus methods
    Element.prototype.focus = vi.fn();
  });
  
  afterEach(() => {
    // Restore body style
    document.body.style = originalBodyStyle;
    
    vi.resetAllMocks();
  });
  
  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });
  
  it('renders modal content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });
  
  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal Title">
        Modal Content
      </Modal>
    );
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });
  
  it('renders footer when provided', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={() => {}} 
        footer={<button>Close</button>}
      >
        Modal Content
      </Modal>
    );
    
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
  
  it('applies size classes correctly', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Modal Content
      </Modal>
    );
    
    const modal = screen.getByRole('dialog');
    expect(modal.querySelector('.flex-modal')).toHaveClass('flex-modal--lg');
  });
  
  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} showCloseButton={true}>
        Modal Content
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    fireEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('calls onClose when overlay is clicked and closeOnOverlayClick is true', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={true}>
        Modal Content
      </Modal>
    );
    
    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay!);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClose when overlay is clicked and closeOnOverlayClick is false', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
        Modal Content
      </Modal>
    );
    
    const overlay = screen.getByRole('dialog').parentElement;
    fireEvent.click(overlay!);
    
    expect(handleClose).not.toHaveBeenCalled();
  });
  
  it('calls onClose when Escape key is pressed and closeOnEsc is true', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEsc={true}>
        Modal Content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClose when Escape key is pressed and closeOnEsc is false', () => {
    const handleClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEsc={false}>
        Modal Content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).not.toHaveBeenCalled();
  });
  
  it('prevents body scroll when modal is open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
  });
  
  it('restores body scroll when modal is closed', async () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(
      <Modal isOpen={false} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('');
    });
  });
  
  it('focuses the modal when opened', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );
    
    const modal = screen.getByRole('dialog');
    expect(modal.querySelector('.flex-modal')?.focus).toHaveBeenCalled();
  });
  
  it('applies custom className correctly', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} className="custom-modal">
        Modal Content
      </Modal>
    );
    
    const modal = screen.getByRole('dialog').querySelector('.flex-modal');
    expect(modal).toHaveClass('custom-modal');
  });
});
