import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    viteCompression({
    verbose: true,
    disable: false,
    threshold: 10240,
    algorithm: 'gzip',
    ext: '.gz',
  }),],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
  },
})
