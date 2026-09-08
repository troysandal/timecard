import { defineConfig } from 'cypress'

export default defineConfig({
  "defaultBrowser": "chrome",
  e2e: {
    baseUrl: 'https://localhost:5173',
  },
})

