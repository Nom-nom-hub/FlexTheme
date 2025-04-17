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
  external: ['react', 'react-dom', 'flex-theme'],
  onSuccess: async () => {
    // Combine all CSS files into one
    const componentsDir = path.resolve(__dirname, 'src/components');
    const outputFile = path.resolve(__dirname, 'dist/styles.css');
    
    let combinedCSS = '';
    
    // Read all CSS files
    const files = fs.readdirSync(componentsDir, { recursive: true });
    for (const file of files) {
      if (typeof file === 'string' && file.endsWith('.css')) {
        const filePath = path.join(componentsDir, file);
        const css = fs.readFileSync(filePath, 'utf8');
        combinedCSS += `/* ${file} */\n${css}\n\n`;
      }
    }
    
    // Write combined CSS to output file
    fs.writeFileSync(outputFile, combinedCSS);
    console.log('CSS files combined successfully!');
  }
});
