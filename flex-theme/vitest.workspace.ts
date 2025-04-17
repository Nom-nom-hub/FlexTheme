import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Use glob patterns to find all vitest.config.ts files
  'packages/*',
  // Root package tests
  {
    test: {
      name: 'root',
      root: '.',
      environment: 'jsdom',
      include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    }
  }
]);
