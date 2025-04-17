import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  external: ['flex-theme'],
  onSuccess: async () => {
    // Copy CSS file to dist
    const srcCssPath = path.resolve(__dirname, 'src/styles.css');
    const destCssPath = path.resolve(__dirname, 'dist/styles.css');
    
    if (fs.existsSync(srcCssPath)) {
      fs.copyFileSync(srcCssPath, destCssPath);
      console.log('CSS file copied to dist successfully!');
    }
  }
});
