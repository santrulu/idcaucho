import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/', // Mantiene rutas absolutas, ideal para Vercel
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: 'index.html', // Usa la ruta relativa sin path.resolve
      output: {
        assetFileNames: 'assets/[name][extname]', 
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~public': path.resolve(__dirname, './public')
    }
  },
  server: {
    port: 5173, // Asegura que el puerto no esté en uso
    open: true
  }
});
