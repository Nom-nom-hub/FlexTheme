/**
 * Dynamic import with type safety
 * @param modulePath Path to the module
 * @returns Promise that resolves to the module
 */
export function dynamicImport<T>(modulePath: string): Promise<T> {
  return import(/* @vite-ignore */ modulePath) as Promise<T>;
}

/**
 * Create a dynamic import function for a specific module
 * @param modulePath Path to the module
 * @returns Function that imports the module
 */
export function createDynamicImport<T>(modulePath: string): () => Promise<T> {
  return () => dynamicImport<T>(modulePath);
}

/**
 * Load a module only if a condition is met
 * @param condition Condition to check
 * @param importFn Function that imports the module
 * @returns Promise that resolves to the module or null
 */
export function conditionalImport<T>(
  condition: boolean | (() => boolean),
  importFn: () => Promise<T>
): Promise<T | null> {
  const shouldImport = typeof condition === 'function' ? condition() : condition;
  
  if (shouldImport) {
    return importFn();
  }
  
  return Promise.resolve(null);
}

/**
 * Load a module only in the browser
 * @param importFn Function that imports the module
 * @returns Promise that resolves to the module or null
 */
export function browserOnlyImport<T>(importFn: () => Promise<T>): Promise<T | null> {
  return conditionalImport(typeof window !== 'undefined', importFn);
}

/**
 * Load a module only on the server
 * @param importFn Function that imports the module
 * @returns Promise that resolves to the module or null
 */
export function serverOnlyImport<T>(importFn: () => Promise<T>): Promise<T | null> {
  return conditionalImport(typeof window === 'undefined', importFn);
}
