/**
 * Memoize a function to cache its results
 * @param fn Function to memoize
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: any[]) => {
    // Create a key from the arguments
    const key = JSON.stringify(args);
    
    // Return cached result if available
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Calculate result and cache it
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Debounce a function to limit how often it can be called
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle a function to limit how often it can be called
 * @param fn Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    if (timeSinceLastCall >= limit) {
      // If enough time has passed, call the function immediately
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      // Otherwise, schedule a call after the remaining time
      const remaining = limit - timeSinceLastCall;
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn(...args);
      }, remaining);
    }
  };
}

/**
 * Measure the execution time of a function
 * @param fn Function to measure
 * @param label Label for the console output
 * @returns Function with timing measurement
 */
export function measurePerformance<T extends (...args: any[]) => any>(fn: T, label: string): T {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${label}: ${end - start}ms`);
    return result;
  }) as T;
}

/**
 * Check if code is running in a production environment
 * @returns True if in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Lazy load a module
 * @param importFn Function that imports the module
 * @returns Promise that resolves to the module
 */
export function lazyLoad<T>(importFn: () => Promise<T>): () => Promise<T> {
  let modulePromise: Promise<T> | null = null;
  
  return () => {
    if (!modulePromise) {
      modulePromise = importFn();
    }
    
    return modulePromise;
  };
}
