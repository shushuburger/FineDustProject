import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FineDustProject/', // GitHub Pages를 위한 base path
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
