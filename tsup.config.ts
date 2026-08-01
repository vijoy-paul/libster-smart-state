import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/styles/index.css'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom'],
  injectStyle: false,
});
