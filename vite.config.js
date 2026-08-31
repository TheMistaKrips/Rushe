import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    minify: false, // Отключаем минификацию, чтобы избежать нехватки памяти на Vercel
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-player')) return 'player';
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'ui';
            if (id.includes('react') || id.includes('zustand') || id.includes('react-router')) return 'vendor';
            return 'index';
          }
        }
      }
    }
  }
})