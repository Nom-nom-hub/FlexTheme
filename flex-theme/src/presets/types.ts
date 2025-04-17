import { ColorToken } from '../tokens/colors';

/**
 * Theme preset type
 */
export type ThemePresetType = 'light' | 'dark' | 'custom';

/**
 * Theme preset interface
 */
export interface ThemePreset {
  /**
   * Preset ID
   */
  id: string;
  
  /**
   * Preset name
   */
  name: string;
  
  /**
   * Preset type
   */
  type: ThemePresetType;
  
  /**
   * Preset description
   */
  description?: string;
  
  /**
   * Color tokens
   */
  colors: Partial<Record<ColorToken, string>>;
  
  /**
   * Whether the preset is built-in
   */
  builtIn?: boolean;
}

/**
 * Theme preset manager configuration
 */
export interface ThemePresetManagerConfig {
  /**
   * Storage key for presets
   * @default 'flex-theme-presets'
   */
  storageKey?: string;
  
  /**
   * Default preset ID
   * @default 'light'
   */
  defaultPresetId?: string;
  
  /**
   * Whether to enable preset persistence
   * @default true
   */
  enablePersistence?: boolean;
}
