import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // or "0.0.0.0"
    port: 5173, // you can change the port if needed
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
})
