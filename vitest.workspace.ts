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
          '../../src': resolve(__dirname, 'src'),
          '../../packages': resolve(__dirname, 'packages')
        }
      }
    },
    include: [
      'test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'packages/*/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ]
  }
]);
