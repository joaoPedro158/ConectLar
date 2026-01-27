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
                    <span class="role-badge">${u.role || 'USUARIO'}</span>
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
        listarUsuarios();
    } catch (e) {
        alert('Erro ao excluir usuário.');
    }
}

async function criarAdm(e) {
    e.preventDefault();
    const email = document.getElementById('admEmail').value;
    const senha = document.getElementById('admSenha').value;

    try {
        await enviarRequisicao('/adm/form', 'POST', { email, senha, role: 'ADMIN' });
        alert('Novo administrador cadastrado com sucesso!');
        e.target.reset();
        listarAdms();
    } catch (erro) {
        alert('Erro ao cadastrar ADM.');
    }
}

async function listarAdms() {
    const container = document.getElementById('listaAdms');
    if (!container) return;

    try {
        const adms = await enviarRequisicao('/adm/list', 'GET');
        container.innerHTML = '';

        adms.forEach(a => {
            const linha = document.createElement('div');
            linha.className = 'item-adm';
            linha.innerHTML = `
                <div class="dados-adm">
                    <strong>${a.nome}</strong>
                    <span>${a.email}</span>
                </div>
                <button class="btn-deletar" onclick="excluirAdm(${a.id})">Excluir</button>
            `;
            container.appendChild(linha);
        });
    } catch (e) {
        container.innerHTML = '<p>Erro ao carregar administradores.</p>';
    }
}

window.excluirAdm = async function(id) {
    if (!confirm('ATENÇÃO: Deseja realmente excluir este administrador?')) return;

    try {
        await enviarRequisicao(`/adm/delete/${id}`, 'DELETE');
        listarAdms();
    } catch (e) {
        alert('Erro ao excluir administrador.');
    }
}