import { ThemePreset, ThemePresetManagerConfig } from './types';
import { defaultPresets, lightPreset, darkPreset } from './default-presets';

// Default configuration
const defaultConfig: Required<ThemePresetManagerConfig> = {
  storageKey: 'flex-theme-presets',
  defaultPresetId: 'light',
  enablePersistence: true,
};

// Current configuration
let config = { ...defaultConfig };

// Store for presets
let presets: ThemePreset[] = [...defaultPresets];

// Store for the active preset ID
let activePresetId: string = config.defaultPresetId;

// Store for preset change listeners
type PresetChangeListener = (preset: ThemePreset) => void;
const listeners: Set<PresetChangeListener> = new Set();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Configure the preset manager
 * @param userConfig Configuration options
 */
export function configurePresetManager(userConfig: ThemePresetManagerConfig = {}): void {
  config = {
    ...defaultConfig,
    ...userConfig,
  };
  
  // Initialize the active preset
  if (isBrowser && config.enablePersistence) {
    try {
      const storedPresetId = localStorage.getItem(config.storageKey);
      if (storedPresetId && getPresetById(storedPresetId)) {
        activePresetId = storedPresetId;
      } else {
        activePresetId = config.defaultPresetId;
      }
    } catch (e) {
      console.warn('Failed to read preset from localStorage:', e);
      activePresetId = config.defaultPresetId;
    }
  } else {
    activePresetId = config.defaultPresetId;
  }
  
  // Load custom presets from localStorage
  if (isBrowser && config.enablePersistence) {
    try {
      const customPresetsKey = `${config.storageKey}-custom`;
      const storedCustomPresets = localStorage.getItem(customPresetsKey);
      
      if (storedCustomPresets) {
        const customPresets = JSON.parse(storedCustomPresets) as ThemePreset[];
        
        // Filter out any invalid presets
        const validCustomPresets = customPresets.filter(preset => 
          preset && 
          typeof preset.id === 'string' && 
          typeof preset.name === 'string' && 
          typeof preset.type === 'string' && 
          preset.colors && 
          typeof preset.colors === 'object'
        );
        
        // Add custom presets to the store
        presets = [
          ...defaultPresets,
          ...validCustomPresets,
        ];
      }
    } catch (e) {
      console.warn('Failed to load custom presets from localStorage:', e);
    }
  }
}

/**
 * Get all presets
 * @returns Array of all presets
 */
export function getAllPresets(): ThemePreset[] {
  return [...presets];
}

/**
 * Get built-in presets
 * @returns Array of built-in presets
 */
export function getBuiltInPresets(): ThemePreset[] {
  return presets.filter(preset => preset.builtIn);
}

/**
 * Get custom presets
 * @returns Array of custom presets
 */
export function getCustomPresets(): ThemePreset[] {
  return presets.filter(preset => !preset.builtIn);
}

/**
 * Get a preset by ID
 * @param id Preset ID
 * @returns The preset, or undefined if not found
 */
export function getPresetById(id: string): ThemePreset | undefined {
  return presets.find(preset => preset.id === id);
}

/**
 * Get the active preset
 * @returns The active preset
 */
export function getActivePreset(): ThemePreset {
  const preset = getPresetById(activePresetId);
  return preset || (activePresetId === 'dark' ? darkPreset : lightPreset);
}

/**
 * Set the active preset
 * @param presetId Preset ID
 */
export function setActivePreset(presetId: string): void {
  const preset = getPresetById(presetId);
  
  if (!preset) {
    console.warn(`Preset with ID "${presetId}" not found`);
    return;
  }
  
  activePresetId = presetId;
  
  // Store in localStorage
  if (isBrowser && config.enablePersistence) {
    try {
      localStorage.setItem(config.storageKey, presetId);
    } catch (e) {
      console.warn('Failed to store preset in localStorage:', e);
    }
  }
  
  // Apply the preset
  applyPreset(preset);
  
  // Notify listeners
  listeners.forEach(listener => {
    listener(preset);
  });
}

