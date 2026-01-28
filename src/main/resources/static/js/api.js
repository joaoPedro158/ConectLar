const API_BASE = '';

const ROTAS_PUBLICAS = ['/auth/login', '/usuario/cadastrar', '/profissional/cadastrar'];

async function requisicao(endpoint, metodo, corpo = null, multipart = false) {
    const token = localStorage.getItem('token_conectlar');
    const headers = {};

    if (token && !ROTAS_PUBLICAS.includes(endpoint)) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const opcoes = {
        method: metodo,
        headers: headers
    };

    if (corpo) {
        if (multipart) {
            opcoes.body = corpo;
        } else {
            headers['Content-Type'] = 'application/json';
            opcoes.body = JSON.stringify(corpo);
        }
    }

    try {
        const resposta = await fetch(`${API_BASE}${endpoint}`, opcoes);

        if (resposta.status === 401 || resposta.status === 403) {
            if (!ROTAS_PUBLICAS.includes(endpoint)) {
                logout();
                throw new Error('Sessão expirada');
            }
        }

        const texto = await resposta.text();
        if (!resposta.ok) {
            let mensagem = texto || 'Erro na requisição';
            try {
                const obj = texto ? JSON.parse(texto) : null;
                if (obj && typeof obj === 'object') {
                    if (obj.trace && typeof obj.trace === 'string') {
                        if (obj.trace.includes('BadCredentialsException') || obj.trace.includes('Usuário inexistente ou senha inválida')) {
                            mensagem = 'Usuário inexistente ou senha inválida';
                        }
                    }

                    if (mensagem !== 'Usuário inexistente ou senha inválida') {
                        if (obj.message) mensagem = obj.message;
                        else if (obj.error && typeof obj.error === 'string') mensagem = obj.error;
                    }
                }
            } catch (e) {
            }

            if ((resposta.status === 401 || resposta.status === 403) && (mensagem === 'Forbidden' || mensagem === 'Access Denied')) {
                mensagem = 'Usuário inexistente ou senha inválida';
            }

            throw new Error(mensagem);
        }

        return texto ? JSON.parse(texto) : {};
    } catch (erro) {
        console.error('Erro API:', erro);
        throw erro;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function verificarAutenticacao() {
    if (!localStorage.getItem('token_conectlar')) {
        window.location.href = 'index.html';
    }
}

function salvarDadosUsuario(dados) {
    localStorage.setItem('token_conectlar', dados.token);
    localStorage.setItem('usuario_nome', dados.nome);
    localStorage.setItem('usuario_role', dados.role);
    localStorage.setItem('usuario_id', dados.id);
    if (dados.fotoPerfil) {
        localStorage.setItem('usuario_foto', dados.fotoPerfil);
    } else {
        localStorage.removeItem('usuario_foto');
    }
}

function getUsuarioRole() {
    return localStorage.getItem('usuario_role') || 'USUARIO';
}

function getUsuarioId() {
    return localStorage.getItem('usuario_id');
}
