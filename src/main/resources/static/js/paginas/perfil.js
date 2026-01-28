document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarPerfil();

    document.getElementById('btnSair').onclick = logout;
    document.getElementById('formAtualizarPerfil').addEventListener('submit', atualizarPerfil);
});

async function carregarPerfil() {
    const container = document.getElementById('conteudoPerfil');

    try {
        const perfil = await buscarMeuPerfil();

        if (!perfil) {
            container.innerHTML = '<p>Perfil não encontrado.</p>';
            return;
        }

        container.innerHTML = `
            <div class="perfil-header">
                <div class="foto-perfil">
                    <img src="${perfil.fotoPerfil ? '/uploads/' + perfil.fotoPerfil : '/assets/avatar-padrao.png'}" alt="Foto de perfil">
                    <label for="novaFoto" class="botao-trocar-foto">📷 Trocar Foto</label>
                    <input type="file" id="novaFoto" accept="image/*" style="display: none;">
                </div>
                <div class="info-perfil">
                    <h2>${perfil.nome}</h2>
                    <p>📧 ${perfil.email}</p>
                    <p>📱 ${perfil.telefone || 'Não informado'}</p>
                    ${perfil.categoria ? `<p>🔧 ${perfil.categoria}</p>` : ''}
                    <p>📍 ${perfil.localizacao ? `${perfil.localizacao.cidade} - ${perfil.localizacao.estado}` : 'Local não informado'}</p>
                </div>
            </div>

            <div class="formulario-edicao">
                <h3>Editar Dados</h3>
                <form id="formAtualizarPerfil">
                    <div class="campo-form">
                        <label>Nome</label>
                        <input type="text" id="editNome" value="${perfil.nome}" required>
                    </div>
                    <div class="campo-form">
                        <label>Email</label>
                        <input type="email" id="editEmail" value="${perfil.email}" required>
                    </div>
                    <div class="campo-form">
                        <label>Telefone</label>
                        <input type="text" id="editTelefone" value="${perfil.telefone || ''}" placeholder="(00) 00000-0000">
                    </div>
                    <div class="campo-form">
                        <label>Cidade</label>
                        <input type="text" id="editCidade" value="${perfil.localizacao ? perfil.localizacao.cidade : ''}">
                    </div>
                    <div class="campo-form">
                        <label>Estado</label>
                        <input type="text" id="editEstado" value="${perfil.localizacao ? perfil.localizacao.estado : ''}">
                    </div>
                    <button type="submit" class="botao-salvar">Salvar Alterações</button>
                </form>
            </div>
        `;

        document.getElementById('novaFoto').addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            if (arquivo) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = container.querySelector('.foto-perfil img');
                    img.src = e.target.result;
                };
                reader.readAsDataURL(arquivo);
            }
        });

        aplicarMascaraTelefone();

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        container.innerHTML = '<p style="color:red">Erro ao carregar perfil.</p>';
    }
}

async function atualizarPerfil(e) {
    e.preventDefault();

    const btn = e.target.querySelector('.botao-salvar');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    const role = getUsuarioRole();
    const endpoint = role === 'PROFISSIONAL' ? '/profissional/update' : '/usuario/update';

    const dados = {
        nome: document.getElementById('editNome').value,
        email: document.getElementById('editEmail').value,
        telefone: document.getElementById('editTelefone').value,
        localizacao: {
            cidade: document.getElementById('editCidade').value,
            estado: document.getElementById('editEstado').value,
            rua: "Não informado",
            bairro: "Não informado",
            numero: "S/N",
            cep: "00000-000"
        },
        role: role
    };

    if (role === 'PROFISSIONAL') {
        const perfilAtual = await buscarMeuPerfil();
        dados.categoria = perfilAtual.categoria;
    }

    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));

    const arquivoFoto = document.getElementById('novaFoto').files[0];
    if (arquivoFoto) {
        formData.append('arquivo', arquivoFoto);
    }

    try {
        await requisicao(endpoint, 'PUT', formData, true);
        alert('Perfil atualizado com sucesso!');
        localStorage.setItem('usuario_nome', dados.nome);
        carregarPerfil();
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Salvar Alterações';
    }
}

function aplicarMascaraTelefone() {
    const telefone = document.getElementById('editTelefone');
    if (telefone) {
        telefone.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length > 11) valor = valor.slice(0, 11);
            
            if (valor.length > 10) {
                valor = `(${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7)}`;
            } else if (valor.length > 6) {
                valor = `(${valor.slice(0,2)}) ${valor.slice(2,6)}-${valor.slice(6)}`;
            } else if (valor.length > 2) {
                valor = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
            }
            
            e.target.value = valor;
        });
    }
}
