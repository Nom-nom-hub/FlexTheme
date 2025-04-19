/**
 * Default theme presets for FlexTheme
 * These presets provide ready-to-use color schemes and design tokens
 */

import { ThemePreset } from '../types';

// Light theme preset
export const lightPreset: ThemePreset = {
  name: 'Light',
  colors: {
    // Base colors
    background: '#ffffff',
    foreground: '#1a1a1a',
    
    // UI colors
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#f43f5e',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Component colors
    'card-bg': '#ffffff',
    'card-border': '#e5e7eb',
    'input-bg': '#ffffff',
    'input-border': '#d1d5db',
    'button-bg': '#3b82f6',
    'button-text': '#ffffff',
    'nav-bg': '#ffffff',
    'nav-text': '#4b5563',
    'nav-active': '#3b82f6',
    
    // Text colors
    'text-primary': '#1a1a1a',
    'text-secondary': '#4b5563',
    'text-tertiary': '#9ca3af',
    'text-disabled': '#d1d5db',
    'text-link': '#3b82f6',
    'text-code': '#ef4444',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    heading: 'inherit',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  spacing: {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '6': '1.5rem',
    '8': '2rem',
    '12': '3rem',
    '16': '4rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
};

// Dark theme preset
export const darkPreset: ThemePreset = {
  name: 'Dark',
  colors: {
    // Base colors
    background: '#111827',
    foreground: '#f9fafb',
    
    // UI colors
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#f43f5e',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Component colors
    'card-bg': '#1f2937',
    'card-border': '#374151',
    'input-bg': '#1f2937',
    'input-border': '#4b5563',
    'button-bg': '#3b82f6',
    'button-text': '#ffffff',
    'nav-bg': '#111827',
    'nav-text': '#d1d5db',
    'nav-active': '#3b82f6',
    
    // Text colors
    'text-primary': '#f9fafb',
    'text-secondary': '#e5e7eb',
    'text-tertiary': '#9ca3af',
    'text-disabled': '#6b7280',
    'text-link': '#60a5fa',
    'text-code': '#f87171',
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    heading: 'inherit',
    mono: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  radii: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  spacing: {
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '6': '1.5rem',
    '8': '2rem',
    '12': '3rem',
    '16': '4rem',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.26)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.25)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.24)',
  },
};

// All default presets
export const defaultPresets: Record<string, ThemePreset> = {
  light: lightPreset,
  dark: darkPreset,
}; 