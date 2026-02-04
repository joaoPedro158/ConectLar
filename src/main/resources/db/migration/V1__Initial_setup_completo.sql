

CREATE TABLE IF NOT EXISTS usuario (
                                       id BIGSERIAL PRIMARY KEY,
                                       nome VARCHAR(150) NOT NULL,
    foto_perfil VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,

    rua VARCHAR(150) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(50)
    );


CREATE TABLE IF NOT EXISTS profissional (
                                            id BIGSERIAL PRIMARY KEY,
                                            nome VARCHAR(150) NOT NULL,
    foto_perfil VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    categoria VARCHAR(250) NOT NULL,
    telefone VARCHAR(50) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,

    rua VARCHAR(150) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(50)

    );

CREATE TABLE IF NOT EXISTS adm (
                                   id BIGSERIAL PRIMARY KEY,
                                   nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS trabalho (
                                        id BIGSERIAL PRIMARY KEY,
                                        problema VARCHAR(250) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    pagamento DECIMAL(10, 2) NOT NULL,
    data_hora_aberta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_hora_finalizada TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',
    categoria VARCHAR(20),


    id_usuario BIGINT NOT NULL,

    id_profissional BIGINT,


    rua VARCHAR(150) NOT NULL,
    bairro VARCHAR(100) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    complemento VARCHAR(50),

    CONSTRAINT fk_trabalho_usuario
    FOREIGN KEY (id_usuario) REFERENCES usuario (id),

    CONSTRAINT fk_trabalho_profissional
    FOREIGN KEY (id_profissional) REFERENCES profissional (id)
    );

CREATE TABLE IF NOT EXISTS avaliacao (
                                         id BIGSERIAL PRIMARY KEY,
                    nota INT NOT NULL,
    comentario VARCHAR(255),
    data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_trabalho BIGINT NOT NULL UNIQUE,

    CONSTRAINT fk_avaliacao_trabalho
    FOREIGN KEY (id_trabalho) REFERENCES trabalho (id)
    );
