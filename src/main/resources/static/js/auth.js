async function login(email, senha, tipo) {
    try {
        const resposta = await requisicao('/auth/login', 'POST', {
            login: email,
            senha: senha
        });

        const role = tipo === 'profissional' ? 'PROFISSIONAL' : (tipo === 'adm' ? 'ADM' : 'USUARIO');

        if (tipo === 'adm') {
            salvarDadosUsuario({
                token: resposta.token,
                nome: 'Administrador',
                role: role,
                id: null
            });
            redirecionarPorRole(tipo);
            return { sucesso: true };
        }

        let dadosUsuario = null;
        try {
            dadosUsuario = await buscarDadosUsuario(resposta.token, tipo);
        } catch (e) {
            dadosUsuario = null;
        }

        salvarDadosUsuario({
            token: resposta.token,
            nome: dadosUsuario && dadosUsuario.nome ? dadosUsuario.nome : (tipo === 'profissional' ? 'Profissional' : 'Cliente'),
            role: role,
            id: dadosUsuario && dadosUsuario.id ? dadosUsuario.id : null
        });

        redirecionarPorRole(tipo);
        
        return { sucesso: true };
    } catch (erro) {
        const msg = (erro && erro.message) ? erro.message : '';
        if (
            msg.includes('Usuário inexistente ou senha inválida') ||
            msg.includes('BadCredentials') ||
            msg === 'Forbidden' ||
            msg === 'Access Denied'
        ) {
            return { sucesso: false, erro: 'Usuário inexistente ou senha inválida' };
        }
        return { sucesso: false, erro: msg || 'Erro ao fazer login' };
    }
}

async function buscarDadosUsuario(token, tipo) {
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const tentar = async (endpoint) => {
        const resposta = await fetch(`${API_BASE}${endpoint}`, {
            method: 'GET',
            headers: headers
        });

        if (!resposta.ok) {
            throw new Error('Erro ao buscar dados do usuário');
        }

        return await resposta.json();
    };

    const primario = tipo === 'profissional' ? '/profissional/meusdados' : '/usuario/meusdados';
    const alternativo = tipo === 'profissional' ? '/usuario/meusdados' : '/profissional/meusdados';

    try {
        return await tentar(primario);
    } catch (e) {
        return await tentar(alternativo);
    }
}

function redirecionarPorRole(tipo) {
    if (tipo === 'profissional') {
        window.location.href = 'feed-trabalhador.html';
    } else if (tipo === 'adm') {
        window.location.href = 'adm.html';
    } else {
        window.location.href = 'painel-cliente.html';
    }
}

async function cadastrarUsuario(dados, arquivo, tipo) {
    try {
        const formData = new FormData();
        formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
        
        if (arquivo) {
            formData.append('arquivo', arquivo);
        }

        const endpoint = tipo === 'profissional' ? '/profissional/cadastrar' : '/usuario/cadastrar';
        const criado = await requisicao(endpoint, 'POST', formData, true);

        return { sucesso: true, criado: criado };
    } catch (erro) {
        return { sucesso: false, erro: erro.message };
    }
}
