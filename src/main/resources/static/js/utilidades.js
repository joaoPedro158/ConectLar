const URL_API = 'http://localhost:8181';
const rotasPublicas = ['/auth/login', '/usuario/cadastrar', '/profissional/cadastrar', '/profissional/form', '/usuario/form'];

async function enviarRequisicao(endpoint, metodo, corpo = null, isMultipart = false) {
    const token = localStorage.getItem('token_conectlar');
    const headers = {};

    if (token && !rotasPublicas.includes(endpoint)) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Enviando requisição para:', endpoint, 'com token:', token ? 'SIM' : 'NÃO');
    } else {
        console.log('Enviando requisição para:', endpoint, 'sem token (rota pública ou sem token)');
    }

    const opcoes = {
        method: metodo,
        headers: headers
    };

    if (corpo) {
        if (isMultipart) {
            opcoes.body = corpo;
        } else {
            headers['Content-Type'] = 'application/json';
            opcoes.body = JSON.stringify(corpo);
        }
    }

    try {
        const resposta = await fetch(`${URL_API}${endpoint}`, opcoes);

        if (resposta.status === 401 || resposta.status === 403) {
            if (!rotasPublicas.includes(endpoint)) {
                fazerLogout();
                throw new Error('Sessão expirada ou acesso negado.');
            }
            if (resposta.status === 403) {
                console.error('Erro 403 na rota:', endpoint);
            }
        }

        const texto = await resposta.text();
        if (!resposta.ok) {
            throw new Error(texto || 'Erro na requisição');
        }

        return texto ? JSON.parse(texto) : {};
    } catch (erro) {
        console.error('Erro Fetch:', erro);
        throw erro;
    }
}

function fazerLogout() {
    localStorage.clear();
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
}

function verificarAutenticacao() {
    if (!localStorage.getItem('token_conectlar')) {
        window.location.href = 'index.html';
    }
}

async function buscarMeuPerfil() {
    const role = localStorage.getItem('usuario_role');
    let endpoint;
    
    if (role === 'PROFISSIONAL') {
        endpoint = '/profissional/list';
    } else {
        endpoint = '/usuario/list';
    }
    
    const usuarios = await enviarRequisicao(endpoint, 'GET');
    const tokenPayload = JSON.parse(atob(localStorage.getItem('token_conectlar').split('.')[1]));
    
    return usuarios.find(u => u.email === tokenPayload.sub) || null;
}