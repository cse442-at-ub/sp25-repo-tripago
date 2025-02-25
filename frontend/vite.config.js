import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/CSE442/2025-Spring/cse-442aj/frontend/',
  server: {
    proxy: {
      /*
      '/api': {
        target: 'http://localhost:8000', // PHP server 
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove "/api" prefix
      },
      */

      '/api': {
        target: 'http://tripago-backend.local/', // PHP server address
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Force the Host header so Apache sees tripago-backend.local
            proxyReq.setHeader('Host', 'tripago-backend.local');
          });
        },
      },
      
    },
  },
});

