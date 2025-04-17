import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexThemeToggleComponent } from './flex-theme-toggle.component';
import { FlexThemeService } from './flex-theme.service';
import type { FlexThemeConfig } from 'flex-theme';

/**
 * Angular module for flex-theme
 */
@NgModule({
  declarations: [
    FlexThemeToggleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FlexThemeToggleComponent
  ],
  providers: [
    FlexThemeService
  ]
})
export class FlexThemeModule {
  /**
   * Configure the flex-theme module
   * @param config Configuration options
   * @returns Configured module
   */
  static forRoot(config?: FlexThemeConfig): ModuleWithProviders<FlexThemeModule> {
    return {
      ngModule: FlexThemeModule,
      providers: [
        {
          provide: 'FLEX_THEME_CONFIG',
          useValue: config || {}
        },
        {
          provide: FlexThemeService,
          useFactory: (service: FlexThemeService) => {
            if (config) {
              service.configure(config);
            }
            return service;
          },
          deps: [FlexThemeService]
        }
      ]
    };
  }
}
