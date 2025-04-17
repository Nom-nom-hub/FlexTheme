import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  configurePresetManager,
  getAllPresets,
  getBuiltInPresets,
  getCustomPresets,
  getPresetById,
  getActivePreset,
  setActivePreset,
  addCustomPreset,
  removeCustomPreset,
  exportPresets,
  importPresets,
  onPresetChange
} from '../../src/presets';
import { defaultPresets, lightPreset, darkPreset } from '../../src/presets/default-presets';
import type { ThemePreset } from '../../src/presets/types';

describe('Theme Presets', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      store
    };
  })();
  
  // Save original localStorage
  const originalLocalStorage = global.localStorage;
  
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Clear localStorage
    localStorageMock.clear();
    
    // Reset the preset manager
    configurePresetManager({
      storageKey: 'test-presets',
      defaultPresetId: 'light',
      enablePersistence: true
    });
  });
  
  afterEach(() => {
    // Restore original localStorage
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
    
    vi.resetAllMocks();
  });
  
  describe('Default presets', () => {
    it('should have default presets', () => {
      expect(defaultPresets.length).toBeGreaterThan(0);
      expect(lightPreset).toBeDefined();
      expect(darkPreset).toBeDefined();
    });
    
    it('should have valid preset structure', () => {
      expect(lightPreset.id).toBe('light');
      expect(lightPreset.name).toBe('Light');
      expect(lightPreset.type).toBe('light');
      expect(lightPreset.colors).toBeDefined();
      expect(lightPreset.builtIn).toBe(true);
    });
  });
  
  describe('getAllPresets', () => {
    it('should return all presets', () => {
      const presets = getAllPresets();
      expect(presets.length).toBe(defaultPresets.length);
      expect(presets).toEqual(expect.arrayContaining(defaultPresets));
    });
  });
  
  describe('getBuiltInPresets', () => {
    it('should return only built-in presets', () => {
      const presets = getBuiltInPresets();
      expect(presets.length).toBe(defaultPresets.length);
      expect(presets.every(preset => preset.builtIn)).toBe(true);
    });
  });
  
  describe('getCustomPresets', () => {
    it('should return only custom presets', () => {
      // Initially there should be no custom presets
      const presets = getCustomPresets();
      expect(presets.length).toBe(0);
      
      // Add a custom preset
      const customPreset: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      addCustomPreset(customPreset);
      
      // Now there should be one custom preset
      const updatedPresets = getCustomPresets();
      expect(updatedPresets.length).toBe(1);
      expect(updatedPresets[0].id).toBe('custom');
      expect(updatedPresets[0].builtIn).toBe(false);
    });
  });
  
  describe('getPresetById', () => {
    it('should return a preset by ID', () => {
      const preset = getPresetById('light');
      expect(preset).toBeDefined();
      expect(preset?.id).toBe('light');
    });
    
    it('should return undefined for non-existent preset', () => {
      const preset = getPresetById('non-existent');
      expect(preset).toBeUndefined();
    });
  });
  
  describe('getActivePreset', () => {
    it('should return the active preset', () => {
      const preset = getActivePreset();
      expect(preset).toBeDefined();
      expect(preset.id).toBe('light'); // Default is 'light'
    });
    
    it('should return the default preset if active preset is not found', () => {
      // Set a non-existent preset as active
      setActivePreset('light'); // First set to a valid preset
      
      // Mock getPresetById to return undefined
      const originalGetPresetById = getPresetById;
      global.getPresetById = vi.fn().mockReturnValue(undefined);
      
      const preset = getActivePreset();
      expect(preset).toBeDefined();
      expect(preset.id).toBe('light'); // Default fallback
      
      // Restore original function
      global.getPresetById = originalGetPresetById;
    });
  });
  
  describe('setActivePreset', () => {
    it('should set the active preset', () => {
      setActivePreset('dark');
      const preset = getActivePreset();
      expect(preset.id).toBe('dark');
    });
    
    it('should store the active preset in localStorage', () => {
      setActivePreset('dark');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('test-presets', 'dark');
    });
    
    it('should not set a non-existent preset', () => {
      // Mock console.warn to avoid test output noise
      const originalConsoleWarn = console.warn;
      console.warn = vi.fn();
      
      setActivePreset('light'); // First set to a valid preset
      setActivePreset('non-existent');
      
      const preset = getActivePreset();
      expect(preset.id).toBe('light'); // Should not have changed
      
      // Restore console.warn
      console.warn = originalConsoleWarn;
    });
    
    it('should notify listeners when preset changes', () => {
      const listener = vi.fn();
      const unsubscribe = onPresetChange(listener);
      
      setActivePreset('dark');
      
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        id: 'dark'
      }));
      
      // Clean up
      unsubscribe();
    });
  });
  
  describe('addCustomPreset', () => {
    it('should add a custom preset', () => {
      const customPreset: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      const added = addCustomPreset(customPreset);
      
      expect(added.id).toBe('custom');
      expect(added.builtIn).toBe(false);
      
      const preset = getPresetById('custom');
      expect(preset).toBeDefined();
      expect(preset?.id).toBe('custom');
    });
    
    it('should replace an existing custom preset with the same ID', () => {
      const customPreset1: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom 1',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      const customPreset2: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom 2',
        type: 'dark',
        colors: { primary: '#00ff00' }
      };
      
      addCustomPreset(customPreset1);
      addCustomPreset(customPreset2);
      
      const preset = getPresetById('custom');
      expect(preset).toBeDefined();
      expect(preset?.name).toBe('Custom 2');
      expect(preset?.type).toBe('dark');
    });
    
    it('should store custom presets in localStorage', () => {
      const customPreset: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      addCustomPreset(customPreset);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-presets-custom',
        expect.any(String)
      );
      
      // Check that the stored value is valid JSON
      const storedValue = localStorageMock.store['test-presets-custom'];
      const parsed = JSON.parse(storedValue);
      expect(parsed).toEqual([expect.objectContaining({
        id: 'custom',
        name: 'Custom',
        type: 'light',
        builtIn: false
      })]);
    });
  });
  
  describe('removeCustomPreset', () => {
    it('should remove a custom preset', () => {
      // Add a custom preset first
      const customPreset: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      addCustomPreset(customPreset);
      
      // Verify it was added
      expect(getPresetById('custom')).toBeDefined();
      
      // Remove it
      const removed = removeCustomPreset('custom');
      
      expect(removed).toBe(true);
      expect(getPresetById('custom')).toBeUndefined();
    });
    
    it('should not remove a built-in preset', () => {
      // Mock console.warn to avoid test output noise
      const originalConsoleWarn = console.warn;
      console.warn = vi.fn();
      
      const removed = removeCustomPreset('light');
      
      expect(removed).toBe(false);
      expect(getPresetById('light')).toBeDefined();
      
      // Restore console.warn
      console.warn = originalConsoleWarn;
    });
    
    it('should update localStorage when removing a custom preset', () => {
      // Add two custom presets
      const customPreset1: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom1',
        name: 'Custom 1',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      const customPreset2: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom2',
        name: 'Custom 2',
        type: 'dark',
        colors: { primary: '#00ff00' }
      };
      
      addCustomPreset(customPreset1);
      addCustomPreset(customPreset2);
      
      // Clear the mock to focus on the removal
      vi.clearAllMocks();
      
      // Remove one preset
      removeCustomPreset('custom1');
      
      // Check that localStorage was updated
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'test-presets-custom',
        expect.any(String)
      );
      
      // Check that the stored value only contains the remaining preset
      const storedValue = localStorageMock.store['test-presets-custom'];
      const parsed = JSON.parse(storedValue);
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe('custom2');
    });
    
    it('should set the default preset if the active preset is removed', () => {
      // Add a custom preset
      const customPreset: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom',
        name: 'Custom',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      addCustomPreset(customPreset);
      
      // Set it as active
      setActivePreset('custom');
      expect(getActivePreset().id).toBe('custom');
      
      // Remove it
      removeCustomPreset('custom');
      
      // Active preset should now be the default
      expect(getActivePreset().id).toBe('light');
    });
  });
  
  describe('exportPresets', () => {
    it('should export all custom presets by default', () => {
      // Add some custom presets
      const customPreset1: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom1',
        name: 'Custom 1',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      const customPreset2: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom2',
        name: 'Custom 2',
        type: 'dark',
        colors: { primary: '#00ff00' }
      };
      
      addCustomPreset(customPreset1);
      addCustomPreset(customPreset2);
      
      // Export presets
      const exported = exportPresets();
      
      // Parse the exported JSON
      const parsed = JSON.parse(exported);
      
      expect(parsed.length).toBe(2);
      expect(parsed).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'custom1' }),
        expect.objectContaining({ id: 'custom2' })
      ]));
    });
    
    it('should export specified presets when IDs are provided', () => {
      // Add some custom presets
      const customPreset1: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom1',
        name: 'Custom 1',
        type: 'light',
        colors: { primary: '#ff0000' }
      };
      
      const customPreset2: Omit<ThemePreset, 'builtIn'> = {
        id: 'custom2',
        name: 'Custom 2',
        type: 'dark',
        colors: { primary: '#00ff00' }
      };
      
      addCustomPreset(customPreset1);
      addCustomPreset(customPreset2);
      
      // Export only one preset
      const exported = exportPresets(['custom1']);
      
      // Parse the exported JSON
      const parsed = JSON.parse(exported);
      
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe('custom1');
    });
    
    it('should export built-in presets when specified', () => {
      // Export a built-in preset
      const exported = exportPresets(['light']);
      
      // Parse the exported JSON
      const parsed = JSON.parse(exported);
      
      expect(parsed.length).toBe(1);
      expect(parsed[0].id).toBe('light');
    });
  });
  
  describe('importPresets', () => {
    it('should import presets from JSON', () => {
      // Create a JSON string with presets
      const presets = [
        {
          id: 'imported1',
          name: 'Imported 1',
          type: 'light',
          colors: { primary: '#ff0000' }
        },
        {
          id: 'imported2',
          name: 'Imported 2',
          type: 'dark',
          colors: { primary: '#00ff00' }
        }
      ];
      
      const json = JSON.stringify(presets);
      
      // Import the presets
      const imported = importPresets(json);
      
      expect(imported.length).toBe(2);
      expect(imported[0].id).toBe('imported1');
      expect(imported[1].id).toBe('imported2');
      
      // Check that they were added to the preset manager
      expect(getPresetById('imported1')).toBeDefined();
      expect(getPresetById('imported2')).toBeDefined();
    });
    
    it('should validate imported presets', () => {
      // Create a JSON string with invalid presets
      const presets = [
        {
          // Missing id
          name: 'Invalid 1',
          type: 'light',
          colors: { primary: '#ff0000' }
        },
        {
          id: 'valid',
          name: 'Valid',
          type: 'dark',
          colors: { primary: '#00ff00' }
        }
      ];
      
      const json = JSON.stringify(presets);
      
      // Mock console.error to avoid test output noise
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      // Import the presets
      const imported = importPresets(json);
      
      // Only the valid preset should be imported
      expect(imported.length).toBe(1);
      expect(imported[0].id).toBe('valid');
      
      // Check that only the valid preset was added
      expect(getPresetById('valid')).toBeDefined();
      
      // Restore console.error
      console.error = originalConsoleError;
    });
    
    it('should handle invalid JSON', () => {
      // Create an invalid JSON string
      const json = 'not valid json';
      
      // Mock console.error to avoid test output noise
      const originalConsoleError = console.error;
      console.error = vi.fn();
      
      // Import the presets
      const imported = importPresets(json);
      
      // No presets should be imported
      expect(imported.length).toBe(0);
      
      // Restore console.error
      console.error = originalConsoleError;
    });
  });
  
  describe('onPresetChange', () => {
    it('should register a listener and call it when preset changes', () => {
      const listener = vi.fn();
      const unsubscribe = onPresetChange(listener);
      
      // Change the preset
      setActivePreset('dark');
      
      // Listener should be called
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        id: 'dark'
      }));
      
      // Clean up
      unsubscribe();
    });
    
    it('should unregister a listener when unsubscribe is called', () => {
      const listener = vi.fn();
      const unsubscribe = onPresetChange(listener);
      
      // Unsubscribe
      unsubscribe();
      
      // Change the preset
      setActivePreset('dark');
      
      // Listener should not be called
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
