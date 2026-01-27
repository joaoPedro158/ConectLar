let modoAtual = 'LOGIN';
let tipoUsuarioCadastro = 'CLIENTE';

function gerenciarCamposCadastro(ativo) {
    const divCampos = document.getElementById('camposCadastro');
    if (!divCampos) return;

    const inputs = divCampos.querySelectorAll('input, select, textarea');

    if (ativo) {
        divCampos.classList.remove('escondido');
        inputs.forEach(input => input.disabled = false);
    } else {
        divCampos.classList.add('escondido');
        inputs.forEach(input => input.disabled = true);
    }
}

function alternarModo() {
    const btn = document.getElementById('btnAcao');
    const link = document.getElementById('linkTroca');
    const secaoTipo = document.getElementById('secaoTipo');

    if (modoAtual === 'LOGIN') {
        modoAtual = 'CADASTRO';
        btn.innerText = 'Cadastrar-se';
        link.innerText = 'Já tem conta? Entrar.';

        if (secaoTipo) secaoTipo.classList.remove('escondido');
        gerenciarCamposCadastro(true);
    } else {
        modoAtual = 'LOGIN';
        btn.innerText = 'Entrar no Sistema';
        link.innerText = 'Não tem conta? Crie agora!';

        if (secaoTipo) secaoTipo.classList.add('escondido');
        gerenciarCamposCadastro(false);
    }
}

function mudarTipo(botao) {
    document.querySelectorAll('.botaozinho-tipo').forEach(b => b.classList.remove('selecionado'));
    botao.classList.add('selecionado');
    tipoUsuarioCadastro = botao.getAttribute('data-tipo');
}

document.addEventListener('DOMContentLoaded', () => {
    gerenciarCamposCadastro(false);
});

// LOGIN E CADASTRO
const formAuth = document.getElementById('formAutenticacao');
if (formAuth) {
    formAuth.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = new FormData(formAuth);
        const btn = document.getElementById('btnAcao');
        const textoOriginal = btn.innerText;
        btn.innerText = 'Processando...';
        btn.disabled = true;

        try {
            if (modoAtual === 'LOGIN') {
                const payload = {
                    login: dados.get('login'),
                    senha: dados.get('senha')
                };

                const resp = await mandarProServidor('/auth/login', 'POST', payload);

                localStorage.setItem('token_conectlar', resp.token);
                localStorage.setItem('usuario_nome', resp.nome || 'Usuário');
                localStorage.setItem('usuario_imagem', resp.imagem || '');

                if (resp.role === 'ADMIN') {
                    window.location.href = 'painel-adm.html';
                } else if (resp.role === 'PROFISSIONAL') {
                    window.location.href = 'painel-profissional.html';
                } else {
                    window.location.href = 'painel-cliente.html';
                }

            } else {
                const jsonDados = {
                    email: dados.get('login'),
                    senha: dados.get('senha'),
                    nome: dados.get('nome'),
                    telefone: dados.get('telefone'),
                    localizacao: {
                        rua: dados.get('rua'),
                        bairro: dados.get('bairro'),
                        numero: dados.get('numero'),
                        cidade: dados.get('cidade'),
                        cep: dados.get('cep'),
                        estado: dados.get('estado'),
                        complemento: dados.get('complemento')
                    },
                    role: (tipoUsuarioCadastro === 'CLIENTE') ? 'USUARIO' : 'PROFISSIONAL'
                };

                const formDataApi = new FormData();
                const blobJson = new Blob([JSON.stringify(jsonDados)], { type: 'application/json' });
                formDataApi.append('dados', blobJson);

                const arquivoInput = document.getElementById('arquivoFoto');
                if (arquivoInput && arquivoInput.files[0]) {
                    formDataApi.append('arquivo', arquivoInput.files[0]);
                }

                const rota = tipoUsuarioCadastro === 'CLIENTE' ? '/usuario/form' : '/profissional/form';

                await mandarProServidor(rota, 'POST', formDataApi, true);
                alert('Conta criada com sucesso! Faça login.');
                alternarModo();
            }
        } catch (erro) {
            alert(erro.message || 'Erro na operação.');
        } finally {
            btn.innerText = textoOriginal;
            btn.disabled = false;
        }
    });
}

// NOVO TRABALHO (CORRIGIDO)
const formTrabalho = document.getElementById('formNovoTrabalho');
if (formTrabalho) {
    formTrabalho.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = formTrabalho.querySelector('button[type="submit"]');
        const textoOriginal = btn.innerText;
        btn.innerText = 'Publicando...';
        btn.disabled = true;

        const dtoTrabalho = {
            // CORREÇÃO: Java espera 'problema', não 'titulo'
            problema: document.getElementById('tituloServico').value,
            descricao: document.getElementById('descServico').value,

            // CORREÇÃO: Java espera 'pagamento' e é obrigatório
            pagamento: parseFloat(document.getElementById('pagamentoServico').value),

            categoria: document.getElementById('categoriaServico').value,
            status: "ABERTO",
            localizacao: {
                cep: document.getElementById('cepServico').value,
                rua: document.getElementById('ruaServico').value,
                bairro: document.getElementById('bairroServico').value,
                numero: document.getElementById('numeroServico').value,
                cidade: document.getElementById('cidadeServico').value,
                estado: document.getElementById('estadoServico').value,
                complemento: document.getElementById('complementoServico').value || ""
            }
        };

        const formData = new FormData();
        const blobJson = new Blob([JSON.stringify(dtoTrabalho)], { type: 'application/json' });
        formData.append('dados', blobJson);

        const arquivo = document.getElementById('fotoServico').files[0];
        if (arquivo) {
            formData.append('imagen', arquivo);
        }

        try {
            await mandarProServidor('/trabalho/form', 'POST', formData, true);
            alert('Projeto publicado com sucesso!');
            fecharModal();
            formTrabalho.reset();
            if (typeof carregarMeusPedidos === 'function') {
                carregarMeusPedidos();
            }
        } catch (erro) {
            alert('Erro ao publicar: ' + erro.message);
        } finally {
            btn.innerText = textoOriginal;
            btn.disabled = false;
        }
    });
}