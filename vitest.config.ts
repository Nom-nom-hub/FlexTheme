import { defineConfig } from 'vitest/config'

export default async function() {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
  
  return defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      environment: 'happy-dom', // or 'jsdom' if you prefer
      alias: {
        // Fix path resolution for tests
        '../../src': './src',
        '../../packages': './packages',
        // Add base paths for direct imports
        '@src': './src',
        '@packages': './packages'
      },
      // Ensure all test files are found
      include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
    }
  });
}
