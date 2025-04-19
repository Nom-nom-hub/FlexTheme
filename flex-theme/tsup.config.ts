import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    theme: 'src/theme.ts',
    types: 'src/types.ts'
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react'],
  outDir: 'dist',
  splitting: false,
  bundle: true,
}); 