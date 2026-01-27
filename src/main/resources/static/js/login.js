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

    const telefoneInput = document.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', aplicarMascaraTelefone);
        telefoneInput.addEventListener('keydown', limitarCaracteresTelefone);
    }
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

function aplicarMascaraTelefone(event) {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }
    
    if (valor.length > 0) {
        if (valor.length <= 2) {
            valor = `(${valor}`;
        } else if (valor.length <= 7) {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2)}`;
        } else {
            valor = `(${valor.substring(0, 2)}) ${valor.substring(2, 7)}-${valor.substring(7)}`;
        }
    }
    
    event.target.value = valor;
}

function limitarCaracteresTelefone(event) {
    const valor = event.target.value.replace(/\D/g, '');
    if (valor.length >= 11 && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'Tab') {
        event.preventDefault();
    }
}

function previewFoto(input) {
    const preview = document.getElementById('fotoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        preview.style.display = 'none';
    }
}

function alternarModo() {
    modoLogin = !modoLogin;
    const containerCadastro = document.getElementById('camposCadastro');
    const secaoTipo = document.getElementById('secaoTipo');
    const btnAcao = document.getElementById('btnAcao');
    const linkTroca = document.getElementById('linkTroca');
    const fotoPreview = document.getElementById('fotoPreview');
    const arquivoFoto = document.getElementById('arquivoFoto');

    if (modoLogin) {
        containerCadastro.style.display = 'none';
        secaoTipo.style.display = 'none';
        btnAcao.innerText = 'Entrar no Sistema';
        linkTroca.innerText = 'Não tem conta? Crie agora!';
        document.querySelectorAll('#camposCadastro input, #camposCadastro select').forEach(i => i.disabled = true);
        
        // Limpar preview da foto
        if (fotoPreview) {
            fotoPreview.style.display = 'none';
            fotoPreview.src = '/assets/avatar-padrao.png';
        }
        if (arquivoFoto) arquivoFoto.value = '';
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
        
        const usuarioPayload = JSON.parse(atob(resposta.token.split('.')[1]));
        localStorage.setItem('usuario_nome', usuarioPayload.nome || 'Usuário');
        localStorage.setItem('usuario_role', usuarioPayload.role || 'USUARIO');

        if (usuarioPayload.role === 'ADMIN') window.location.href = 'adm.html';
        else if (usuarioPayload.role === 'PROFISSIONAL') window.location.href = 'feed-trabalhador.html';
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

    const resposta = await enviarRequisicao(rota, 'POST', formData, true);

    alert('Cadastro realizado! Faça login.');
    alternarModo();
}