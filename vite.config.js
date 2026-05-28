import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon-180.webp'],
        manifest: {
          name: 'Gym Tracker',
          short_name: 'Gym Tracker',
          description: 'A simple app to track your gym subscriptions',
          theme_color: '#1e1e2e',
          icons: [
            {
              src: 'icon-192.webp',
              sizes: '192x192',
              type: 'image/webp',
            },
            {
              src: 'icon-512.webp',
              sizes: '512x512',
              type: 'image/webp',
            },
          ],
        }
      }),
    ],
    base: mode === 'development' ? '/' : '/gym-tracker/',
  }
})
