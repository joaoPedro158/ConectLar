-- -----------------------------------------------------
-- 1. Tabela USUARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
                                       id BIGSERIAL PRIMARY KEY,
                                       nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    login VARCHAR(100) NOT NULL UNIQUE,
    localizacao VARCHAR(100) NOT NULL,
    telefone VARCHAR(50) NOT NULL UNIQUE
    );

-- -----------------------------------------------------
-- 2. Tabela PROFISSIONAL
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS profissional (
                                            id BIGSERIAL PRIMARY KEY,
                                            nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    localizacao VARCHAR(100) NOT NULL,
    categoria VARCHAR(250) NOT NULL,
    telefone VARCHAR(50) NOT NULL UNIQUE
    );

-- -----------------------------------------------------
-- 3. Tabela ADM
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS adm (
                                   id BIGSERIAL PRIMARY KEY,
                                   nome VARCHAR(150) NOT NULL,
    email_adm VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    login_adm VARCHAR(100) NOT NULL UNIQUE DEFAULT CURRENT_TIMESTAMP::varchar
    );

-- -----------------------------------------------------
-- 4. Tabela TRABALHO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS trabalho (
                                        id BIGSERIAL PRIMARY KEY,
                                        localidade VARCHAR(100) NOT NULL,
    problema VARCHAR(250) NOT NULL,
    data_hora_aberta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pagamento DECIMAL(10, 2) NOT NULL,
    descricao VARCHAR(255) NOT NULL,

    id_usuario BIGINT NOT NULL,

    -- REMOVI id_profissional DAQUI

    CONSTRAINT fk_trabalho_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id)
    );
-- -----------------------------------------------------
-- 5. Tabela HISTORICO_TRABALHO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS historico_trabalho (
                                                  id BIGSERIAL PRIMARY KEY,
                                                  avaliacao_recebida VARCHAR(255),
    data_hora TIMESTAMP NOT NULL,
    trabalho_feito VARCHAR(100) NOT NULL DEFAULT CURRENT_TIMESTAMP::varchar,
    localidade VARCHAR(100) NOT NULL,
    id_profissional BIGINT NOT NULL,

    CONSTRAINT fk_historico_profissional
    FOREIGN KEY (id_profissional)
    REFERENCES profissional (id)
    );

-- -----------------------------------------------------
-- 6. Tabela HISTORICO_PEDIDOS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS historico_pedidos (
                                                 id BIGSERIAL PRIMARY KEY,
                                                 avaliacao VARCHAR(255) NOT NULL,
    trabalho_feito VARCHAR(100) NOT NULL,
    data_hora_feito TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    id_profissional BIGINT NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_trabalho BIGINT NOT NULL,

    CONSTRAINT fk_pedidos_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id),

    CONSTRAINT fk_pedidos_profissional
    FOREIGN KEY (id_profissional)
    REFERENCES profissional (id),

    CONSTRAINT fk_pedidos_trabalho
    FOREIGN KEY (id_trabalho)
    REFERENCES trabalho (id)
    );

-- -----------------------------------------------------
-- 7. Tabela DISPUTA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS disputa (
                                       id BIGSERIAL PRIMARY KEY,
                                       data_fechamento TIMESTAMP NOT NULL,
                                       data_abertura TIMESTAMP NOT NULL,
                                       status VARCHAR(45) NOT NULL,
    descricao VARCHAR(255) NOT NULL,

    id_usuario BIGINT NOT NULL,
    id_profissional BIGINT NOT NULL,
    id_adm BIGINT NOT NULL,

    CONSTRAINT fk_disputa_usuario
    FOREIGN KEY (id_usuario)
    REFERENCES usuario (id),

    CONSTRAINT fk_disputa_profissional
    FOREIGN KEY (id_profissional)
    REFERENCES profissional (id),

    CONSTRAINT fk_disputa_adm
    FOREIGN KEY (id_adm)
    REFERENCES adm (id)
    );