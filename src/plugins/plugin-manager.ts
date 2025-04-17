import { Plugin, PluginManagerConfig } from './types';
import { getTheme, getResolvedTheme, onThemeChange } from '../core';
import { getLocale } from '../i18n';
import { getActivePreset, onPresetChange } from '../presets';
import { FlexThemeConfig } from '../types';

// Default configuration
const defaultConfig: Required<PluginManagerConfig> = {
  enablePlugins: true,
  autoInitialize: true,
  storageKey: 'flex-theme-plugins',
};

// Current configuration
let config = { ...defaultConfig };

// Store for registered plugins
const plugins: Map<string, Plugin> = new Map();

// Store for enabled plugins
const enabledPlugins: Set<string> = new Set();

// Store for initialized plugins
const initializedPlugins: Set<string> = new Set();

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Configure the plugin manager
 * @param userConfig Configuration options
 */
export function configurePluginManager(userConfig: PluginManagerConfig = {}): void {
  config = {
    ...defaultConfig,
    ...userConfig,
  };
  
  // Load enabled plugins from localStorage
  if (isBrowser && config.enablePlugins) {
    try {
      const storedPlugins = localStorage.getItem(config.storageKey);
      
      if (storedPlugins) {
        const parsedPlugins = JSON.parse(storedPlugins) as string[];
        
        // Clear and add all stored plugins
        enabledPlugins.clear();
        parsedPlugins.forEach(pluginId => {
          enabledPlugins.add(pluginId);
        });
      }
    } catch (e) {
      console.warn('Failed to load plugins from localStorage:', e);
    }
  }
  
  // Initialize enabled plugins if auto-initialize is enabled
  if (config.autoInitialize) {
    initializeEnabledPlugins();
  }
}

/**
 * Register a plugin
 * @param plugin Plugin to register
 * @returns True if the plugin was registered successfully
 */
export function registerPlugin(plugin: Plugin): boolean {
  // Check if plugin is valid
  if (!plugin.id || !plugin.name || !plugin.version) {
    console.error('Invalid plugin:', plugin);
    return false;
  }
  
  // Check if plugin is already registered
  if (plugins.has(plugin.id)) {
    console.warn(`Plugin "${plugin.id}" is already registered`);
    return false;
  }
  
  // Check dependencies
  if (plugin.dependencies && plugin.dependencies.length > 0) {
    for (const dependency of plugin.dependencies) {
      if (!plugins.has(dependency)) {
        console.error(`Plugin "${plugin.id}" depends on "${dependency}", which is not registered`);
        return false;
      }
    }
  }
  
  // Register the plugin
  plugins.set(plugin.id, plugin);
  
  // Enable the plugin if it was previously enabled
  if (enabledPlugins.has(plugin.id)) {
    initializePlugin(plugin.id);
  }
  
  return true;
}

/**
 * Unregister a plugin
 * @param pluginId Plugin ID to unregister
 * @returns True if the plugin was unregistered successfully
 */
