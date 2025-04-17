import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/react.ts',
    'src/tokens/index.ts',
    'src/utils/index.ts',
    'src/animations/index.ts',
    'src/presets/index.ts',
    'src/i18n/index.ts'
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['react'],
});
