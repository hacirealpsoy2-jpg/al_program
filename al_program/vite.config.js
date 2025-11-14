import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',           // Render container dışına açıyor
    port: process.env.PORT || 5173, // Render portunu kullan
  }
})
