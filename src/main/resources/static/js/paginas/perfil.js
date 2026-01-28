document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarPerfil();

    const formPerfil = document.getElementById('formPerfil');
    if (formPerfil) formPerfil.addEventListener('submit', atualizarPerfil);
});

async function buscarMeuPerfil() {
    const role = getUsuarioRole();
    const endpoint = role === 'PROFISSIONAL' ? '/profissional/meusdados' : '/usuario/meusdados';
    const dados = await requisicao(endpoint, 'GET');
    return dados;
}

async function carregarPerfil() {
    try {
        const perfil = await buscarMeuPerfil();
        if (!perfil) return;

        const imgPreview = document.getElementById('imgPreview');
        if (imgPreview && perfil.fotoPerfil) {
            imgPreview.src = perfil.fotoPerfil.startsWith('http') || perfil.fotoPerfil.startsWith('/') ? perfil.fotoPerfil : '/upload/' + perfil.fotoPerfil;
        }

        const campoNome = document.querySelector('input[name="nome"]');
        if (campoNome) campoNome.value = perfil.nome || '';

        const campoTelefone = document.querySelector('input[name="telefone"]');
        if (campoTelefone) campoTelefone.value = perfil.telefone || '';

        const campoEmail = document.querySelector('input[name="login"]');
        if (campoEmail) campoEmail.value = perfil.email || '';

        const loc = perfil.localizacao || {};
        const campoCep = document.querySelector('input[name="cep"]');
        if (campoCep) campoCep.value = loc.cep || '';

        const campoRua = document.querySelector('input[name="rua"]');
        if (campoRua) campoRua.value = loc.rua || '';

        const campoBairro = document.querySelector('input[name="bairro"]');
        if (campoBairro) campoBairro.value = loc.bairro || '';

        const campoNumero = document.querySelector('input[name="numero"]');
        if (campoNumero) campoNumero.value = loc.numero || '';

        const campoEstado = document.querySelector('input[name="estado"]');
        if (campoEstado) campoEstado.value = loc.estado || '';

        const campoCidade = document.querySelector('input[name="cidade"]');
        if (campoCidade) campoCidade.value = loc.cidade || '';

        const campoComplemento = document.querySelector('input[name="complemento"]');
        if (campoComplemento) campoComplemento.value = loc.complemento || '';

        const inputFoto = document.getElementById('inputFotoPerfil');
        if (inputFoto) {
            inputFoto.addEventListener('change', (e) => {
                const arquivo = e.target.files[0];
                if (arquivo) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (imgPreview) imgPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(arquivo);
                }
            });
        }

    } catch (erro) {
        console.error('Erro ao carregar perfil:', erro);
    }
}

async function atualizarPerfil(e) {
    e.preventDefault();

    const btn = e.target.querySelector('.botaozao-roxo');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Salvando...';
    }

    const role = getUsuarioRole();
    const endpoint = role === 'PROFISSIONAL' ? '/profissional/update' : '/usuario/update';

    const dados = {
        nome: document.querySelector('input[name="nome"]').value,
        email: document.querySelector('input[name="login"]').value,
        telefone: document.querySelector('input[name="telefone"]').value,
        localizacao: {
            cep: document.querySelector('input[name="cep"]').value,
            rua: document.querySelector('input[name="rua"]').value,
            bairro: document.querySelector('input[name="bairro"]').value,
            numero: document.querySelector('input[name="numero"]').value,
            estado: document.querySelector('input[name="estado"]').value,
            cidade: document.querySelector('input[name="cidade"]').value,
            complemento: document.querySelector('input[name="complemento"]').value
        },
        role: role
    };

    const senha = document.querySelector('input[name="senha"]').value.trim();
    if (senha) {
        dados.senha = senha;
    }

    if (role === 'PROFISSIONAL') {
        const perfilAtual = await buscarMeuPerfil();
        dados.categoria = perfilAtual.categoria;
    }

    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));

    const arquivoFoto = document.getElementById('inputFotoPerfil')?.files[0];
    if (arquivoFoto) {
        formData.append('arquivo', arquivoFoto);
    }

    try {
        await requisicao(endpoint, 'PUT', formData, true);
        alert('Perfil atualizado com sucesso!');
        localStorage.setItem('usuario_nome', dados.nome);
        if (senha) {
            alert('Senha alterada. Faça login novamente.');
            logout();
        } else {
            carregarPerfil();
        }
    } catch (erro) {
        console.error('Erro ao atualizar perfil:', erro);
        alert('Erro ao atualizar perfil.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Salvar Alterações';
        }
    }
}
