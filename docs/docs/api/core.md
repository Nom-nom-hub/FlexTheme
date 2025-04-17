---
sidebar_position: 1
---

# Core API

The core API provides the fundamental functionality for theme management.

## Functions

### getTheme

```typescript
function getTheme(): Theme
```

Returns the current theme ('light', 'dark', or 'auto').

### getResolvedTheme

```typescript
function getResolvedTheme(): 'light' | 'dark'
```

Returns the resolved theme ('light' or 'dark'), accounting for 'auto' setting.

### setTheme

```typescript
function setTheme(theme: Theme): void
```

Sets the theme to 'light', 'dark', or 'auto'.

### toggleTheme

```typescript
function toggleTheme(): void
```

Toggles between light and dark themes.

### onThemeChange

```typescript
function onThemeChange(callback: ThemeChangeListener): () => void
```

Registers a callback for theme changes, returns an unsubscribe function.

### configure

```typescript
function configure(options: FlexThemeConfig): void
```

Configures the theme system with custom options.

## Types

### Theme

```typescript
type Theme = 'light' | 'dark' | 'auto';
```

### FlexThemeConfig

```typescript
interface FlexThemeConfig {
  /**
   * The attribute name to set on the HTML element
   * @default 'data-theme'
   */
  attribute?: string;
  
  /**
   * The key to use for localStorage
   * @default 'flex-theme'
   */
  storageKey?: string;
  
  /**
   * Default theme to use if no theme is stored
   * @default 'auto'
   */
  defaultTheme?: Theme;
  
  /**
   * Default locale to use
   * @default 'en-US'
   */
  defaultLocale?: string;
  
  /**
   * Whether to enable RTL support
   * @default true
   */
  enableRtl?: boolean;
  
  /**
   * Whether to automatically apply mobile optimizations
   * @default true
   */
  enableMobileOptimizations?: boolean;
}
```

### ThemeChangeListener

```typescript
type ThemeChangeListener = (theme: Theme, resolvedTheme: 'light' | 'dark') => void;
```

## Internationalization

### getLocale

```typescript
function getLocale(): Locale
```

Returns the current locale.

### configureLocale

```typescript
function configureLocale(locale: Locale): void
```

Configures the theme system for a specific locale.

### getMessage

```typescript
function getMessage(locale: Locale, path: string, params?: Record<string, string>): string
```

Gets a translated message for the specified locale.

### formatDate

```typescript
function formatDate(date: Date, locale?: Locale): string
```

Formats a date according to the current locale.

### formatTime

```typescript
function formatTime(date: Date, locale?: Locale): string
```

Formats a time according to the current locale.

## Utilities

### Accessibility

```typescript
function calculateContrastRatio(foreground: string, background: string): number
```

Calculates the contrast ratio between two colors.

```typescript
function isAccessible(
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean
```

Checks if a color combination meets WCAG accessibility standards.

```typescript
function suggestAccessibleColor(
  baseColor: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): string
```

Suggests an accessible color based on a base color and background.

### Mobile

```typescript
function detectTouchDevice(): boolean
```

Detects if the current device is a touch device.

```typescript
function isPortraitOrientation(): boolean
```

Detects if the device is in portrait orientation.

```typescript
function getDeviceType(): 'mobile' | 'tablet' | 'desktop'
```

Gets the device type based on screen width.

```typescript
function applyMobileOptimizations(): void
```

Applies mobile-specific optimizations.

```typescript
function setupMobileViewport(options?: {
  initialScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
}): void
```

Adds viewport meta tag for proper mobile rendering.
