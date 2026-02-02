async function login(email, senha) {
    try {

        const resposta = await requisicao('/auth/login', 'POST', {
            login: email,
            senha: senha
        });


        const dadosDoToken = decodificarToken(resposta.token);


        const roleReal = dadosDoToken.role;
        const idReal = dadosDoToken.id;

        console.log("Login realizado. Role detectada:", roleReal);


        let dadosUsuario = null;
        try {
            const endpoint = roleReal === 'PROFISSIONAL' ? '/profissional/meusdados' : '/usuario/meusdados';
            dadosUsuario = await requisicao(endpoint, 'GET');
        } catch (e) {
            console.warn("Não foi possível buscar detalhes extras do usuário", e);
        }


        salvarDadosUsuario({
            token: resposta.token,
            nome: dadosUsuario?.nome || 'Usuário',
            role: roleReal,
            id: idReal,
            fotoPerfil: dadosUsuario?.fotoPerfil || null
        });


        if (roleReal === 'PROFISSIONAL') {
            window.location.href = 'feed-trabalhador.html';
        } else if (roleReal === 'ADM') {
            window.location.href = 'painel-adm.html';
        } else {
            window.location.href = 'painel-cliente.html';
        }

        return { sucesso: true };

    } catch (erro) {
        const msg = (erro && erro.message) ? erro.message : '';
        if (msg.includes('BadCredentials') || msg.includes('403')) {
            return { sucesso: false, erro: 'Usuário inexistente ou senha inválida' };
        }
        return { sucesso: false, erro: msg || 'Erro ao fazer login' };
    }
}


function decodificarToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao ler token", e);
        return null;
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

        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
            const resultadoLogin = await login(dados.email, dados.senha, tipo);
            if (resultadoLogin.sucesso) {
                return { sucesso: true, criado: criado, loginAutomatico: true };
            } else {
                return { sucesso: true, criado: criado, loginAutomatico: false, erro: resultadoLogin.erro };
            }
        } catch (loginError) {
            console.warn('Login automático falhou:', loginError);
            return { sucesso: true, criado: criado, loginAutomatico: false, erro: loginError.message };
        }

    } catch (erro) {
        return { sucesso: false, erro: erro.message };
        console.error("Erro ao ler token", e);
        return null;
    }
}
