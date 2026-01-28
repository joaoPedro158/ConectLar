
const URL_API = 'http://localhost:8181';

async function mandarProServidor(endpoint, metodo, corpo = null, temArquivo = false) {
    const token = localStorage.getItem('token_conectlar');
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const opcoes = {
        method: metodo,
        headers: headers
    };

    if (corpo) {
        if (temArquivo) {
            opcoes.body = corpo;
        } else {
            headers['Content-Type'] = 'application/json';
            opcoes.body = JSON.stringify(corpo);
        }
    }

    try {
        const resposta = await fetch(`${URL_API}${endpoint}`, opcoes);

        let json = null;
        const texto = await resposta.text();
        if (texto) {
            try { json = JSON.parse(texto); } catch(e) {}
        }

        if (!resposta.ok) {
            if (json && json.message) throw new Error(json.message);
            throw new Error('Erro na requisição: ' + resposta.status);
        }

        return json || {};
    } catch (erro) {
        console.error(erro);
        alert(erro.message || 'Erro de conexão.');
        throw erro;
    }
}

function fazerLogout() {
    localStorage.removeItem('token_conectlar');
    localStorage.removeItem('usuario_nome');
    localStorage.removeItem('tipo_usuario');
    localStorage.removeItem('usuario_imagem');
    window.location.href = 'index.html';
}

function abrirModal() {
    const modal = document.getElementById('modalNovoPedido');
    if(modal) modal.classList.remove('escondido');
}

function fecharModal() {
    const modal = document.getElementById('modalNovoPedido');
    if(modal) modal.classList.add('escondido');
}