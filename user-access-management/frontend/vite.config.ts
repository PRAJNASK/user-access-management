// filepath: c:\Users\PRAJNA SHETTY\user-access-management\user-access-management\frontend\vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can specify the port for the dev server
    proxy: { // Added proxy configuration
      '/api': { // Proxy API requests
        target: 'http://localhost:5000', // Your backend server address
        changeOrigin: true,
      }
    }
  },
})
