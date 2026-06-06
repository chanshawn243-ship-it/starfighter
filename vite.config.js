import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    middlewareMode: false
  },
  resolve: {
    alias: {
      'three': 'three'
    }
  }
});
