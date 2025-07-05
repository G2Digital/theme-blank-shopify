import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import tailwindcss from '@tailwindcss/vite'
import cleanup from '@by-association-only/vite-plugin-shopify-clean' // Adicione esta importação
import dotenv from 'dotenv'

dotenv.config()

const shopifyUrls = process.env.VITE_SHOPIFY_URL
  ? process.env.VITE_SHOPIFY_URL.split(',').map((url) => url.trim())
  : []

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    cleanup(), // Adicione o plugin antes do shopify
    shopify(),
    tailwindcss()
  ],

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
    emptyOutDir: false, // Desative o comportamento padrão de limpar a pasta
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]'
      }
    }
  }
})