export function unregisterPlugin(pluginId: string): boolean {
  // Check if plugin is registered
  if (!plugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not registered`);
    return false;
  }
  
  // Check if other plugins depend on this plugin
  for (const [id, plugin] of plugins.entries()) {
    if (plugin.dependencies && plugin.dependencies.includes(pluginId)) {
      console.error(`Cannot unregister plugin "${pluginId}" because "${id}" depends on it`);
      return false;
    }
  }
  
  // Disable the plugin if it's enabled
  if (enabledPlugins.has(pluginId)) {
    disablePlugin(pluginId);
  }
  
  // Unregister the plugin
  plugins.delete(pluginId);
  
  return true;
}

/**
 * Enable a plugin
 * @param pluginId Plugin ID to enable
 * @returns True if the plugin was enabled successfully
 */
export function enablePlugin(pluginId: string): boolean {
  // Check if plugins are enabled
  if (!config.enablePlugins) {
    console.warn('Plugins are disabled');
    return false;
  }
  
  // Check if plugin is registered
  if (!plugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not registered`);
    return false;
  }
  
  // Check if plugin is already enabled
  if (enabledPlugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is already enabled`);
    return true;
  }
  
  // Enable the plugin
  enabledPlugins.add(pluginId);
  
  // Initialize the plugin
  initializePlugin(pluginId);
  
  // Store enabled plugins in localStorage
  if (isBrowser) {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify([...enabledPlugins]));
    } catch (e) {
      console.warn('Failed to store plugins in localStorage:', e);
    }
  }
  
  return true;
}

/**
 * Disable a plugin
 * @param pluginId Plugin ID to disable
 * @returns True if the plugin was disabled successfully
 */
export function disablePlugin(pluginId: string): boolean {
  // Check if plugin is registered
  if (!plugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not registered`);
    return false;
  }
  
  // Check if plugin is enabled
  if (!enabledPlugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not enabled`);
    return true;
  }
  
  // Check if other plugins depend on this plugin
  for (const [id, plugin] of plugins.entries()) {
    if (enabledPlugins.has(id) && plugin.dependencies && plugin.dependencies.includes(pluginId)) {
      console.error(`Cannot disable plugin "${pluginId}" because enabled plugin "${id}" depends on it`);
      return false;
    }
  }
  
  // Get the plugin
  const plugin = plugins.get(pluginId)!;
  
  // Call the onDisable hook
  if (plugin.hooks.onDisable) {
    try {
      plugin.hooks.onDisable();
    } catch (e) {
      console.error(`Error in onDisable hook of plugin "${pluginId}":`, e);
    }
  }
  
  // Disable the plugin
  enabledPlugins.delete(pluginId);
  initializedPlugins.delete(pluginId);
  
  // Store enabled plugins in localStorage
  if (isBrowser) {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify([...enabledPlugins]));
    } catch (e) {
      console.warn('Failed to store plugins in localStorage:', e);
    }
  }
  
  return true;
}

/**
 * Initialize a plugin
 * @param pluginId Plugin ID to initialize
 * @returns True if the plugin was initialized successfully
 */
export function initializePlugin(pluginId: string): boolean {
  // Check if plugin is registered
  if (!plugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not registered`);
    return false;
  }
  
  // Check if plugin is already initialized
  if (initializedPlugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is already initialized`);
    return true;
  }
  
  // Get the plugin
  const plugin = plugins.get(pluginId)!;
  
  // Initialize dependencies first
  if (plugin.dependencies && plugin.dependencies.length > 0) {
    for (const dependency of plugin.dependencies) {
      if (!initializedPlugins.has(dependency)) {
        initializePlugin(dependency);
      }
    }
  }
  
  // Call the onInit hook
  if (plugin.hooks.onInit) {
    try {
      plugin.hooks.onInit();
    } catch (e) {
      console.error(`Error in onInit hook of plugin "${pluginId}":`, e);
      return false;
    }
  }
  
  // Register theme change listener
  if (plugin.hooks.onThemeChange) {
    const theme = getTheme();
    const resolvedTheme = getResolvedTheme();
    
    // Call with current theme
    try {
      plugin.hooks.onThemeChange(theme, resolvedTheme);
    } catch (e) {
      console.error(`Error in onThemeChange hook of plugin "${pluginId}":`, e);
    }
    
    // Register listener
    onThemeChange((newTheme, newResolvedTheme) => {
      if (enabledPlugins.has(pluginId) && plugin.hooks.onThemeChange) {
        try {
          plugin.hooks.onThemeChange(newTheme, newResolvedTheme);
        } catch (e) {
          console.error(`Error in onThemeChange hook of plugin "${pluginId}":`, e);
        }
      }
    });
  }
  
  // Register locale change listener
  if (plugin.hooks.onLocaleChange) {
    const locale = getLocale();
    
    // Call with current locale
    try {
      plugin.hooks.onLocaleChange(locale);
    } catch (e) {
      console.error(`Error in onLocaleChange hook of plugin "${pluginId}":`, e);
    }
  }
  
  // Register preset change listener
  if (plugin.hooks.onPresetActivated) {
    const preset = getActivePreset();
    
    // Call with current preset
    try {
      plugin.hooks.onPresetActivated(preset);
    } catch (e) {
      console.error(`Error in onPresetActivated hook of plugin "${pluginId}":`, e);
    }
    
    // Register listener
    onPresetChange((newPreset) => {
      if (enabledPlugins.has(pluginId) && plugin.hooks.onPresetActivated) {
        try {
          plugin.hooks.onPresetActivated(newPreset);
        } catch (e) {
          console.error(`Error in onPresetActivated hook of plugin "${pluginId}":`, e);
        }
      }
    });
  }
  
  // Mark the plugin as initialized
  initializedPlugins.add(pluginId);
  
  return true;
}

/**
 * Initialize all enabled plugins
 */
export function initializeEnabledPlugins(): void {
  for (const pluginId of enabledPlugins) {
    if (plugins.has(pluginId) && !initializedPlugins.has(pluginId)) {
      initializePlugin(pluginId);
    }
  }
}

/**
 * Get all registered plugins
 * @returns Map of registered plugins
 */
export function getPlugins(): Map<string, Plugin> {
  return new Map(plugins);
}

/**
 * Get all enabled plugins
 * @returns Array of enabled plugin IDs
 */
export function getEnabledPlugins(): string[] {
  return [...enabledPlugins];
}

/**
 * Get a plugin by ID
 * @param pluginId Plugin ID
 * @returns The plugin, or undefined if not found
 */
export function getPlugin(pluginId: string): Plugin | undefined {
  return plugins.get(pluginId);
}

/**
 * Check if a plugin is enabled
 * @param pluginId Plugin ID
 * @returns True if the plugin is enabled
 */
export function isPluginEnabled(pluginId: string): boolean {
  return enabledPlugins.has(pluginId);
}

/**
 * Check if a plugin is initialized
 * @param pluginId Plugin ID
 * @returns True if the plugin is initialized
 */
export function isPluginInitialized(pluginId: string): boolean {
  return initializedPlugins.has(pluginId);
}

/**
 * Set plugin configuration
 * @param pluginId Plugin ID
 * @param config Plugin configuration
 * @returns True if the configuration was set successfully
 */
export function setPluginConfig(pluginId: string, config: Record<string, any>): boolean {
  // Check if plugin is registered
  if (!plugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not registered`);
    return false;
  }
  
  // Get the plugin
  const plugin = plugins.get(pluginId)!;
  
  // Set the configuration
  plugin.config = { ...config };
  
  return true;
}

/**
 * Get plugin configuration
 * @param pluginId Plugin ID
 * @returns Plugin configuration, or undefined if not found
 */
export function getPluginConfig(pluginId: string): Record<string, any> | undefined {
  // Check if plugin is registered
  if (!plugins.has(pluginId)) {
    console.warn(`Plugin "${pluginId}" is not registered`);
    return undefined;
  }
  
  // Get the plugin
  const plugin = plugins.get(pluginId)!;
  
  return plugin.config;
}

/**
 * Notify plugins of a configuration change
 * @param config New configuration
 */
export function notifyConfigChange(config: FlexThemeConfig): void {
  for (const pluginId of enabledPlugins) {
    const plugin = plugins.get(pluginId);
    
    if (plugin && plugin.hooks.onConfigChange) {
      try {
        plugin.hooks.onConfigChange(config);
      } catch (e) {
        console.error(`Error in onConfigChange hook of plugin "${pluginId}":`, e);
      }
    }
  }
}

// Initialize the plugin manager
configurePluginManager();
