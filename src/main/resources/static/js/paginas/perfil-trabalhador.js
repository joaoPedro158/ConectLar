document.addEventListener('DOMContentLoaded', () => {
    carregarDadosPerfil();
    configurarFormulario();
    configurarUploadFoto();
});


async function carregarDadosPerfil() {
    try {
        const dados = await requisicao('/profissional/meusdados', 'GET');

        if (!dados) {
            alert('Erro ao carregar dados do perfil');
            return;
        }


        const form = document.getElementById('formPerfil');

        form.querySelector('[name="nome"]').value = dados.nome || '';
        form.querySelector('[name="telefone"]').value = dados.telefone || '';
        form.querySelector('[name="login"]').value = dados.email || '';


        if (dados.localizacao) {
            form.querySelector('[name="cep"]').value = dados.localizacao.cep || '';
            form.querySelector('[name="rua"]').value = dados.localizacao.rua || '';
            form.querySelector('[name="bairro"]').value = dados.localizacao.bairro || '';
            form.querySelector('[name="numero"]').value = dados.localizacao.numero || '';
            form.querySelector('[name="estado"]').value = dados.localizacao.estado || '';
            form.querySelector('[name="cidade"]').value = dados.localizacao.cidade || '';
            form.querySelector('[name="complemento"]').value = dados.localizacao.complemento || '';
        }


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


function configurarFormulario() {
    const form = document.getElementById('formPerfil');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('=== INÍCIO DO SUBMIT ===');

        // Pega os valores diretamente dos inputs
        const nome = form.querySelector('[name="nome"]').value;
        const telefone = form.querySelector('[name="telefone"]').value;
        const cep = form.querySelector('[name="cep"]').value;
        const rua = form.querySelector('[name="rua"]').value;
        const bairro = form.querySelector('[name="bairro"]').value;
        const numero = form.querySelector('[name="numero"]').value;
        const estado = form.querySelector('[name="estado"]').value;
        const cidade = form.querySelector('[name="cidade"]').value;
        const complemento = form.querySelector('[name="complemento"]').value;
        const senha = form.querySelector('[name="senha"]').value;

        console.log('Nome digitado:', nome);
        console.log('Telefone digitado:', telefone);

        const dadosAtualizados = {
            email: form.querySelector('[name="login"]').value, // Adiciona o email
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


        if (senha && senha.trim() !== '') {
            dadosAtualizados.senha = senha;
        }

        console.log('Dados que serão enviados:', JSON.stringify(dadosAtualizados, null, 2));

        try {

            const formData = new FormData();


            const dadosBlob = new Blob([JSON.stringify(dadosAtualizados)], {
                type: 'application/json'
            });
            formData.append('dados', dadosBlob);


            const resultado = await requisicao('/profissional/update', 'PUT', formData, true);
            console.log('Resposta do servidor:', resultado);
            alert('Perfil atualizado com sucesso!');


            localStorage.setItem('usuario_nome', dadosAtualizados.nome);


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

        // Upload da foto usando a mesma rota de atualização
        try {
            const formData = new FormData();

            // Adiciona apenas o arquivo (sem os outros dados)
            formData.append('arquivo', arquivo);

            // Envia usando requisicao com multipart=true
            const resultado = await requisicao('/profissional/update', 'PUT', formData, true);
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