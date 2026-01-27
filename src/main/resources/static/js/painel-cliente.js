document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao(); // Bloqueia se não tiver logado
    carregarUsuario();
    listarMeusPedidos();

    // Configura o formulário de criar serviço
    const form = document.getElementById('formNovoTrabalho');
    if (form) {
        form.addEventListener('submit', criarTrabalho);
    }

    // Configura botão de sair
    const btnSair = document.getElementById('btnSair');
    if (btnSair) {
        btnSair.onclick = fazerLogout;
    }
});

// Funções globais para os botões do HTML (onclick="...")
window.abrirModal = function() {
    const modal = document.getElementById('modalNovoPedido');
    if(modal) modal.classList.remove('escondido');
}

window.fecharModal = function() {
    const modal = document.getElementById('modalNovoPedido');
    if(modal) modal.classList.add('escondido');
}

function carregarUsuario() {
    const nome = localStorage.getItem('usuario_nome');
    const display = document.getElementById('nomeUsuarioDisplay');
    if (display && nome) {
        display.innerText = nome;
    }
}

async function listarMeusPedidos() {
    const container = document.getElementById('listaMeusPedidos');
    if (!container) return;

    try {
        console.log('Buscando pedidos do usuário...');
        const pedidos = await enviarRequisicao('/usuario/historico', 'GET');
        console.log('Pedidos recebidos:', pedidos);
        container.innerHTML = '';

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p class="aviso-vazio">Você ainda não solicitou nenhum serviço.</p>';
            return;
        }

        pedidos.forEach(p => {
            const div = document.createElement('div');
            div.className = 'card-pedido';

            const cidade = p.localizacao ? p.localizacao.cidade : 'Local n/a';
            const status = p.status || 'ABERTO';

            div.innerHTML = `
                <div class="info-card">
                    <h3>${p.problema || 'Serviço sem título'}</h3>
                    <p>${p.descricao || ''}</p>
                    <small>📍 ${cidade} | Categoria: ${p.categoria}</small>
                </div>
                <div class="status-card status-${status.toLowerCase()}">
                    ${status}
                </div>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        console.error('Erro ao listar pedidos:', e);
        container.innerHTML = '<p class="erro">Erro ao carregar seus pedidos.</p>';
    }
}

async function criarTrabalho(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Enviando...';

    // Monta o objeto DTO
    const dadosTrabalho = {
        problema: document.getElementById('tituloServico').value,
        descricao: document.getElementById('descServico').value,
        pagamento: parseFloat(document.getElementById('pagamentoServico').value),
        categoria: document.getElementById('categoriaServico').value,
        status: 'ABERTO',
        localizacao: {
            cep: document.getElementById('cepServico').value,
            rua: document.getElementById('ruaServico').value,
            bairro: document.getElementById('bairroServico').value,
            numero: document.getElementById('numeroServico').value,
            cidade: document.getElementById('cidadeServico').value,
            estado: document.getElementById('estadoServico').value,
            complemento: document.getElementById('complementoServico').value
        }
    };

    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(dadosTrabalho)], { type: 'application/json' }));

    const arquivo = document.getElementById('fotoServico').files[0];
    if (arquivo) {
        formData.append('imagen', arquivo);
    }

    try {
        console.log('Enviando trabalho:', dadosTrabalho);
        await enviarRequisicao('/trabalho/form', 'POST', formData, true);
        console.log('Trabalho criado com sucesso!');
        alert('Projeto publicado com sucesso!');
        window.fecharModal();
        e.target.reset();
        listarMeusPedidos();
    } catch (erro) {
        console.error('Erro ao criar trabalho:', erro);
        alert('Erro ao publicar serviço.');
    } finally {
        btn.disabled = false;
        btn.innerText = 'Publicar Agora';
    }
}