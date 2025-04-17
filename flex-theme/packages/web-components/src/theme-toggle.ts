import { 
  getTheme, 
  getResolvedTheme, 
  setTheme, 
  toggleTheme, 
  onThemeChange,
  type Theme 
} from 'flex-theme';

/**
 * Theme toggle web component
 */
export class FlexThemeToggle extends HTMLElement {
  // Shadow DOM
  private shadow: ShadowRoot;
  
  // Elements
  private button: HTMLButtonElement | null = null;
  private select: HTMLSelectElement | null = null;
  private iconElement: HTMLSpanElement | null = null;
  private labelElement: HTMLSpanElement | null = null;
  
  // State
  private currentTheme: Theme = getTheme();
  private currentResolvedTheme: 'light' | 'dark' = getResolvedTheme();
  private unsubscribe: (() => void) | null = null;
  
  // Observed attributes
  static get observedAttributes() {
    return [
      'variant', 
      'light-icon', 
      'dark-icon', 
      'auto-icon', 
      'show-label', 
      'cycle-themes'
    ];
  }
  
  constructor() {
    super();
    
    // Create shadow DOM
    this.shadow = this.attachShadow({ mode: 'open' });
    
    // Initial render
    this.render();
    
    // Subscribe to theme changes
    this.unsubscribe = onThemeChange((theme, resolvedTheme) => {
      this.currentTheme = theme;
      this.currentResolvedTheme = resolvedTheme;
      this.updateUI();
    });
  }
  
  // Lifecycle: connected
  connectedCallback() {
    this.updateUI();
  }
  
  // Lifecycle: disconnected
  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }
  
  // Lifecycle: attribute changed
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    
    // Re-render on attribute change
    this.render();
    this.updateUI();
  }
  
  // Get attribute helpers
  get variant(): 'icon' | 'button' | 'select' {
    const value = this.getAttribute('variant');
    return (value === 'icon' || value === 'button' || value === 'select') 
      ? value 
      : 'icon';
  }
  
  get lightIcon(): string {
    return this.getAttribute('light-icon') || '☀️';
  }
  
  get darkIcon(): string {
    return this.getAttribute('dark-icon') || '🌙';
  }
  
  get autoIcon(): string {
    return this.getAttribute('auto-icon') || '⚙️';
  }
  
  get showLabel(): boolean {
    return this.hasAttribute('show-label');
  }
  
  get cycleThemes(): boolean {
    return this.hasAttribute('cycle-themes');
  }
  
  // Render the component
  private render() {
    // Clear shadow DOM
    this.shadow.innerHTML = '';
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = this.getStyles();
    this.shadow.appendChild(style);
    
    // Create elements based on variant
    if (this.variant === 'select') {
      this.renderSelect();
    } else {
      this.renderButton();
    }
  }
  
  // Render button variant
  private renderButton() {
    // Create button
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.className = `flex-theme-toggle flex-theme-toggle--${this.variant}`;
    this.button.addEventListener('click', this.handleClick.bind(this));
    
    // Create icon
    this.iconElement = document.createElement('span');
    this.iconElement.className = 'flex-theme-toggle__icon';
    this.button.appendChild(this.iconElement);
    
    // Create label if needed
    if (this.showLabel) {
      this.labelElement = document.createElement('span');
      this.labelElement.className = 'flex-theme-toggle__label';
      this.button.appendChild(this.labelElement);
    }
    
    // Add to shadow DOM
    this.shadow.appendChild(this.button);
  }
  
  // Render select variant
  private renderSelect() {
    // Create container
    const container = document.createElement('div');
    container.className = 'flex-theme-toggle flex-theme-toggle--select';
    
    // Create select
    this.select = document.createElement('select');
    this.select.className = 'flex-theme-toggle__select';
    this.select.setAttribute('aria-label', 'Select theme');
    this.select.addEventListener('change', this.handleSelectChange.bind(this));
    
    // Create options
    const lightOption = document.createElement('option');
    lightOption.value = 'light';
    lightOption.textContent = 'Light';
    
    const darkOption = document.createElement('option');
    darkOption.value = 'dark';
    darkOption.textContent = 'Dark';
    
    const autoOption = document.createElement('option');
    autoOption.value = 'auto';
    autoOption.textContent = 'Auto (System)';
    
    // Add options to select
    this.select.appendChild(lightOption);
    this.select.appendChild(darkOption);
    this.select.appendChild(autoOption);
    
    // Add select to container
    container.appendChild(this.select);
    
    // Add to shadow DOM
    this.shadow.appendChild(container);
  }
  
  // Update UI based on current theme
  private updateUI() {
    // Set data-theme attribute
    if (this.button) {
      this.button.setAttribute('data-theme', this.currentResolvedTheme);
      
      // Update aria-label
      const ariaLabel = this.cycleThemes
        ? `Current theme: ${this.getLabel()}. Click to cycle themes.`
        : `Switch to ${this.currentResolvedTheme === 'light' ? 'dark' : 'light'} theme`;
      
      this.button.setAttribute('aria-label', ariaLabel);
      
      // Update icon
      if (this.iconElement) {
        this.iconElement.textContent = this.getIcon();
      }
      
      // Update label
      if (this.labelElement) {
        this.labelElement.textContent = this.getLabel();
      }
    }
    
    // Update select
    if (this.select) {
      this.select.value = this.currentTheme;
      this.select.parentElement?.setAttribute('data-theme', this.currentResolvedTheme);
    }
  }
  
  // Get current icon
  private getIcon(): string {
    if (this.currentTheme === 'auto') return this.autoIcon;
    return this.currentResolvedTheme === 'light' ? this.lightIcon : this.darkIcon;
  }
  
  // Get current label
  private getLabel(): string {
    if (this.currentTheme === 'auto') return 'Auto';
    return this.currentResolvedTheme === 'light' ? 'Light' : 'Dark';
  }
  
  // Handle button click
  private handleClick() {
    if (this.cycleThemes) {
      // Cycle through light -> dark -> auto
      const nextTheme: Theme = 
        this.currentTheme === 'light' ? 'dark' : 
        this.currentTheme === 'dark' ? 'auto' : 'light';
      
      setTheme(nextTheme);
    } else {
      // Toggle between light and dark
      toggleTheme();
    }
  }
  
  // Handle select change
  private handleSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    setTheme(select.value as Theme);
  }
  
  // Get component styles
  private getStyles(): string {
    return `
      /* Base styles */
      :host {
        display: inline-block;
      }
      
      /* ThemeToggle styles */
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
        color: inherit;
      }
      
      .flex-theme-toggle--icon:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .flex-theme-toggle--icon[data-theme="dark"]:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      .flex-theme-toggle--button {
        background-color: var(--color-surface, #f8f9fa);
        border: 1px solid var(--color-border, #e0e0e0);
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
        color: inherit;
      }
      
      .flex-theme-toggle--button:hover {
        background-color: var(--color-surfaceVariant, #f0f0f0);
      }
      
      .flex-theme-toggle--button[data-theme="dark"] {
        background-color: var(--color-surface, #1e1e1e);
        border-color: var(--color-border, #333333);
      }
      
      .flex-theme-toggle--button[data-theme="dark"]:hover {
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
        color: inherit;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 0.5rem center;
        background-size: 1em;
      }
      
      .flex-theme-toggle--select[data-theme="dark"] .flex-theme-toggle__select {
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
    `;
  }
}
