import { defineWorkspace } from 'vitest/config';
import path from 'path';

export default defineWorkspace([
  {
    test: {
      name: 'flex-theme',
      root: './flex-theme',
      environment: 'jsdom',
      include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      setupFiles: ['./test/setup.ts'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'flex-theme/src'),
      },
    },
  },
  // Other test suites can be added later when you're ready to fix them
]);
