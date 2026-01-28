document.addEventListener('DOMContentLoaded', () => {
    carregarMeusPedidos();
    configurarPerfil();
});

function configurarPerfil() {
    const nome = localStorage.getItem('usuario_nome');
    const imagem = localStorage.getItem('usuario_imagem');

    if (nome) {
        const elNome = document.getElementById('nomeUsuarioDisplay');
        if (elNome) elNome.innerText = nome;
    }

    if (imagem && imagem !== 'null' && imagem !== 'undefined') {
        const elAvatar = document.getElementById('imgAvatarLateral');
        if (elAvatar) {
            // Usa URL_API definida em utilidades.js
            elAvatar.src = `${URL_API}/uploads/${imagem}`;
        }
    }
}

async function carregarMeusPedidos() {
    const container = document.getElementById('listaMeusPedidos');
    if (!container) return;

    try {
        const pedidos = await mandarProServidor('/usuario/historico', 'GET');

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding: 40px; color: #666;">
                    <p>Você ainda não tem nenhum projeto publicado.</p>
                </div>`;
            return;
        }

        container.innerHTML = '';

        pedidos.forEach(p => {
            // Verifica status ABERTO para pintar de amarelo
            let classeStatus = 'status-concluido';
            if (p.status === 'ABERTO' || p.status === 'EM_ESPERA' || p.status === 'PENDENTE') {
                classeStatus = 'status-pendente';
            } else if (p.status === 'CANCELADO') {
                classeStatus = 'status-cancelado'; // Se tiver CSS pra isso, senão fica sem cor ou padrão
            }

            const cidade = p.localizacao ? `${p.localizacao.cidade}-${p.localizacao.estado}` : 'Remoto';

            const html = `
                <div class="card-projeto">
                    <div class="topo-card">
                        <span class="titulo-projeto">${p.titulo}</span>
                        <span class="id-projeto">#${p.id}</span>
                    </div>
                    <p class="desc-projeto">${p.descricao}</p>
                    
                    <div class="rodape-card">
                        <span class="status-badge ${classeStatus}">${p.status}</span>
                        <div style="color: #888; font-size: 0.9rem;">
                            <span>📍 ${cidade}</span>
                            <span style="margin-left: 15px;">📂 ${p.categoria}</span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (erro) {
        console.error(erro);
        container.innerHTML = '<p style="text-align:center; color: #ff4d4d;">Erro ao carregar projetos.</p>';
    }
}