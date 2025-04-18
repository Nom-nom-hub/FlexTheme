import { defineConfig } from 'vitest/config'

export default async function() {
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
  
  return defineConfig({
    plugins: [tsconfigPaths()],
    test: {
      environment: 'happy-dom', // or 'jsdom' if you prefer
      alias: {
        // Add aliases for your project structure
        '../../src': './src',
        '../../packages': './packages'
      }
    }
  });
}
