import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Root package tests only
  {
    test: {
      name: 'root',
      root: '.',
      environment: 'jsdom',
      include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    }
  }
]);
