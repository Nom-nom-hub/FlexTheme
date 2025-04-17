import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FlexThemeService } from './flex-theme.service';
import type { Theme } from 'flex-theme';

/**
 * Angular component for theme toggle button
 */
@Component({
  selector: 'flex-theme-toggle',
  template: `
    <button
      (click)="handleClick()"
      [attr.aria-label]="ariaLabel"
      class="flex-theme-toggle"
      [attr.data-theme]="resolvedTheme"
    >
      <span class="flex-theme-toggle-icon">{{ icon }}</span>
      <span *ngIf="showLabel" class="flex-theme-toggle-label">{{ label }}</span>
    </button>
  `,
  styles: [`
    .flex-theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }
    
    .flex-theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    [data-theme="dark"] .flex-theme-toggle:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .flex-theme-toggle-label {
      margin-left: 0.5rem;
    }
  `]
})
export class FlexThemeToggleComponent implements OnInit, OnDestroy {
  @Input() lightIcon = '☀️';
  @Input() darkIcon = '🌙';
  @Input() autoIcon = '⚙️';
  @Input() showLabel = false;
  @Input() cycleThemes = false;
  
  theme: Theme = 'light';
  resolvedTheme: 'light' | 'dark' = 'light';
  icon = '';
  label = '';
  ariaLabel = '';
  
  private subscriptions: Subscription[] = [];
  
  constructor(private themeService: FlexThemeService) {}
  
  ngOnInit(): void {
    this.subscriptions.push(
      this.themeService.theme$.subscribe(theme => {
        this.theme = theme;
        this.updateDisplay();
      }),
      
      this.themeService.resolvedTheme$.subscribe(resolvedTheme => {
        this.resolvedTheme = resolvedTheme;
        this.updateDisplay();
      })
    );
    
    this.updateDisplay();
  }
  
  handleClick(): void {
    if (this.cycleThemes) {
      // Cycle through light -> dark -> auto
      if (this.theme === 'light') {
        this.themeService.setTheme('dark');
      } else if (this.theme === 'dark') {
        this.themeService.setTheme('auto');
      } else {
        this.themeService.setTheme('light');
      }
    } else {
      this.themeService.toggleTheme();
    }
  }
  
  private updateDisplay(): void {
    // Update icon
    if (this.theme === 'auto') {
      this.icon = this.autoIcon;
    } else {
      this.icon = this.resolvedTheme === 'light' ? this.lightIcon : this.darkIcon;
    }
    
    // Update label
    if (this.theme === 'auto') {
      this.label = 'Auto';
    } else {
      this.label = this.resolvedTheme === 'light' ? 'Light' : 'Dark';
    }
    
    // Update aria label
    if (this.cycleThemes) {
      this.ariaLabel = `Current theme: ${this.label}. Click to cycle themes.`;
    } else {
      this.ariaLabel = `Switch to ${this.resolvedTheme === 'light' ? 'dark' : 'light'} theme`;
    }
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
