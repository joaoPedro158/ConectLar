import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'ConectLar',
        short_name: 'ConectLar',
        description: 'ConectLar',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#FAFAFB',
        theme_color: '#FAFAFB',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.appwrite\.io\/v1\//,
            handler: 'NetworkOnly',
            options: {
              cacheName: 'appwrite-api',
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('appwrite')) return 'appwrite'
          return
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
})
