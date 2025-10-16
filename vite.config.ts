import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
    server: {
    proxy: {
      '/dependencies': {
        target: 'http://98.90.206.21:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

})
