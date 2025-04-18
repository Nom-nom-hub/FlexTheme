import { defineWorkspace } from 'vitest/config';
import { resolve } from 'path';

export default defineWorkspace([
  {
    test: {
      name: 'default',
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      root: '.',
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
          '@packages': resolve(__dirname, './packages')
        }
      },
      include: [
        'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ]
    }
  },
  {
    test: {
      name: 'packages',
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
      root: '.',
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
          '@packages': resolve(__dirname, './packages')
        }
      },
      include: [
        'packages/*/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'packages/*/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
      ]
    }
  }
]);
