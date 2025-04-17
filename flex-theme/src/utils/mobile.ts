/**
 * Detects if the current device is a touch device
 * @returns True if the device supports touch
 */
export function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - For older browsers
    (navigator.msMaxTouchPoints > 0)
  );
}

/**
 * Detects if the device is in portrait orientation
 * @returns True if in portrait mode
 */
export function isPortraitOrientation(): boolean {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(orientation: portrait)').matches;
}

/**
 * Gets the device type based on screen width
 * @returns Device type: 'mobile', 'tablet', or 'desktop'
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;

  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Applies mobile-specific optimizations
 */
export function applyMobileOptimizations(): void {
  if (typeof document === 'undefined') return;

  const isTouchDevice = detectTouchDevice();
  const deviceType = getDeviceType();

  // Add classes to the document for CSS targeting
  if (isTouchDevice) {
    document.documentElement.classList.add('touch-device');
  }

  document.documentElement.classList.add(`device-${deviceType}`);

  // Apply mobile-specific CSS variables
  if (deviceType === 'mobile' || deviceType === 'tablet') {
    // Larger touch targets for mobile
    document.documentElement.style.setProperty('--touch-target-size', '44px');
    document.documentElement.style.setProperty('--input-padding', '12px');
    document.documentElement.style.setProperty('--button-min-height', '44px');

    // Adjust font sizes for better readability on small screens
    if (deviceType === 'mobile') {
      document.documentElement.style.setProperty('--font-size-adjustment', '1.1');
    }
  }

  // Listen for orientation changes
  window.addEventListener('orientationchange', () => {
    if (isPortraitOrientation()) {
      document.documentElement.classList.add('portrait');
      document.documentElement.classList.remove('landscape');
    } else {
      document.documentElement.classList.add('landscape');
      document.documentElement.classList.remove('portrait');
    }
  });

  // Trigger initial orientation check
  if (isPortraitOrientation()) {
    document.documentElement.classList.add('portrait');
  } else {
    document.documentElement.classList.add('landscape');
  }
}

/**
 * Adds viewport meta tag for proper mobile rendering
 * @param options Configuration options
 */
export function setupMobileViewport(options: {
  initialScale?: number;
  maximumScale?: number;
  userScalable?: boolean;
} = {}): void {
  if (typeof document === 'undefined') return;

  const {
    initialScale = 1.0,
    maximumScale = 5.0,
    userScalable = true
  } = options;

  // Check if viewport meta tag already exists
  let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;

  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.setAttribute('name', 'viewport');
    document.head.appendChild(viewportMeta);
  }

  viewportMeta.setAttribute(
    'content',
    `width=device-width, initial-scale=${initialScale}, maximum-scale=${maximumScale}, user-scalable=${userScalable ? 'yes' : 'no'}`
  );
}
