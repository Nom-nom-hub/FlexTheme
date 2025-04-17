import { ref, computed, onMounted, onUnmounted, watch, Ref } from 'vue';
import { 
  getTheme, 
  getResolvedTheme, 
  setTheme, 
  toggleTheme, 
  onThemeChange, 
  configure 
} from 'flex-theme';
import type { Theme, FlexThemeConfig } from 'flex-theme';

/**
 * Vue composable for using flex-theme
 * @returns Theme state and methods
 */
export function useFlexTheme() {
  const theme = ref<Theme>(getTheme());
  const resolvedTheme = ref<'light' | 'dark'>(getResolvedTheme());
  
  let unsubscribe: (() => void) | null = null;
  
  onMounted(() => {
    unsubscribe = onThemeChange((newTheme, newResolvedTheme) => {
      theme.value = newTheme;
      resolvedTheme.value = newResolvedTheme;
    });
  });
  
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });
  
  const setThemeWrapper = (newTheme: Theme) => {
    setTheme(newTheme);
  };
  
  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWrapper,
    toggleTheme,
  };
}

/**
 * Vue component for theme toggle button
 */
export const ThemeToggle = {
  name: 'FlexThemeToggle',
  
  props: {
    lightIcon: {
      type: String,
      default: '☀️'
    },
    darkIcon: {
      type: String,
      default: '🌙'
    },
    autoIcon: {
      type: String,
      default: '⚙️'
    },
    showLabel: {
      type: Boolean,
      default: false
    },
    cycleThemes: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props: any) {
    const { theme, resolvedTheme, setTheme } = useFlexTheme();
    
    const icon = computed(() => {
      if (theme.value === 'auto') return props.autoIcon;
      return resolvedTheme.value === 'light' ? props.lightIcon : props.darkIcon;
    });
    
    const label = computed(() => {
      if (theme.value === 'auto') return 'Auto';
      return resolvedTheme.value === 'light' ? 'Light' : 'Dark';
    });
    
    const ariaLabel = computed(() => {
      if (props.cycleThemes) {
        return `Current theme: ${label.value}. Click to cycle themes.`;
      }
      return `Switch to ${resolvedTheme.value === 'light' ? 'dark' : 'light'} theme`;
    });
    
    const handleClick = () => {
      if (props.cycleThemes) {
        // Cycle through light -> dark -> auto
        if (theme.value === 'light') {
          setTheme('dark');
        } else if (theme.value === 'dark') {
          setTheme('auto');
        } else {
          setTheme('light');
        }
      } else {
        toggleTheme();
      }
    };
    
    return {
      theme,
      resolvedTheme,
      icon,
      label,
      ariaLabel,
      handleClick
    };
  },
  
  template: `
    <button 
      @click="handleClick" 
      :aria-label="ariaLabel"
      class="flex-theme-toggle"
      :data-theme="resolvedTheme"
    >
      <span class="flex-theme-toggle-icon">{{ icon }}</span>
      <span v-if="showLabel" class="flex-theme-toggle-label">{{ label }}</span>
    </button>
  `
};

/**
 * Vue plugin for flex-theme
 */
export const FlexThemePlugin = {
  install(app: any, options?: FlexThemeConfig) {
    // Configure theme if options provided
    if (options) {
      configure(options);
    }
    
    // Register components
    app.component('FlexThemeToggle', ThemeToggle);
    
    // Provide theme to the app
    const themeState = useFlexTheme();
    app.provide('flex-theme', themeState);
    
    // Add global properties
    app.config.globalProperties.$flexTheme = {
      getTheme,
      getResolvedTheme,
      setTheme,
      toggleTheme
    };
  }
};

export type { Theme, FlexThemeConfig };
