import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8181',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/auth': 'http://localhost:8181',
      '/usuario': 'http://localhost:8181',
      '/profissional': 'http://localhost:8181',
      '/trabalho': 'http://localhost:8181',
      '/pedido': 'http://localhost:8181',
      '/endereco': 'http://localhost:8181'
    }
  }
});
