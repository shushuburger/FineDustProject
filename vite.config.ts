import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/FineDustProject/', // GitHub Pages를 위한 base path 설정
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
