-- -----------------------------------------------------
-- 1. Tabela USUARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuario (
                                       id BIGSERIAL PRIMARY KEY,
                                       nome VARCHAR(150) NOT NULL,
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

-- -----------------------------------------------------
-- 2. Tabela PROFISSIONAL
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS profissional (
                                            id BIGSERIAL PRIMARY KEY,
                                            nome VARCHAR(150) NOT NULL,
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

-- -----------------------------------------------------
-- 3. Tabela ADM
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS adm (
                                   id BIGSERIAL PRIMARY KEY,
                                   nome VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
    );

-- -----------------------------------------------------
-- 4. Tabela TRABALHO (Refatorada)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS trabalho (
                                        id BIGSERIAL PRIMARY KEY,
                                        problema VARCHAR(250) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    pagamento DECIMAL(10, 2) NOT NULL,
    data_hora_aberta TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_hora_finalizada TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO',

-- Quem pediu?
    id_usuario BIGINT NOT NULL,

    -- Quem está fazendo? (Pode ser NULL no começo)
    id_profissional BIGINT,

    -- Endereço
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

-- -----------------------------------------------------
-- 5. Tabela AVALIACAO (Antiga Historico)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS avaliacao (
                                         id BIGSERIAL PRIMARY KEY,
                                         nota INT NOT NULL, -- Ex: 1 a 5 estrelas
                                         comentario VARCHAR(255),
    data_avaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    id_trabalho BIGINT NOT NULL UNIQUE, -- 1 avaliação por trabalho

    CONSTRAINT fk_avaliacao_trabalho
    FOREIGN KEY (id_trabalho) REFERENCES trabalho (id)
    );

-- -----------------------------------------------------
-- 7. Tabela DISPUTA
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS disputa (
                                       id BIGSERIAL PRIMARY KEY,
                                       data_fechamento TIMESTAMP NOT NULL,
                                       data_abertura TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- -----------------------------------------------------
-- 6. Tabela TRABALHO_IMAGEM (Para múltiplas fotos)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS trabalho_imagem (
    -- ID próprio da imagem (opcional, mas recomendado)
                                               id BIGSERIAL PRIMARY KEY,

    -- O caminho do arquivo salvo no disco (ex: "upload/uuid_foto.jpg")
                                               caminho_imagem VARCHAR(255) NOT NULL,

    -- A qual trabalho essa imagem pertence?
    id_trabalho BIGINT NOT NULL,

    -- CONSTRAINT: Se o trabalho for deletado, as imagens somem do banco também
    CONSTRAINT fk_trabalho_imagem_trabalho
    FOREIGN KEY (id_trabalho)
    REFERENCES trabalho (id)
    ON DELETE CASCADE
    );