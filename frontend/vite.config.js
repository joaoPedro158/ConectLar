import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Configuração otimizada para o projeto ConectaLar (srcdefinito)
export default defineConfig({
  plugins: [react()],
  root: '.',
  
  // Configurações do servidor de desenvolvimento
  server: {
    port: 3000,
    open: true, // Abre o navegador automaticamente ao rodar 'npm run dev'
  },

  // Configurações de build
  build: {
    outDir: 'dist',
    emptyOutDir: true, // Limpa a pasta dist antes de gerar um novo build
  },

  // Atalhos de importação (Aliases)
  resolve: {
    alias: {
      // Isso permite importar arquivos usando '@' como raiz do 'srcdefinito'
      // Exemplo: import { Botao } from "@/app/components/ui/Botao"
      '@': path.resolve(__dirname, './srcdefinito'),
    },
  },
});