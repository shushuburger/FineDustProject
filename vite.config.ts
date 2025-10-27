import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync } from 'fs'
import { join } from 'path'

// Service Worker 파일 복사 플러그인
function copyServiceWorker() {
  return {
    name: 'copy-service-worker',
    buildEnd() {
      copyFileSync(
        join(__dirname, 'public/sw.js'),
        join(__dirname, 'dist/sw.js')
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyServiceWorker()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  define: {
    global: 'globalThis',
  },
})
