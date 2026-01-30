document.addEventListener('DOMContentLoaded', () => {
    carregarDadosUsuario();
    configurarFormulario();
    configurarUploadFoto();
    configurarBotaoSair();
});

// Carregar dados do usuário
async function carregarDadosUsuario() {
    try {
        const dados = await requisicao('/usuario/meusdados', 'GET');

        if (!dados) {
            alert('Erro ao carregar dados do perfil');
            return;
        }

        // Preenche os campos do formulário
        document.getElementById('editNome').value = dados.nome || '';
        document.getElementById('editTelefone').value = dados.telefone || '';
        document.getElementById('editEmail').value = dados.email || '';

        // Preenche dados de localização
        if (dados.localizacao) {
            document.getElementById('editCep').value = dados.localizacao.cep || '';
            document.getElementById('editRua').value = dados.localizacao.rua || '';
            document.getElementById('editBairro').value = dados.localizacao.bairro || '';
            document.getElementById('editNumero').value = dados.localizacao.numero || '';
            document.getElementById('editEstado').value = dados.localizacao.estado || '';
            document.getElementById('editCidade').value = dados.localizacao.cidade || '';
            document.getElementById('editComplemento').value = dados.localizacao.complemento || '';
        }

        // Carrega a foto de perfil
        if (dados.fotoPerfil) {
            const imgPreview = document.getElementById('imgPreview');
            const srcFoto = dados.fotoPerfil.startsWith('http') || dados.fotoPerfil.startsWith('/')
                ? dados.fotoPerfil
                : `/upload/${dados.fotoPerfil}`;
            imgPreview.src = srcFoto;
        }

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Erro ao carregar dados do perfil');
    }
}

// Configurar envio do formulário
function configurarFormulario() {
    const form = document.getElementById('formAtualizarPerfil');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega os valores diretamente dos inputs
        const nome = document.getElementById('editNome').value;
        const telefone = document.getElementById('editTelefone').value;
        const cep = document.getElementById('editCep').value;
        const rua = document.getElementById('editRua').value;
        const bairro = document.getElementById('editBairro').value;
        const numero = document.getElementById('editNumero').value;
        const estado = document.getElementById('editEstado').value;
        const cidade = document.getElementById('editCidade').value;
        const complemento = document.getElementById('editComplemento').value;

        const dadosAtualizados = {
            nome: nome,
            telefone: telefone,
            localizacao: {
                cep: cep,
                rua: rua,
                bairro: bairro,
                numero: numero,
                estado: estado,
                cidade: cidade,
                complemento: complemento
            }
        };

        try {
            // Cria FormData para enviar como multipart/form-data
            const formData = new FormData();

            // Adiciona os dados como JSON em um Blob
            const dadosBlob = new Blob([JSON.stringify(dadosAtualizados)], {
                type: 'application/json'
            });
            formData.append('dados', dadosBlob);

            // Envia usando requisicao com multipart=true
            const resultado = await requisicao('/usuario/update', 'PUT', formData, true);
            console.log('Resposta do servidor:', resultado);
            alert('Perfil atualizado com sucesso!');

            // Atualiza o localStorage
            localStorage.setItem('usuario_nome', dadosAtualizados.nome);

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    });
}

// Configurar upload de foto
function configurarUploadFoto() {
    const inputFoto = document.getElementById('novaFoto');
    const imgPreview = document.getElementById('imgPreview');

    inputFoto.addEventListener('change', async (e) => {
        const arquivo = e.target.files[0];

        if (!arquivo) return;

        // Validação de tipo de arquivo
        if (!arquivo.type.startsWith('image/')) {
            alert('Por favor, selecione apenas imagens');
            return;
        }

        // Validação de tamanho (max 5MB)
        if (arquivo.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB');
            return;
        }

        // Preview da imagem
        const reader = new FileReader();
        reader.onload = (event) => {
            imgPreview.src = event.target.result;
        };
        reader.readAsDataURL(arquivo);

        // Upload da foto usando a mesma rota de atualização
        try {
            const formData = new FormData();

            // Adiciona apenas o arquivo (sem os outros dados)
            formData.append('arquivo', arquivo);

            // Envia usando requisicao com multipart=true
            const resultado = await requisicao('/usuario/update', 'PUT', formData, true);
            alert('Foto atualizada com sucesso!');

            // Atualiza o localStorage
            if (resultado.fotoPerfil) {
                localStorage.setItem('usuario_foto', resultado.fotoPerfil);
            }

        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            alert('Erro ao atualizar foto. Tente novamente.');
        }
    });
}

// Configurar botão de sair
function configurarBotaoSair() {
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.addEventListener('click', () => {
            if (confirm('Deseja realmente sair?')) {
                logout();
            }
        });
    }
}