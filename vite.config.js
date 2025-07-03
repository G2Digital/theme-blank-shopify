import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()

const shopifyUrls = process.env.VITE_SHOPIFY_URL
  ? process.env.VITE_SHOPIFY_URL.split(',').map((url) => url.trim())
  : []

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [shopify(), tailwindcss()],

  server: {
    tunnel: true,
    cors: {
      origin: [
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
        ...shopifyUrls
      ]
    }
  },

  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]'
      }
    }
  }
})
