document.addEventListener('DOMContentLoaded', () => {
    carregarDadosUsuario();
    configurarFormulario();
    configurarUploadFoto();
    configurarBotaoSair();
});


async function carregarDadosUsuario() {
    try {
        const dados = await requisicao('/usuario/meusdados', 'GET');

        if (!dados) {
            alert('Erro ao carregar dados do perfil');
            return;
        }


        document.getElementById('editNome').value = dados.nome || '';
        document.getElementById('editTelefone').value = dados.telefone || '';
        document.getElementById('editEmail').value = dados.email || '';


        if (dados.localizacao) {
            document.getElementById('editCep').value = dados.localizacao.cep || '';
            document.getElementById('editRua').value = dados.localizacao.rua || '';
            document.getElementById('editBairro').value = dados.localizacao.bairro || '';
            document.getElementById('editNumero').value = dados.localizacao.numero || '';
            document.getElementById('editEstado').value = dados.localizacao.estado || '';
            document.getElementById('editCidade').value = dados.localizacao.cidade || '';
            document.getElementById('editComplemento').value = dados.localizacao.complemento || '';
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
    const form = document.getElementById('formAtualizarPerfil');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();


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

            const formData = new FormData();


            const dadosBlob = new Blob([JSON.stringify(dadosAtualizados)], {
                type: 'application/json'
            });
            formData.append('dados', dadosBlob);


            const resultado = await requisicao('/usuario/update', 'PUT', formData, true);
            console.log('Resposta do servidor:', resultado);
            alert('Perfil atualizado com sucesso!');


            localStorage.setItem('usuario_nome', dadosAtualizados.nome);

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            alert('Erro ao atualizar perfil. Tente novamente.');
        }
    });
}


function configurarUploadFoto() {
    const inputFoto = document.getElementById('novaFoto');
    const imgPreview = document.getElementById('imgPreview');

    inputFoto.addEventListener('change', async (e) => {
        const arquivo = e.target.files[0];

        if (!arquivo) return;


        if (!arquivo.type.startsWith('image/')) {
            alert('Por favor, selecione apenas imagens');
            return;
        }


        if (arquivo.size > 5 * 1024 * 1024) {
            alert('A imagem deve ter no máximo 5MB');
            return;
        }


        const reader = new FileReader();
        reader.onload = (event) => {
            imgPreview.src = event.target.result;
        };
        reader.readAsDataURL(arquivo);


        try {
            const formData = new FormData();


            formData.append('arquivo', arquivo);


            const resultado = await requisicao('/usuario/update', 'PUT', formData, true);
            alert('Foto atualizada com sucesso!');


            if (resultado.fotoPerfil) {
                localStorage.setItem('usuario_foto', resultado.fotoPerfil);
            }

        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            alert('Erro ao atualizar foto. Tente novamente.');
        }
    });
}


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