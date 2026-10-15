import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isCapacitor = mode === 'capacitor'

  return { 
    build: {
      sourcemap: true,
    },
    plugins: [
      tailwindcss(),
      svelte(),
      !isCapacitor && mkcert(),
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
    }
  }
})
