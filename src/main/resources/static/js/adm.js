document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    listarUsuarios();

    const formAdm = document.getElementById('formAdmCadastro');
    if (formAdm) {
        formAdm.addEventListener('submit', criarAdm);
    }

    const btnSair = document.getElementById('btnSair');
    if (btnSair) btnSair.onclick = fazerLogout;
});

async function listarUsuarios() {
    const container = document.getElementById('listaUsuariosAdm');
    if(!container) return;

    try {
        const usuarios = await enviarRequisicao('/usuario/list', 'GET');
        container.innerHTML = '';

        usuarios.forEach(u => {
            const linha = document.createElement('div');
            linha.className = 'item-usuario-adm';
            linha.innerHTML = `
                <div class="dados-user">
                    <strong>${u.nome}</strong>
                    <span>${u.email}</span>
                </div>
                <button class="btn-deletar" onclick="excluirUsuario(${u.id})">Excluir</button>
            `;
            container.appendChild(linha);
        });
    } catch (e) {
        container.innerHTML = '<p>Erro ao carregar usuários.</p>';
    }
}

// Global
window.excluirUsuario = async function(id) {
    if (!confirm('ATENÇÃO: Deseja realmente excluir este usuário?')) return;

    try {
        await enviarRequisicao(`/usuario/delete/${id}`, 'DELETE');
        listarUsuarios(); // Atualiza a lista
    } catch (e) {
        alert('Erro ao excluir usuário.');
    }
}

async function criarAdm(e) {
    e.preventDefault();
    const email = document.getElementById('admEmail').value;
    const senha = document.getElementById('admSenha').value;

    try {
        await enviarRequisicao('/adm/cadastrar', 'POST', { email, senha });
        alert('Novo administrador cadastrado com sucesso!');
        e.target.reset();
    } catch (erro) {
        alert('Erro ao cadastrar ADM.');
    }
}