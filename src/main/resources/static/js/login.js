let modoLogin = true;
let tipoCadastro = 'CLIENTE';

document.addEventListener('DOMContentLoaded', () => {
    configurarBotoes();
});

function configurarBotoes() {
    const form = document.getElementById('formAutenticacao');
    if (form) form.addEventListener('submit', processarFormulario);

    const btnTroca = document.getElementById('linkTroca');
    if (btnTroca) btnTroca.addEventListener('click', (e) => { e.preventDefault(); alternarModo(); });

    const btnsTipo = document.querySelectorAll('.botaozinho-tipo');
    btnsTipo.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            selecionarTipo(btn);
        });
    });
}

function selecionarTipo(elemento) {
    document.querySelectorAll('.botaozinho-tipo').forEach(b => b.classList.remove('selecionado'));
    elemento.classList.add('selecionado');
    tipoCadastro = elemento.getAttribute('data-tipo');

    const areaCategoria = document.getElementById('areaCategoria');
    if (areaCategoria) {
        areaCategoria.style.display = (tipoCadastro === 'PROFISSIONAL') ? 'flex' : 'none';
    }

    if (!modoLogin) {
        document.getElementById('btnAcao').innerText = tipoCadastro === 'PROFISSIONAL' ? 'Cadastrar Profissional' : 'Cadastrar Cliente';
    }
}

function alternarModo() {
    modoLogin = !modoLogin;
    const containerCadastro = document.getElementById('camposCadastro');
    const secaoTipo = document.getElementById('secaoTipo');
    const btnAcao = document.getElementById('btnAcao');
    const linkTroca = document.getElementById('linkTroca');

    if (modoLogin) {
        containerCadastro.style.display = 'none';
        secaoTipo.style.display = 'none';
        btnAcao.innerText = 'Entrar no Sistema';
        linkTroca.innerText = 'Não tem conta? Crie agora!';
        document.querySelectorAll('#camposCadastro input, #camposCadastro select').forEach(i => i.disabled = true);
    } else {
        containerCadastro.style.display = 'flex';
        secaoTipo.style.display = 'flex';
        btnAcao.innerText = tipoCadastro === 'PROFISSIONAL' ? 'Cadastrar Profissional' : 'Cadastrar Cliente';
        linkTroca.innerText = 'Já tem conta? Faça login.';
        document.querySelectorAll('#camposCadastro input, #camposCadastro select').forEach(i => i.disabled = false);
    }
}

async function processarFormulario(e) {
    e.preventDefault();
    const btn = document.getElementById('btnAcao');
    const textoOriginal = btn.innerText;
    btn.disabled = true;
    btn.innerText = 'Processando...';

    const form = new FormData(e.target);

    try {
        if (modoLogin) {
            await realizarLogin(form);
        } else {
            await realizarCadastro(form);
        }
    } catch (erro) {
        alert(erro.message);
    } finally {
        btn.disabled = false;
        btn.innerText = textoOriginal;
    }
}

async function realizarLogin(form) {
    const payload = {
        login: form.get('login'),
        senha: form.get('senha')
    };

    const resposta = await enviarRequisicao('/auth/login', 'POST', payload);

    if (resposta.token) {
        localStorage.setItem('token_conectlar', resposta.token);
        localStorage.setItem('usuario_nome', resposta.nome || 'Usuário');

        if (resposta.role === 'ADMIN') window.location.href = 'adm.html';
        else if (resposta.role === 'PROFISSIONAL') window.location.href = 'feed-trabalhador.html';
        else window.location.href = 'painel-cliente.html';
    } else {
        throw new Error('Login falhou.');
    }
}

async function realizarCadastro(form) {
    const telefone = form.get('telefone');
    if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(telefone)) {
        alert('O telefone deve estar no formato: (XX) XXXXX-XXXX');
        return;
    }
    const dadosRecord = {
        nome: form.get('nome'),
        email: form.get('login'),
        senha: form.get('senha'),
        telefone: telefone,
        role: tipoCadastro === 'CLIENTE' ? 'USUARIO' : 'PROFISSIONAL',
        localizacao: {
            cep: form.get('cep'),
            rua: form.get('rua'),
            bairro: form.get('bairro'),
            numero: form.get('numero'),
            cidade: form.get('cidade'),
            estado: form.get('estado'),
            complemento: form.get('complemento')
        }
    };

    if (tipoCadastro === 'PROFISSIONAL') {
        const catInput = document.getElementById('categoriaProfissional');
        dadosRecord.categoria = catInput ? catInput.value : null;
    }

    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(dadosRecord)], { type: 'application/json' }));

    const arquivoInput = document.getElementById('arquivoFoto');
    if (arquivoInput && arquivoInput.files[0]) {
        formData.append('arquivo', arquivoInput.files[0]);
    }

    const rota = tipoCadastro === 'CLIENTE' ? '/usuario/form' : '/profissional/form';

    await enviarRequisicao(rota, 'POST', formData, true);

    alert('Cadastro realizado! Faça login.');
    location.reload();
}