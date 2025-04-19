import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs'],
  dts: false,
  clean: true,
  external: ['react'],
  outDir: 'dist',
  splitting: false,
  bundle: true,
});
