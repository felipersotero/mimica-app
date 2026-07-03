import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/mimica-app/',
  
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Atualiza automaticamente se você publicar uma versão nova
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'], 
      manifest: {
        name: 'Mímica App',
        short_name: 'Mímica',
        description: 'Jogo de mímica para jogar offline com a galera.',
        theme_color: '#121212',
        background_color: '#121212',
        display: 'standalone', // Faz abrir em tela cheia, sem a barra de navegação do navegador
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Isso é o que faz a mágica do modo offline acontecer
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
      }
    })
  ]
})