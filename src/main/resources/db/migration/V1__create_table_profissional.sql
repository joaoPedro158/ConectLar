CREATE TABLE IF NOT EXISTS usuario.profissional (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    login VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    localizacao VARCHAR(150) NOT NULL,
    telefone VARCHAR(150),
    funcao VARCHAR(150)
    );