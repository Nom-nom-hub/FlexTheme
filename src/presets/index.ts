/**
 * FlexTheme preset system
 * Allows for customizable theme presets with design tokens
 */

import { ThemePreset } from '../types';
import { defaultPresets, lightPreset, darkPreset } from './default-presets';

// Storage key for active preset
const PRESET_STORAGE_KEY = 'flex-theme-preset';

// Default preset name
const DEFAULT_PRESET = 'light';

// Registry of available presets
let presetRegistry: Record<string, ThemePreset> = {
  ...defaultPresets
};

// Callbacks for preset changes
const presetChangeCallbacks: Array<(presetName: string, preset: ThemePreset) => void> = [];

/**
 * Registers a new theme preset
 * @param {string} name - The name of the preset
 * @param {ThemePreset} preset - The preset configuration
 * @returns {boolean} True if registration was successful
 */
export function registerPreset(name: string, preset: ThemePreset): boolean {
  if (presetRegistry[name]) {
    console.warn(`Preset "${name}" already exists and will be overwritten`);
  }
  
  presetRegistry[name] = preset;
  return true;
}

/**
 * Gets a specific preset by name
 * @param {string} name - The name of the preset to get
 * @returns {ThemePreset|null} The preset or null if not found
 */
export function getPreset(name: string): ThemePreset | null {
  return presetRegistry[name] || null;
}

/**
 * Gets all registered presets
 * @returns {Record<string, ThemePreset>} All registered presets
 */
export function getAllPresets(): Record<string, ThemePreset> {
  return { ...presetRegistry };
}

/**
 * Gets the current active preset name
 * @returns {string} The active preset name
 */
export function getActivePresetName(): string {
  if (typeof window === 'undefined') return DEFAULT_PRESET;
  
  const storedPreset = localStorage.getItem(PRESET_STORAGE_KEY);
  
  if (storedPreset && presetRegistry[storedPreset]) {
    return storedPreset;
  }
  
  return DEFAULT_PRESET;
}

/**
 * Gets the current active preset
 * @returns {ThemePreset} The active preset
 */
export function getActivePreset(): ThemePreset {
  const presetName = getActivePresetName();
  return presetRegistry[presetName] || lightPreset;
}

/**
 * Sets the active preset
 * @param {string} name - The name of the preset to activate
 * @returns {boolean} True if the preset was set successfully
 */
export function setActivePreset(name: string): boolean {
  if (typeof window === 'undefined') return false;
  
  // Validate preset
  if (!presetRegistry[name]) {
    console.warn(`Preset "${name}" not found`);
    return false;
  }
  
  localStorage.setItem(PRESET_STORAGE_KEY, name);
  
  // Apply preset CSS variables
  applyPresetToDOM(presetRegistry[name]);
  
  // Notify subscribers
  presetChangeCallbacks.forEach(callback => callback(name, presetRegistry[name]));
  
  return true;
}

/**
 * Applies a preset's values to the DOM as CSS variables
 * @param {ThemePreset} preset - The preset to apply
 */
export function applyPresetToDOM(preset: ThemePreset): void {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply colors
  Object.entries(preset.colors).forEach(([key, value]) => {
    root.style.setProperty(`--flex-${key}`, value);
  });
  
  // Apply fonts
  if (preset.fonts) {
    Object.entries(preset.fonts).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--flex-font-${key}`, value);
    });
  }
  
  // Apply radii
  if (preset.radii) {
    Object.entries(preset.radii).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--flex-radius-${key}`, value);
    });
  }
  
  // Apply spacing
  if (preset.spacing) {
    Object.entries(preset.spacing).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--flex-space-${key}`, value);
    });
  }
  
  // Apply shadows
  if (preset.shadows) {
    Object.entries(preset.shadows).forEach(([key, value]) => {
      if (value) root.style.setProperty(`--flex-shadow-${key}`, value);
    });
  }
}

/**
 * Register a callback for preset changes
 * @param {Function} callback - The callback to register
 * @returns {Function} Function to unregister the callback
 */
export function onPresetChange(
  callback: (presetName: string, preset: ThemePreset) => void
): () => void {
  presetChangeCallbacks.push(callback);
  
  return () => {
    const index = presetChangeCallbacks.indexOf(callback);
    if (index !== -1) {
      presetChangeCallbacks.splice(index, 1);
    }
  };
}

/**
 * Initialize the preset system
 * Applies the active preset based on storage
 */
export function initializePresets(): void {
  if (typeof window === 'undefined') return;
  
  const activePreset = getActivePreset();
  applyPresetToDOM(activePreset);
}

/**
 * Import presets from a JSON object or string
 * @param {object|string} data - The preset data to import
 * @returns {string[]} Array of imported preset names
 */
export function importPresets(data: Record<string, ThemePreset> | string): string[] {
  let presetsData: Record<string, ThemePreset>;
  
  if (typeof data === 'string') {
    try {
      presetsData = JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse preset data', e);
      return [];
    }
  } else {
    presetsData = data;
  }
  
  const importedPresets: string[] = [];
  
  Object.entries(presetsData).forEach(([name, preset]) => {
    if (registerPreset(name, preset)) {
      importedPresets.push(name);
    }
  });
  
  return importedPresets;
} 