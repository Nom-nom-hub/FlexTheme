import { Injectable, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  getTheme, 
  getResolvedTheme, 
  setTheme as setFlexTheme, 
  toggleTheme as toggleFlexTheme, 
  onThemeChange, 
  configure 
} from 'flex-theme';
import type { Theme, FlexThemeConfig } from 'flex-theme';

/**
 * Angular service for flex-theme
 */
@Injectable({
  providedIn: 'root'
})
export class FlexThemeService implements OnDestroy {
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  private resolvedThemeSubject = new BehaviorSubject<'light' | 'dark'>(this.getInitialResolvedTheme());
  
  /** Observable for the current theme */
  theme$: Observable<Theme> = this.themeSubject.asObservable();
  
  /** Observable for the resolved theme (light or dark) */
  resolvedTheme$: Observable<'light' | 'dark'> = this.resolvedThemeSubject.asObservable();
  
  private unsubscribe: (() => void) | null = null;
  private isBrowser: boolean;
  
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    if (this.isBrowser) {
      this.unsubscribe = onThemeChange((newTheme, newResolvedTheme) => {
        this.themeSubject.next(newTheme);
        this.resolvedThemeSubject.next(newResolvedTheme);
      });
    }
  }
  
  /**
   * Get the current theme
   */
  getTheme(): Theme {
    return this.themeSubject.value;
  }
  
  /**
   * Get the resolved theme (light or dark)
   */
  getResolvedTheme(): 'light' | 'dark' {
    return this.resolvedThemeSubject.value;
  }
  
  /**
   * Set the theme
   * @param theme Theme to set
   */
  setTheme(theme: Theme): void {
    if (this.isBrowser) {
      setFlexTheme(theme);
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    if (this.isBrowser) {
      toggleFlexTheme();
    }
  }
  
  /**
   * Configure the theme system
   * @param config Configuration options
   */
  configure(config: FlexThemeConfig): void {
    if (this.isBrowser) {
      configure(config);
    }
  }
  
  /**
   * Get the initial theme for SSR
   */
  private getInitialTheme(): Theme {
    return this.isBrowser ? getTheme() : 'light';
  }
  
  /**
   * Get the initial resolved theme for SSR
   */
  private getInitialResolvedTheme(): 'light' | 'dark' {
    return this.isBrowser ? getResolvedTheme() : 'light';
  }
  
  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
