/**
 * Mark a function as pure (side-effect free) for better tree-shaking
 * This is a no-op function that helps with documentation and tooling
 * @param target The function or object to mark as pure
 * @returns The same function or object
 */
export function /*#__PURE__*/ pure<T>(target: T): T {
  return target;
}

/**
 * Mark a module as having side effects
 * This is used to prevent tree-shaking of modules that have side effects
 * @param condition Optional condition to check
 */
export function sideEffect(condition: boolean = true): void {
  if (condition && process.env.NODE_ENV !== 'test') {
    // This empty if block prevents the function from being tree-shaken
  }
}

/**
 * Create a proxy that lazily initializes the target
 * This helps with tree-shaking by deferring initialization until needed
 * @param factory Factory function that creates the target
 * @returns Proxy to the target
 */
export function createLazyProxy<T extends object>(factory: () => T): T {
  let instance: T | undefined;
  
  return new Proxy({} as T, {
    get(target, prop, receiver) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.get(instance, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.set(instance, prop, value, receiver);
    },
    has(target, prop) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.has(instance, prop);
    },
    ownKeys(target) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.ownKeys(instance);
    },
    getOwnPropertyDescriptor(target, prop) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.getOwnPropertyDescriptor(instance, prop);
    },
    defineProperty(target, prop, descriptor) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.defineProperty(instance, prop, descriptor);
    },
    deleteProperty(target, prop) {
      if (!instance) {
        instance = factory();
      }
      return Reflect.deleteProperty(instance, prop);
    }
  });
}
