# ConectLar

**ConectLar** é uma plataforma que conecta clientes a profissionais autônomos de serviços domésticos (encanadores, eletricistas, pintores, diaristas, marceneiros, jardineiros, mecânicos, entre outros). O sistema foi desenvolvido como trabalho da disciplina de Desenvolvimento Web do curso de TADS (IFRN).

Este README apresenta o projeto com foco na **API backend**, construída em Java com Spring Boot.

## Sobre o projeto

A ideia central do ConectLar é permitir que:

- **Clientes** publiquem "trabalhos" (serviços que precisam ser feitos), busquem profissionais e acompanhem o andamento de cada serviço solicitado.
- **Profissionais** se candidatem a trabalhos disponíveis, filtrados por categoria, e gerenciem seu histórico de atendimentos.
- **Administradores** tenham uma visão geral e controle sobre a plataforma.

Ao final de cada serviço, o cliente pode avaliar o profissional, criando um histórico de reputação.

## Stack do backend

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 3.3.5 |
| Persistência | Spring Data JPA + Hibernate |
| Banco de dados | PostgreSQL |
| Migrações | Flyway |
| Segurança | Spring Security + JWT (java-jwt) |
| Mapeamento objeto-DTO | MapStruct |
| Boilerplate | Lombok |
| Build | Maven (com Maven Wrapper) |
| Containerização | Docker Compose (PostgreSQL) |

## Arquitetura

O backend segue uma organização em camadas dentro do pacote `br.ifrn.conectlar`:

```
├── Controller/        # Endpoints REST, organizados por domínio
│   └── Rotas/          # Interfaces com as constantes de rotas
├── Model/              # DTOs, Records e Enums de domínio
│   ├── dto/
│   ├── dto/Record/
│   ├── mapper/          # Mappers gerados via MapStruct
│   └── Enum/
├── Repository/         # Repositórios JPA
│   └── Entity/          # Entidades persistidas (JPA)
├── Security/           # Configuração de segurança, filtro JWT e UserDetails
└── Service/             # Regras de negócio
    └── Impl/
```

### Principais entidades de domínio

- **Usuario**: cliente que solicita serviços.
- **Profissional**: prestador de serviços, associado a uma categoria de atuação.
- **Trabalho**: o serviço solicitado, com status e categoria.
- **Avaliacao**: nota e comentário dados a um profissional após a conclusão de um trabalho.
- **Adm**: usuário administrador da plataforma.
- **Localizacao**: dados de localização vinculados a usuários/trabalhos.

### Fluxo de um trabalho

O ciclo de vida de um `Trabalho` é controlado pelo enum `StatusTrabalho`:

`ABERTO` → `EM_ESPERA` → `EM_ANDAMENTO` → `CONCLUIDO` (ou `CANCELADO`)

1. O cliente cadastra um trabalho (`POST /trabalho/cadastrar`), opcionalmente com imagem.
2. Um profissional se candidata (`POST /trabalho/{id}/candidatar`).
3. O cliente aceita ou recusa o candidato (`POST /trabalho/{idTrabalho}/responder`).
4. O trabalho pode ser cancelado (`POST /trabalho/{idTrabalho}/cancelar`) ou concluído (`POST /trabalho/{idTrabalho}/concluir`).
5. Após a conclusão, o cliente avalia o profissional (`POST /avaliacao/avaliar/{idTrabalho}`).

Categorias de serviço disponíveis (`CategoriaEnum`): `encanador`, `eletricista`, `limpeza`, `pintor`, `marceneiro`, `jardineiro`, `mecanico`, `geral`.

## Autenticação e segurança

- Autenticação via **JWT**, com login em `POST /auth/login`.
- Sessão **stateless** (sem uso de sessões HTTP).
- Senhas criptografadas com **BCrypt**.
- Um `SecurityFilter` intercepta as requisições e valida o token antes do `UsernamePasswordAuthenticationFilter`.
- Endpoints de cadastro (usuário/profissional), listagem, busca e detalhe de trabalhos são públicos; ações que exigem identidade do usuário (candidatar-se, concluir trabalho, ver histórico, dados pessoais) exigem autenticação.
- CORS configurado via `CorsConfigurationSource`.

## Principais endpoints da API

| Recurso | Rota base | Descrição |
|---|---|---|
| Autenticação | `POST /auth/login` | Login e emissão de token JWT |
| Usuário | `/usuario` | Cadastro, atualização, listagem, histórico, dados pessoais e gasto total |
| Profissional | `/profissional` | Cadastro, atualização, listagem, histórico e dados do profissional |
| Trabalho | `/trabalho` | Cadastro, listagem, busca, filtro por categoria, candidatura, resposta, cancelamento e conclusão |
| Avaliação | `/avaliacao` | Avaliação de um profissional após a conclusão de um trabalho |
| Administrador | `/adm` | CRUD de administradores |

Envio de imagens (foto de perfil, imagem do trabalho) é feito via `multipart/form-data`, com limite configurado de 50MB por arquivo/requisição.

## Como executar o backend localmente

### Pré-requisitos

- Java 21
- Maven (ou use o wrapper `./mvnw` incluído no projeto)
- Docker (para subir o PostgreSQL) ou uma instância PostgreSQL local

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/joaoPedro158/ConectLar.git
   cd ConectLar/backend
   ```

2. Suba o banco de dados PostgreSQL com Docker Compose:
   ```bash
   docker compose up -d
   ```

3. Ajuste as credenciais em `src/main/resources/application.properties` conforme o seu ambiente (usuário, senha e URL do banco).

4. Execute a aplicação:
   ```bash
   ./mvnw spring-boot:run
   ```

5. A API estará disponível em `http://localhost:8181`.


## Frontend

O repositório também contém um frontend em **React + Vite**, responsável por consumir essa API. Este README tem como foco a documentação do backend; detalhes do frontend podem ser expandidos futuramente.

## Autor

Desenvolvido por [João Pedro](https://github.com/joaoPedro158), estudante de Análise e Desenvolvimento de Sistemas no IFRN — Campus Nova Cruz.
