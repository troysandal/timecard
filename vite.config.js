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
  // Self-signed SSL certificate for local PWA debugging (dev server only).
  // Capacitor's WebView rejects self-signed certs, so its dev server (mode
  // capacitor, `npm run dev:cap`) stays plain http.
  const useHttps =
    command === 'serve' && !isCapacitor && fs.existsSync(keyPath) && fs.existsSync(certPath)

  return { 
    build: {
      sourcemap: true,
    },
    plugins: [
      tailwindcss(),
      svelte(),
      {
        // Native apps lock the zoom so a double-tap or pinch can't zoom the UI (native apps
        // don't). The web build and PWA stay zoomable for accessibility; touch-action in
        // app.css still stops double-tap zoom there.
        name: 'native-viewport-lock',
        /** @param {string} html */
        transformIndexHtml: (html) => {
          if (!isCapacitor) return html
          if (!html.includes('viewport-fit=cover')) {
            // Fail the build rather than ship native apps that can be zoomed by accident.
            throw new Error('native-viewport-lock: index.html viewport meta must contain viewport-fit=cover')
          }
          return html.replace('viewport-fit=cover', 'maximum-scale=1, viewport-fit=cover')
        },
      },
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
          globPatterns: ['**/*.{js,css,html,png,svg,woff2}']
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
