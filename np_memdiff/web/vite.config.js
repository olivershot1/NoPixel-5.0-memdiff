import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' so the built files load from FiveM's nui:// and from Live Server alike
export default defineConfig({
  plugins: [react()],
  base: './',
  build: { outDir: '../html', emptyOutDir: true }
})
