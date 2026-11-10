import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from "@tailwindcss/vite"
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isCapacitor = mode === 'capacitor'
  const keyPath = new URL('./cert.key', import.meta.url)
  const certPath = new URL('./cert.crt', import.meta.url)
  // Self-signed SSL certificate for local PWA debugging (dev server only)
  const useHttps =
    command === 'serve' && fs.existsSync(keyPath) && fs.existsSync(certPath)

  return { 
    build: {
      sourcemap: true,
    },
    plugins: [
      tailwindcss(),
      svelte(),
      !isCapacitor && VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Enduro Time Card',
          short_name: 'Enduro Time Card',
          "theme_color": "silver",
          icons: [
            {
              "src": "images/android-chrome-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "images/android-chrome-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg}']
        }
      })
    ].filter(Boolean),
    define: {
      __IS_CAPACITOR__: JSON.stringify(mode === 'capacitor')
    },
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['test/**/test.*.ts'],
      coverage: {
        provider: 'v8' // or 'istanbul'
      }
    },
    // Self Signed SSL Certifcate for PWA Debugging
    server: {
      https: useHttps
        ? {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          }
        : undefined,
      host: true,
    }
  }
})
