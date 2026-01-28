document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    listarUsuarios();

    const formAdm = document.getElementById('formAdmCadastro');
    if (formAdm) {
        formAdm.addEventListener('submit', criarAdm);
    }

    const btnSair = document.getElementById('btnSair');
    if (btnSair) btnSair.onclick = logout;
});

async function listarUsuarios() {
    const container = document.getElementById('listaUsuariosAdm');
    if (!container) return;

    try {
        const usuarios = await requisicao('/usuario/list', 'GET');
        container.innerHTML = '';

        if (!usuarios || usuarios.length === 0) {
            container.innerHTML = '<p>Nenhum usuário encontrado.</p>';
            return;
        }

        usuarios.forEach(u => {
            const linha = document.createElement('div');
            linha.className = 'item-usuario-adm';
            linha.innerHTML = `
                <div class="dados-user">
                    <strong>${u.nome}</strong>
                    <span>${u.email}</span>
                    <span class="role-badge">${u.role}</span>
                </div>
                <button class="btn-deletar" onclick="excluirUsuario(${u.id})">Excluir</button>
            `;
            container.appendChild(linha);
        });
    } catch (e) {
        container.innerHTML = '<p>Erro ao carregar usuários.</p>';
    }
}

window.excluirUsuario = async function(id) {
    if (!confirm('ATENÇÃO: Deseja realmente excluir este usuário?')) return;

    try {
        await requisicao(`/usuario/delete/${id}`, 'DELETE');
        listarUsuarios();
    } catch (e) {
        alert('Erro ao excluir usuário.');
    }
}

async function criarAdm(e) {
    e.preventDefault();
    const email = document.getElementById('admEmail').value;
    const senha = document.getElementById('admSenha').value;

    const dados = {
        nome: email.split('@')[0],
        email: email,
        senha: senha,
        role: 'ADM'
    };

    try {
        await requisicao('/adm/cadastrar', 'POST', dados);
        alert('Novo administrador cadastrado com sucesso!');
        e.target.reset();
    } catch (erro) {
        alert('Erro ao cadastrar ADM.');
    }
}
