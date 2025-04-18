import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  // Include your test directories
  'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
  'packages/*/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
  // You can also include specific config files
  {
    test: {
      name: 'default',
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts']
    }
  }
]);
