# ConectLar Frontend (React + Vite)

Este projeto foi migrado para React com Vite, focado em alta performance e responsividade mobile, substituindo a antiga interface baseada em arquivos estáticos e JavaScript puro.

## Pré-requisitos

- Node.js (v18+)
- Backend Spring Boot rodando na porta 8080

## Como iniciar

1. Entre na pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Estrutura

- **src/pages**: Contém as páginas principais (Login, FeedTrabalhador, PainelCliente).
- **src/services**: Contém a lógica de comunicação com a API (substituindo o antigo `api.js`).
- **src/components**: Componentes reutilizáveis (a ser expandido).

## Funcionalidades Migradas

- **Autenticação**: Login e Cadastro (Cliente/Profissional) integrados.
- **Painel Cliente**: Visualização e criação de novos pedidos de serviço.
- **Feed Trabalhador**: Listagem e candidatura a trabalhos disponíveis.
- **Responsividade**: Layout adaptado para mobile (CSS responsivo).

## Notas sobre a Migração

- O código antigo (static/js) usava manipulação direta do DOM. O novo código usa o estado do React (`useState`) para gerenciar a interface.
- A configuração do Vite (`vite.config.js`) já possui um proxy para redirecionar chamadas `/api` e outras rotas para `http://localhost:8080`, evitando problemas de CORS durante o desenvolvimento.

