// /DaSpCoRate/frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss' // Importiere das Haupt-Tailwind-Paket
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss, // Verwende das Haupt-Tailwind-Paket hier
        autoprefixer,
      ],
    },
  },
})