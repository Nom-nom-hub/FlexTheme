import { Plugin } from './types';

/**
 * Analytics plugin that tracks theme changes
 */
export const analyticsPlugin: Plugin = {
  id: 'analytics',
  name: 'Analytics Plugin',
  version: '1.0.0',
  description: 'Tracks theme changes for analytics',
  author: 'flex-theme',
  hooks: {
    onInit: () => {
      console.log('Analytics plugin initialized');
    },
    onThemeChange: (theme, resolvedTheme) => {
      console.log(`Theme changed to ${theme} (resolved as ${resolvedTheme})`);
      
      // In a real implementation, you would send this data to an analytics service
      if (typeof window !== 'undefined') {
        const event = {
          event: 'theme_change',
          theme,
          resolvedTheme,
          timestamp: new Date().toISOString(),
        };
        
        console.log('Analytics event:', event);
      }
    },
    onDisable: () => {
      console.log('Analytics plugin disabled');
    },
  },
};

/**
 * Storage plugin that syncs theme preferences across tabs
 */
export const storagePlugin: Plugin = {
  id: 'storage-sync',
  name: 'Storage Sync Plugin',
  version: '1.0.0',
  description: 'Syncs theme preferences across tabs',
  author: 'flex-theme',
  hooks: {
    onInit: () => {
      console.log('Storage sync plugin initialized');
      
      // Listen for storage events from other tabs
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', (event) => {
          if (event.key === 'flex-theme') {
            console.log('Theme changed in another tab, reloading...');
            window.location.reload();
          }
        });
      }
    },
    onDisable: () => {
      console.log('Storage sync plugin disabled');
      
      // Remove storage event listener
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', () => {});
      }
    },
  },
};

/**
 * System theme plugin that automatically switches theme based on system preferences
 */
export const systemThemePlugin: Plugin = {
  id: 'system-theme',
  name: 'System Theme Plugin',
  version: '1.0.0',
  description: 'Automatically switches theme based on system preferences',
  author: 'flex-theme',
  hooks: {
    onInit: () => {
      console.log('System theme plugin initialized');
      
      // Listen for system theme changes
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleChange = (e: MediaQueryListEvent) => {
          const newTheme = e.matches ? 'dark' : 'light';
          console.log(`System theme changed to ${newTheme}`);
          
          // In a real implementation, you would update the theme
          // setTheme('auto');
        };
        
        mediaQuery.addEventListener('change', handleChange);
      }
    },
    onDisable: () => {
      console.log('System theme plugin disabled');
      
      // Remove media query listener
      if (typeof window !== 'undefined') {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.removeEventListener('change', () => {});
      }
    },
  },
};

/**
 * Scheduled theme plugin that changes theme based on time of day
 */
export const scheduledThemePlugin: Plugin = {
  id: 'scheduled-theme',
  name: 'Scheduled Theme Plugin',
  version: '1.0.0',
  description: 'Changes theme based on time of day',
  author: 'flex-theme',
  config: {
    lightStart: 6, // 6 AM
    darkStart: 18, // 6 PM
  },
  hooks: {
    onInit: () => {
      console.log('Scheduled theme plugin initialized');
      
      // Set up interval to check time
      if (typeof window !== 'undefined') {
        const interval = setInterval(() => {
          const hour = new Date().getHours();
          const config = scheduledThemePlugin.config || {};
          
          if (hour >= config.lightStart && hour < config.darkStart) {
            // It's daytime, set light theme
            // setTheme('light');
          } else {
            // It's nighttime, set dark theme
            // setTheme('dark');
          }
        }, 60000); // Check every minute
        
        // Store interval ID for cleanup
        (window as any).__scheduledThemeInterval = interval;
      }
    },
    onDisable: () => {
      console.log('Scheduled theme plugin disabled');
      
      // Clear interval
      if (typeof window !== 'undefined') {
        clearInterval((window as any).__scheduledThemeInterval);
      }
    },
  },
};
