import { createSignal, createEffect, onCleanup, JSX } from 'solid-js';
import { 
  getTheme, 
  getResolvedTheme, 
  setTheme as setFlexTheme, 
  toggleTheme as toggleFlexTheme, 
  onThemeChange,
  getLocale,
  configureLocale,
  getMessage,
  type Theme,
  type Locale,
  type FlexThemeConfig
} from 'flex-theme';

/**
 * Hook for using flex-theme in Solid.js
 * @param options Configuration options
 * @returns Theme state and methods
 */
export function useFlexTheme(options?: {
  locale?: Locale;
}) {
  const [theme, setThemeState] = createSignal<Theme>(getTheme());
  const [resolvedTheme, setResolvedTheme] = createSignal<'light' | 'dark'>(getResolvedTheme());
  const [locale, setLocaleState] = createSignal<Locale>(options?.locale || getLocale());
  
  // Subscribe to theme changes
  createEffect(() => {
    const unsubscribe = onThemeChange((newTheme, newResolvedTheme) => {
      setThemeState(newTheme);
      setResolvedTheme(newResolvedTheme);
    });
    
    onCleanup(() => {
      unsubscribe();
    });
  });
  
  // Apply locale when it changes
  createEffect(() => {
    configureLocale(locale());
  });
  
  // Set theme function
  const setTheme = (newTheme: Theme) => {
    setFlexTheme(newTheme);
  };
  
  // Set locale function
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };
  
  // Translation function
  const t = (path: string, params?: Record<string, string>) => {
    return getMessage(locale(), path, params);
  };
  
  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme: toggleFlexTheme,
    locale,
    setLocale,
    t,
  };
}

/**
 * Configure flex-theme
 * @param config Configuration options
 */
export function configureTheme(config: FlexThemeConfig) {
  import('flex-theme').then(({ configure }) => {
    configure(config);
  });
}

/**
 * ThemeToggle component props
 */
export interface ThemeToggleProps {
  /**
   * Icon to display for light theme
   * @default '☀️'
   */
  lightIcon?: JSX.Element;
  
  /**
   * Icon to display for dark theme
   * @default '🌙'
   */
  darkIcon?: JSX.Element;
  
  /**
   * Icon to display for auto theme
   * @default '⚙️'
   */
  autoIcon?: JSX.Element;
  
  /**
   * Whether to show the theme label
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Whether to cycle through themes (light -> dark -> auto)
   * @default false
   */
  cycleThemes?: boolean;
  
  /**
   * Button variant
   * @default 'icon'
   */
  variant?: 'icon' | 'button' | 'select';
  
  /**
   * CSS class name
   */
  class?: string;
}

/**
 * ThemeToggle component
 */
export function ThemeToggle(props: ThemeToggleProps) {
  const {
    lightIcon = '☀️',
    darkIcon = '🌙',
    autoIcon = '⚙️',
    showLabel = false,
    cycleThemes = false,
    variant = 'icon',
    class: className = '',
  } = props;
  
  const { theme, resolvedTheme, setTheme, toggleTheme, t } = useFlexTheme();
  
  // Get the current icon based on theme
  const getIcon = () => {
    if (theme() === 'auto') return autoIcon;
    return resolvedTheme() === 'light' ? lightIcon : darkIcon;
  };
  
  // Get the current label based on theme
  const getLabel = () => {
    if (theme() === 'auto') return 'Auto';
    return resolvedTheme() === 'light' ? 'Light' : 'Dark';
  };
  
  // Handle theme change
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };
  
  // Handle button click
  const handleClick = () => {
    if (cycleThemes) {
      // Cycle through light -> dark -> auto
      const currentTheme = theme();
      const nextTheme: Theme = 
        currentTheme === 'light' ? 'dark' : 
        currentTheme === 'dark' ? 'auto' : 'light';
      
      handleThemeChange(nextTheme);
    } else {
      // Toggle between light and dark
      toggleTheme();
    }
  };
  
  // Handle select change
  const handleSelectChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    handleThemeChange(target.value as Theme);
  };
  
  // Render based on variant
  if (variant === 'select') {
    return (
      <div 
        class={`flex-theme-toggle flex-theme-toggle--select ${className}`}
        data-theme={resolvedTheme()}
      >
        <select
          value={theme()}
          onChange={handleSelectChange}
          class="flex-theme-toggle__select"
          aria-label="Select theme"
        >
          <option value="light">{t('themes.light')}</option>
          <option value="dark">{t('themes.dark')}</option>
          <option value="auto">{t('themes.auto')}</option>
        </select>
      </div>
    );
  }
  
  // For icon and button variants
  return (
    <button
      type="button"
      onClick={handleClick}
      class={`flex-theme-toggle flex-theme-toggle--${variant} ${className}`}
      aria-label={`Switch to ${resolvedTheme() === 'light' ? 'dark' : 'light'} theme`}
      data-theme={resolvedTheme()}
    >
      <span class="flex-theme-toggle__icon">{getIcon()}</span>
      {showLabel && <span class="flex-theme-toggle__label">{getLabel()}</span>}
    </button>
  );
}

// Re-export types from flex-theme
export type { Theme, FlexThemeConfig, Locale } from 'flex-theme';
