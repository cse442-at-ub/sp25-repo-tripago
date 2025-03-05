import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  //base: '/CSE442/2025-Spring/cse-442aj/npula/',
  //base: '/CSE442/2025-Spring/cse-442aj/npula/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // PHP server 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove "/api" prefix
      },
    },
  },
});

