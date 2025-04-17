<script lang="ts">
  import { theme, resolvedTheme, setTheme, toggleTheme, t } from './stores';
  
  // Props
  export let lightIcon = '☀️';
  export let darkIcon = '🌙';
  export let autoIcon = '⚙️';
  export let showLabel = false;
  export let cycleThemes = false;
  export let variant: 'icon' | 'button' | 'select' = 'icon';
  
  // Computed values
  $: icon = $theme === 'auto' ? autoIcon : $resolvedTheme === 'light' ? lightIcon : darkIcon;
  $: label = $theme === 'auto' ? 'Auto' : $resolvedTheme === 'light' ? 'Light' : 'Dark';
  $: ariaLabel = cycleThemes 
    ? `Current theme: ${label}. Click to cycle themes.`
    : `Switch to ${$resolvedTheme === 'light' ? 'dark' : 'light'} theme`;
  
  // Handle click
  function handleClick() {
    if (cycleThemes) {
      // Cycle through light -> dark -> auto
      if ($theme === 'light') {
        setTheme('dark');
      } else if ($theme === 'dark') {
        setTheme('auto');
      } else {
        setTheme('light');
      }
    } else {
      toggleTheme();
    }
  }
</script>

{#if variant === 'select'}
  <div class="flex-theme-toggle flex-theme-toggle--select" data-theme={$resolvedTheme}>
    <select
      value={$theme}
      on:change={(e) => setTheme(e.target.value)}
      class="flex-theme-toggle__select"
      aria-label="Select theme"
    >
      <option value="light">{t('themes.light')}</option>
      <option value="dark">{t('themes.dark')}</option>
      <option value="auto">{t('themes.auto')}</option>
    </select>
  </div>
{:else}
  <button
    type="button"
    on:click={handleClick}
    class="flex-theme-toggle flex-theme-toggle--{variant}"
    aria-label={ariaLabel}
    data-theme={$resolvedTheme}
  >
    <span class="flex-theme-toggle__icon">{icon}</span>
    {#if showLabel}
      <span class="flex-theme-toggle__label">{label}</span>
    {/if}
  </button>
{/if}

<style>
  .flex-theme-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .flex-theme-toggle--icon {
    background: transparent;
    border: none;
    padding: 0.5rem;
    border-radius: 9999px;
    cursor: pointer;
    color: var(--color-textPrimary, inherit);
  }
  
  .flex-theme-toggle--icon:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global([data-theme="dark"]) .flex-theme-toggle--icon:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .flex-theme-toggle--button {
    background-color: var(--color-surface, #f8f9fa);
    border: 1px solid var(--color-border, #e0e0e0);
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--color-textPrimary, inherit);
  }
  
  .flex-theme-toggle--button:hover {
    background-color: var(--color-surfaceVariant, #f0f0f0);
  }
  
  :global([data-theme="dark"]) .flex-theme-toggle--button {
    background-color: var(--color-surface, #1e1e1e);
    border-color: var(--color-border, #333333);
  }
  
  :global([data-theme="dark"]) .flex-theme-toggle--button:hover {
    background-color: var(--color-surfaceVariant, #2a2a2a);
  }
  
  .flex-theme-toggle--select {
    position: relative;
  }
  
  .flex-theme-toggle__select {
    appearance: none;
    background-color: var(--color-surface, #f8f9fa);
    border: 1px solid var(--color-border, #e0e0e0);
    padding: 0.5rem 2rem 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    color: var(--color-textPrimary, inherit);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1em;
  }
  
  :global([data-theme="dark"]) .flex-theme-toggle__select {
    background-color: var(--color-surface, #1e1e1e);
    border-color: var(--color-border, #333333);
  }
  
  .flex-theme-toggle__label {
    margin-left: 0.5rem;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .flex-theme-toggle {
      transition: none;
    }
  }
</style>
