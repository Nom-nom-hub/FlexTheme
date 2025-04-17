import { ThemePreset } from './types';
import { lightColors, darkColors } from '../tokens/colors';

/**
 * Default light theme preset
 */
export const lightPreset: ThemePreset = {
  id: 'light',
  name: 'Light',
  type: 'light',
  description: 'Default light theme',
  colors: lightColors,
  builtIn: true,
};

/**
 * Default dark theme preset
 */
export const darkPreset: ThemePreset = {
  id: 'dark',
  name: 'Dark',
  type: 'dark',
  description: 'Default dark theme',
  colors: darkColors,
  builtIn: true,
};

/**
 * High contrast light theme preset
 */
export const highContrastLightPreset: ThemePreset = {
  id: 'high-contrast-light',
  name: 'High Contrast Light',
  type: 'light',
  description: 'High contrast light theme for better accessibility',
  colors: {
    ...lightColors,
    primary: '#0000EE',
    primaryDark: '#00008B',
    primaryLight: '#6666FF',
    textPrimary: '#000000',
    textSecondary: '#333333',
    background: '#FFFFFF',
    surface: '#F8F8F8',
    border: '#000000',
  },
  builtIn: true,
};

/**
 * High contrast dark theme preset
 */
export const highContrastDarkPreset: ThemePreset = {
  id: 'high-contrast-dark',
  name: 'High Contrast Dark',
  type: 'dark',
  description: 'High contrast dark theme for better accessibility',
  colors: {
    ...darkColors,
    primary: '#FFFF00',
    primaryDark: '#CCCC00',
    primaryLight: '#FFFF66',
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
    background: '#000000',
    surface: '#121212',
    border: '#FFFFFF',
  },
  builtIn: true,
};

/**
 * Sepia theme preset
 */
export const sepiaPreset: ThemePreset = {
  id: 'sepia',
  name: 'Sepia',
  type: 'light',
  description: 'Sepia theme for reduced eye strain',
  colors: {
    ...lightColors,
    primary: '#704214',
    primaryDark: '#5A350F',
    primaryLight: '#9C7A50',
    textPrimary: '#5F4B32',
    textSecondary: '#7F6542',
    background: '#F5EFE0',
    surface: '#F0E6D2',
    border: '#D3C4A8',
  },
  builtIn: true,
};

/**
 * Blue light filter theme preset
 */
export const blueLightFilterPreset: ThemePreset = {
  id: 'blue-light-filter',
  name: 'Blue Light Filter',
  type: 'light',
  description: 'Reduced blue light for evening use',
  colors: {
    ...lightColors,
    primary: '#D48E3C',
    primaryDark: '#B06E1C',
    primaryLight: '#F4AD5C',
    textPrimary: '#4D3B27',
    textSecondary: '#6D5B47',
    background: '#FFF2E2',
    surface: '#FFF8ED',
    border: '#E8D5B9',
  },
  builtIn: true,
};

/**
 * All default presets
 */
export const defaultPresets: ThemePreset[] = [
  lightPreset,
  darkPreset,
  highContrastLightPreset,
  highContrastDarkPreset,
  sepiaPreset,
  blueLightFilterPreset,
];
