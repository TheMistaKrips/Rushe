import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Выносим тяжелый плеер
            if (id.includes('react-player')) {
              return 'player';
            }
            // Выносим анимации и иконки
            if (id.includes('framer-motion') || id.includes('lucide-react')) {
              return 'ui';
            }
            // Выносим ядро React и стейт-менеджер
            if (id.includes('react') || id.includes('zustand') || id.includes('react-router')) {
              return 'vendor';
            }
            // Все остальные зависимости
            return 'index';
          }
        }
      }
    }
  }
})