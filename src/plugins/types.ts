import { Theme, FlexThemeConfig } from '../types';
import { ThemePreset } from '../presets/types';
import { Locale } from '../i18n/types';

/**
 * Plugin lifecycle hooks
 */
export interface PluginHooks {
  /**
   * Called when the plugin is initialized
   */
  onInit?: () => void;
  
  /**
   * Called when the theme changes
   * @param theme The new theme
   * @param resolvedTheme The resolved theme (light or dark)
   */
  onThemeChange?: (theme: Theme, resolvedTheme: 'light' | 'dark') => void;
  
  /**
   * Called when the locale changes
   * @param locale The new locale
   */
  onLocaleChange?: (locale: Locale) => void;
  
  /**
   * Called when a preset is activated
   * @param preset The activated preset
   */
  onPresetActivated?: (preset: ThemePreset) => void;
  
  /**
   * Called when the configuration changes
   * @param config The new configuration
   */
  onConfigChange?: (config: FlexThemeConfig) => void;
  
  /**
   * Called when the plugin is disabled
   */
  onDisable?: () => void;
}

/**
 * Plugin definition
 */
export interface Plugin {
  /**
   * Unique identifier for the plugin
   */
  id: string;
  
  /**
   * Plugin name
   */
  name: string;
  
  /**
   * Plugin version
   */
  version: string;
  
  /**
   * Plugin description
   */
  description?: string;
  
  /**
   * Plugin author
   */
  author?: string;
  
  /**
   * Plugin hooks
   */
  hooks: PluginHooks;
  
  /**
   * Plugin dependencies
   */
  dependencies?: string[];
  
  /**
   * Plugin configuration
   */
  config?: Record<string, any>;
}

/**
 * Plugin manager configuration
 */
export interface PluginManagerConfig {
  /**
   * Whether to enable plugins
   * @default true
   */
  enablePlugins?: boolean;
  
  /**
   * Whether to automatically initialize plugins
   * @default true
   */
  autoInitialize?: boolean;
  
  /**
   * Storage key for plugin state
   * @default 'flex-theme-plugins'
   */
  storageKey?: string;
}
