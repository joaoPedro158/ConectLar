document.addEventListener('DOMContentLoaded', () => {
    carregarDadosPerfil();
    configurarFormulario();
    configurarUploadFoto();
});

// Carregar dados do perfil
async function carregarDadosPerfil() {
    try {
        const dados = await requisicao('/profissional/meusdados', 'GET');

        if (!dados) {
            alert('Erro ao carregar dados do perfil');
            return;
        }

        // Preenche os campos do formulário
        const form = document.getElementById('formPerfil');

        form.querySelector('[name="nome"]').value = dados.nome || '';
        form.querySelector('[name="telefone"]').value = dados.telefone || '';
        form.querySelector('[name="login"]').value = dados.email || '';

        // Preenche dados de localização
        if (dados.localizacao) {
            form.querySelector('[name="cep"]').value = dados.localizacao.cep || '';
            form.querySelector('[name="rua"]').value = dados.localizacao.rua || '';
            form.querySelector('[name="bairro"]').value = dados.localizacao.bairro || '';
            form.querySelector('[name="numero"]').value = dados.localizacao.numero || '';
            form.querySelector('[name="estado"]').value = dados.localizacao.estado || '';
            form.querySelector('[name="cidade"]').value = dados.localizacao.cidade || '';
            form.querySelector('[name="complemento"]').value = dados.localizacao.complemento || '';
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
    const form = document.getElementById('formPerfil');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pega os valores diretamente dos inputs
        const dadosAtualizados = {
            nome: form.querySelector('[name="nome"]').value,
            telefone: form.querySelector('[name="telefone"]').value,
            localizacao: {
                cep: form.querySelector('[name="cep"]').value,
                rua: form.querySelector('[name="rua"]').value,
                bairro: form.querySelector('[name="bairro"]').value,
                numero: form.querySelector('[name="numero"]').value,
                estado: form.querySelector('[name="estado"]').value,
                cidade: form.querySelector('[name="cidade"]').value,
                complemento: form.querySelector('[name="complemento"]').value
            }
        };

        // Só envia senha se foi preenchida
        const senha = form.querySelector('[name="senha"]').value;
        if (senha && senha.trim() !== '') {
            dadosAtualizados.senha = senha;
        }

        console.log('Dados que serão enviados:', dadosAtualizados);

        try {
            await requisicao('/profissional/update', 'PUT', dadosAtualizados);
            alert('Perfil atualizado com sucesso!');

            // Atualiza o localStorage
            localStorage.setItem('usuario_nome', dadosAtualizados.nome);

            // Limpa o campo de senha
            form.querySelector('[name="senha"]').value = '';

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    });
}

// Configurar upload de foto
function configurarUploadFoto() {
    const inputFoto = document.getElementById('inputFotoPerfil');
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

        // Upload da foto
        try {
            const formData = new FormData();
            formData.append('foto', arquivo);

            const response = await fetch('http://localhost:8181/profissional/foto', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                const resultado = await response.json();
                alert('Foto atualizada com sucesso!');

                // Atualiza o localStorage
                if (resultado.fotoPerfil) {
                    localStorage.setItem('usuario_foto', resultado.fotoPerfil);
                }
            } else {
                throw new Error('Erro ao fazer upload');
            }

        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            alert('Erro ao atualizar foto. Tente novamente.');
        }
    });
}