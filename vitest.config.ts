import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'happy-dom', // or 'jsdom' if you prefer
    alias: {
      // Add aliases for your project structure
      '../../src': './src',
      '../../packages': './packages'
    }
  }
})
