import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      tsconfigPaths(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon-180.webp'],
        manifest: {
          name: 'Gym Tracker',
          short_name: 'Gym Tracker',
          description: 'A simple app to track your gym subscriptions',
          theme_color: '#1e1e2e',
          background_color: '#f9fafb',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/gym-tracker/',
          start_url: '/gym-tracker/',
          icons: [
            {
              src: 'icon-192.webp',
              sizes: '192x192',
              type: 'image/webp',
              purpose: 'any maskable',
            },
            {
              src: 'icon-512.webp',
              sizes: '512x512',
              type: 'image/webp',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^.*\/gym-tracker\/$/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'html-cache',
              },
            },
            {
              urlPattern: /\.(?:js|css|webp|svg|png)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'asset-cache',
              },
            },
          ],
        },
      }),
    ],
    base: mode === 'development' ? '/' : '/gym-tracker/',
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/app/test-setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        thresholds: {
          branches: 80,
          functions: 80,
        },
      },
    },
  };
});
