import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Выносим ядро React в отдельный файл
          vendor: ['react', 'react-dom', 'react-router-dom', 'zustand'],
          // Выносим тяжелые анимации и иконки
          ui: ['framer-motion', 'lucide-react'],
          // Выносим плеер
          player: ['react-player']
        }
      }
    }
  }
})