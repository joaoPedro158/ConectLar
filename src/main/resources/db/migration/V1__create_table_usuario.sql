-- Criação do schema (caso não exista)
CREATE SCHEMA IF NOT EXISTS usuario;

-- Criação da tabela cliente dentro do schema usuario
CREATE TABLE IF NOT EXISTS usuario.cliente (
                                               id SERIAL PRIMARY KEY,
                                               nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    localizacao VARCHAR(150),
    telefone VARCHAR(150)
    );
