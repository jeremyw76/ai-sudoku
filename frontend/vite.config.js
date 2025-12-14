import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable Fast Refresh (HMR) for React - this is enabled by default
      // but explicitly setting it ensures HMR works
    }),
  ],
  server: {
    port: 3000,
    host: 'localhost', // Explicitly set host for HMR websocket
    hmr: {
      // HMR configuration for proper websocket connection
      host: 'localhost',
      port: 3000,
    },
    watch: {
      // File watching configuration
      usePolling: true, // Use polling for WSL file system compatibility
      interval: 100,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})


