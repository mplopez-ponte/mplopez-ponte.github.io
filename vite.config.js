import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Desarrollo local: proxy al backend
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  // Build de producción optimizado
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separar chunks para mejor caché del navegador
        manualChunks: {
          vendor:  ['react', 'react-dom', 'react-router-dom'],
          charts:  ['chart.js', 'react-chartjs-2'],
          ui:      ['bootstrap', 'react-toastify'],
        },
      },
    },
  },

  resolve: {
    alias: { '@': '/src' },
  },
});
