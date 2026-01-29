async function login(email, senha) { // Note: Nem precisamos mais receber o 'tipo' aqui
    try {
        // 1. Faz a requisição (O Backend verifica senha e gera o token)
        const resposta = await requisicao('/auth/login', 'POST', {
            login: email,
            senha: senha
        });

        // 2. O MUNDO IDEAL: Lemos o token para saber a verdade
        const dadosDoToken = decodificarToken(resposta.token);

        // O Java manda a role como "ROLE_PROFISSIONAL" ou "PROFISSIONAL" (depende do seu Enum)
        // O Java manda o id como "id": 15
        const roleReal = dadosDoToken.role;
        const idReal = dadosDoToken.id;

        console.log("Login realizado. Role detectada:", roleReal);

        // 3. Busca o nome/foto (opcional, mas bom para a UI)
        let dadosUsuario = null;
        try {
            // Tenta buscar dados baseado na role que descobrimos no token
            const endpoint = roleReal === 'PROFISSIONAL' ? '/profissional/meusdados' : '/usuario/meusdados';
            dadosUsuario = await requisicao(endpoint, 'GET');
        } catch (e) {
            console.warn("Não foi possível buscar detalhes extras do usuário", e);
        }

        // 4. Salva tudo no LocalStorage
        salvarDadosUsuario({
            token: resposta.token,
            nome: dadosUsuario?.nome || 'Usuário',
            role: roleReal, // <--- Aqui está a segurança! Usamos a role do token.
            id: idReal,     // <--- O ID também vem direto do token
            fotoPerfil: dadosUsuario?.fotoPerfil || null
        });

        // 5. Redirecionamento Automático (Baseado na Role Real)
        if (roleReal === 'PROFISSIONAL') {
            window.location.href = 'feed-trabalhador.html';
        } else if (roleReal === 'ADM') {
            window.location.href = 'painel-adm.html'; // Exemplo
        } else {
            // Assume que é USUARIO/CLIENTE
            window.location.href = 'painel-cliente.html';
        }

        return { sucesso: true };

    } catch (erro) {
        // ... tratamento de erro igual ao que você já tinha ...
        const msg = (erro && erro.message) ? erro.message : '';
        if (msg.includes('BadCredentials') || msg.includes('403')) {
            return { sucesso: false, erro: 'Usuário inexistente ou senha inválida' };
        }
        return { sucesso: false, erro: msg || 'Erro ao fazer login' };
    }
}

// Função auxiliar para ler os dados de DENTRO do token
function decodificarToken(token) {
    try {
        // O token é: cabeçalho.payload.assinatura
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

        // Aguardar um pouco para o backend processar
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Tentar fazer login automático
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
