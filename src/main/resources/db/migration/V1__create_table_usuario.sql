-- Criação do schema (como você pediu)
CREATE SCHEMA IF NOT EXISTS usuario;


CREATE TABLE IF NOT EXISTS usuario.cliente (

    id BIGSERIAL PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,

    login VARCHAR(100) NOT NULL UNIQUE,

    senha VARCHAR(255) NOT NULL,

    localizacao VARCHAR(150),

    telefone VARCHAR(150) NOT NULL UNIQUE
    );