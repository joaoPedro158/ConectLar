import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

 build: {
     outDir: path.resolve(__dirname, '../src/main/resources/static'),
     emptyOutDir: true,
   },

  server: {
    proxy: {

      '/api': {
        target: 'http://localhost:8181',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})