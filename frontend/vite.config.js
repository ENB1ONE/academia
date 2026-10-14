import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['formclub-logo.png', 'pwa/icon-192x192.png', 'pwa/icon-512x512.png'],
      manifest: {
        name: 'FORMCLUB',
        short_name: 'FORMCLUB',
        description: 'Human Performance Center',
        theme_color: '#1B202B',
        background_color: '#1B202B',
        display: 'standalone',
        start_url: '/academia/',
        icons: [
          {
            src: 'pwa/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ],
  base: '/academia/',
})
