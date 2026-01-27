// funções de autenticação, alternância de modo e cadastro
const URL_API = 'http://localhost:8182';
let modoAtual = 'LOGIN';
let tipoUsuarioCadastro = 'CLIENTE';

function alternarModo() {
    const btn = document.getElementById('btnAcao');
    const link = document.getElementById('linkTroca');
    const camposExtras = document.getElementById('camposCadastro');
    const secaoTipo = document.getElementById('secaoTipo');

    if (!localStorage.getItem('token_conectlar')) {
        window.location.href = 'index.html';
    }

    if (modoAtual === 'LOGIN') {
        modoAtual = 'CADASTRO';
        btn.innerText = 'Cadastrar-se';
        link.innerText = 'Já tem conta? Entrar.';
        camposExtras.classList.remove('escondido');
        secaoTipo.classList.remove('escondido');
    } else {
        modoAtual = 'LOGIN';
        btn.innerText = 'Entrar no Sistema';
        link.innerText = 'Não tem conta? Crie agora!';
        camposExtras.classList.add('escondido');
        secaoTipo.classList.add('escondido');
    }
}

function mudarTipo(botao) {
    document.querySelectorAll('.botaozinho-tipo').forEach(b => b.classList.remove('selecionado'));
    botao.classList.add('selecionado');
    tipoUsuarioCadastro = botao.getAttribute('data-tipo');
}

function fazerLogout() {
    localStorage.removeItem('token_conectlar');
    localStorage.removeItem('tipo_usuario');
    window.location.href = 'index.html';
}

async function mandarProServidor(endpoint, metodo, corpo = null, temArquivo = false) {
    const token = localStorage.getItem('token_conectlar');
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const opcoes = { method: metodo, headers: headers };
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
        const texto = await resposta.text();
        const json = (() => { try { return texto ? JSON.parse(texto) : null; } catch(e) { return null; } })();
        if (!resposta.ok) {
            if (json) {
                if (typeof json === 'object' && !Array.isArray(json)) {
                    const partes = Object.entries(json).map(([k,v]) => `${k}: ${v}`).join('\n');
                    throw new Error(partes || JSON.stringify(json));
                }
                throw new Error(JSON.stringify(json));
            }
            throw new Error('Deu ruim na requisição: ' + resposta.status);
        }
        return json || {};
    } catch (erro) {
        console.error(erro);
        alert(erro.message || 'Erro de conexão. O servidor tá ligado?');
        throw erro;
    }
}

const formAuth = document.getElementById('formAutenticacao');
if (formAuth) {
    formAuth.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = new FormData(formAuth);
        if (modoAtual === 'LOGIN') {
            const payload = {
                login: dados.get('login'),
                senha: dados.get('senha')
            };
            try {
                const resp = await mandarProServidor('/auth/login', 'POST', payload);
                localStorage.setItem('token_conectlar', resp.token);
                window.location.href = 'painel-cliente.html';
            } catch (e) {
                alert(e.message || 'Login falhou. Senha errada?');
            }
        } else {
            const jsonDados = {
                email: dados.get('login') || `sem-email-${Date.now()}@local.test`,
                senha: dados.get('senha'),
                nome: dados.get('nome'),
                telefone: dados.get('telefone'),
                localizacao: {
                    rua: dados.get('rua') || "Rua padrão",
                    bairro: dados.get('bairro') || "",
                    numero: dados.get('numero') || "0",
                    cidade: dados.get('cidade') || "Não informada",
                    cep: dados.get('cep') || "",
                    estado: dados.get('estado') || "",
                    complemento: dados.get('complemento') || ""
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
            try {
                await mandarProServidor(rota, 'POST', formDataApi, true);
                alert('Conta criada com sucesso! Agora faz o login aí.');
                alternarModo();
            } catch (e) {
                alert('Erro ao cadastrar. Tente novamente.');
            }
        }
    });
}
