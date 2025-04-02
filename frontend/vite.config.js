import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/CSE442/2025-Spring/cse-442aj/npulaTest/',
  // base: '/CSE442/2025-Spring/cse-442aj/frontend/',
  server: {

      
  base: 'http://localhost/',
  server: {
  proxy: {
      "/api": {
        target: "http://localhost", // Change to your PHP backend URL
        changeOrigin: true,
        secure: false, // Only needed if using HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }, 
  //},
  /*
    proxy: {

      '/api': {
        target: 'https://aptitude.cse.buffalo.edu/CSE442/2025-Spring/cse-442aj/backend/', // PHP server address
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Host', 'https://aptitude.cse.buffalo.edu/CSE442/2025-Spring/cse-442aj/backend/');
          });
        },
      }, */
    }, 
  },
});