import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.js',
      includeAssets: ['formclub-logo-black.png', 'avatar-default.png', 'pwa/icon-192x192.png', 'pwa/icon-512x512.png'],
      manifest: {
        name: 'FORMCLUB Performance',
        short_name: 'FORMCLUB',
        description: 'FORMCLUB - Human Performance Center',
        theme_color: '#D4AF37',
        background_color: '#0A0A0B',
        display: 'standalone',
        start_url: './',
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
      injectManifest: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ],
  base: './',
})
