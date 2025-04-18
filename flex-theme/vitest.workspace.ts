import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'flex-theme',
      root: './flex-theme',
      environment: 'jsdom',
      setupFiles: ['./test/setup.ts'],
    },
  },
  // Add other workspaces if needed
]); 