/**
 * Add a custom preset
 * @param preset The preset to add
 * @returns The added preset
 */
export function addCustomPreset(preset: Omit<ThemePreset, 'builtIn'>): ThemePreset {
  // Create a new preset with builtIn set to false
  const newPreset: ThemePreset = {
    ...preset,
    builtIn: false,
  };
  
  // Check if a preset with the same ID already exists
  const existingIndex = presets.findIndex(p => p.id === newPreset.id);
  
  if (existingIndex >= 0) {
    // Replace the existing preset
    presets[existingIndex] = newPreset;
  } else {
    // Add the new preset
    presets.push(newPreset);
  }
  
  // Store custom presets in localStorage
  if (isBrowser && config.enablePersistence) {
    try {
      const customPresets = getCustomPresets();
      const customPresetsKey = `${config.storageKey}-custom`;
      localStorage.setItem(customPresetsKey, JSON.stringify(customPresets));
    } catch (e) {
      console.warn('Failed to store custom presets in localStorage:', e);
    }
  }
  
  return newPreset;
}

/**
 * Remove a custom preset
 * @param presetId Preset ID
 * @returns True if the preset was removed, false otherwise
 */
export function removeCustomPreset(presetId: string): boolean {
  const preset = getPresetById(presetId);
  
  if (!preset) {
    console.warn(`Preset with ID "${presetId}" not found`);
    return false;
  }
  
  if (preset.builtIn) {
    console.warn(`Cannot remove built-in preset "${presetId}"`);
    return false;
  }
  
  // Remove the preset
  presets = presets.filter(p => p.id !== presetId);
  
  // If the active preset was removed, set the default preset
  if (activePresetId === presetId) {
    setActivePreset(config.defaultPresetId);
  }
  
  // Store custom presets in localStorage
  if (isBrowser && config.enablePersistence) {
    try {
      const customPresets = getCustomPresets();
      const customPresetsKey = `${config.storageKey}-custom`;
      localStorage.setItem(customPresetsKey, JSON.stringify(customPresets));
    } catch (e) {
      console.warn('Failed to store custom presets in localStorage:', e);
    }
  }
  
  return true;
}

/**
 * Apply a preset to the document
 * @param preset The preset to apply
 */
function applyPreset(preset: ThemePreset): void {
  if (!isBrowser) return;
  
  // Apply colors as CSS variables
  Object.entries(preset.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
  
  // Set the theme type attribute
  document.documentElement.setAttribute('data-theme-preset', preset.id);
  document.documentElement.setAttribute('data-theme', preset.type);
}

/**
 * Register a preset change listener
 * @param listener The listener function
 * @returns A function to unregister the listener
 */
export function onPresetChange(listener: PresetChangeListener): () => void {
  listeners.add(listener);
  
  // Return a function to unregister the listener
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Export presets to JSON
 * @param presetIds Array of preset IDs to export, or undefined to export all custom presets
 * @returns JSON string of the exported presets
 */
export function exportPresets(presetIds?: string[]): string {
  const presetsToExport = presetIds
    ? presets.filter(preset => presetIds.includes(preset.id))
    : getCustomPresets();
  
  return JSON.stringify(presetsToExport);
}

/**
 * Import presets from JSON
 * @param json JSON string of presets to import
 * @returns Array of imported presets
 */
export function importPresets(json: string): ThemePreset[] {
  try {
    const importedPresets = JSON.parse(json) as ThemePreset[];
    
    // Validate and add each preset
    const validPresets = importedPresets.filter(preset => 
      preset && 
      typeof preset.id === 'string' && 
      typeof preset.name === 'string' && 
      typeof preset.type === 'string' && 
      preset.colors && 
      typeof preset.colors === 'object'
    );
    
    // Add each preset
    const addedPresets = validPresets.map(preset => addCustomPreset(preset));
    
    return addedPresets;
  } catch (e) {
    console.error('Failed to import presets:', e);
    return [];
  }
}

// Initialize the preset manager
configurePresetManager();
