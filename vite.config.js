import { defineConfig } from 'vite'
import shopify from 'vite-plugin-shopify'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [shopify(), tailwindcss()],

  // Configurar Tunnel para mapeamento de CSS em ambiente de personalização Shopify.
  server: {
    tunnel: true,
    cors: {
      origin: [
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
        'https://cecbra-com.myshopify.com'
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
