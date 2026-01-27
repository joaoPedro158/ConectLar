<<<<<<< HEAD
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
        const pedidos = await enviarRequisicao('/usuario/historico', 'GET');
        container.innerHTML = ''; // Limpa lista

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p class="aviso-vazio">Você ainda não solicitou nenhum serviço.</p>';
            return;
        }

        pedidos.forEach(p => {
            const div = document.createElement('div');
            div.className = 'card-pedido'; // Garanta que essa classe existe no CSS

            // Tratamento de segurança para campos nulos
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
=======
const URL_API = ''; // Vazio para usar URL relativa (http://localhost:8181)
const token = localStorage.getItem('token');

// 1. SEGURANÇA: Se não tem token, chuta pro login
if (!token) {
    window.location.href = '/login';
}

const headersAuth = {
    'Authorization': `Bearer ${token}`
};

// 2. INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', () => {
    carregarUsuario();
    carregarMeusPedidos();

    // Configura botão sair
    document.getElementById('btnSair').onclick = () => {
        localStorage.clear();
        window.location.href = '/login';
    };
});

// Funções do Modal
window.abrirModal = () => document.getElementById('modalNovoPedido').classList.remove('escondido');
window.fecharModal = () => document.getElementById('modalNovoPedido').classList.add('escondido');

function carregarUsuario() {
    const nome = localStorage.getItem('usuario_nome') || 'Cliente';
    document.getElementById('nomeUsuarioDisplay').innerText = nome;
}

// 3. LISTAR PEDIDOS (GET /usuario/historico)
async function carregarMeusPedidos() {
    const lista = document.getElementById('listaMeusPedidos');

    try {
        const response = await fetch(`${URL_API}/usuario/historico`, {
            headers: headersAuth
        });

        if (response.status === 401 || response.status === 403) {
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = '/login';
            return;
        }

        if (response.ok) {
            const pedidos = await response.json();
            lista.innerHTML = '';

            if (pedidos.length === 0) {
                lista.innerHTML = '<p class="mensagem-vazia">Você ainda não publicou nenhum serviço.</p>';
                return;
            }

            pedidos.forEach(p => {
                const div = document.createElement('div');
                div.className = 'card-pedido';

                // Tratamento seguro de nulos para localização
                const cidade = p.localizacao ? p.localizacao.cidade : (p.cidade || 'Local não inf.');
                const estado = p.localizacao ? p.localizacao.estado : (p.estado || 'RN');
                const statusFormatado = (p.status || 'ABERTO').replace('_', ' ');

                div.innerHTML = `
                    <div class="info-card">
                        <h3>${p.titulo}</h3>
                        <div class="detalhes-card">
                            <span>📍 ${cidade} - ${estado}</span>
                            <span style="color: #00e0ff;">🔧 ${p.categoria}</span>
                        </div>
                    </div>
                    <span class="status-badge status-concluido" style="border-color: #00e0ff; color: #00e0ff;">
                        ${statusFormatado}
                    </span>
                `;
                lista.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar:', error);
        lista.innerHTML = '<p style="color:red">Erro de conexão ao buscar pedidos.</p>';
    }
}

// 4. CADASTRAR NOVO PEDIDO (POST /trabalho/cadastrar)
document.getElementById('formNovoTrabalho').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.querySelector('.botao-criar-projeto');
    btn.disabled = true;
    btn.innerText = 'Enviando...';

    // MONTAGEM DO JSON (DTO) IGUAL AO BACKEND
    const dadosTrabalho = {
        titulo: document.getElementById('tituloServico').value,
        descricao: document.getElementById('descServico').value,
        categoria: document.getElementById('categoriaServico').value,

        // IMPORTANTE: O Java espera "ABERTO", não "DISPONIVEL"
        status: 'ABERTO',

        // Objeto LocalizacaoRecord aninhado
        localizacao: {
            cidade: document.getElementById('cidadeServico').value,
            estado: document.getElementById('estadoServico').value,
            rua: "Não informado", // Valores padrão pra não quebrar se o DTO exigir
            bairro: "Não informado",
            numero: "S/N",
            cep: "00000-000"
>>>>>>> carlos
        }
    };

    const formData = new FormData();
<<<<<<< HEAD
    formData.append('dados', new Blob([JSON.stringify(dadosTrabalho)], { type: 'application/json' }));

    const arquivo = document.getElementById('fotoServico').files[0];
    if (arquivo) {
        formData.append('imagen', arquivo);
    }

    try {
        await enviarRequisicao('/trabalho/cadastrar', 'POST', formData, true);
        alert('Projeto publicado com sucesso!');
        window.fecharModal();
        e.target.reset();
        listarMeusPedidos(); // Recarrega a lista
    } catch (erro) {
        alert('Erro ao publicar serviço.');
=======
    // O Spring espera a parte 'dados' como application/json
    formData.append('dados', new Blob([JSON.stringify(dadosTrabalho)], { type: 'application/json' }));

    // O Spring espera a parte 'arquivo' (opcional)
    const fileInput = document.getElementById('fotoServico');
    if (fileInput.files[0]) {
        formData.append('arquivo', fileInput.files[0]);
    }

    try {
        const response = await fetch(`${URL_API}/trabalho/cadastrar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // NÃO adicione Content-Type aqui, o browser define multipart/form-data sozinho
            },
            body: formData
        });

        if (response.ok) {
            alert('Serviço publicado com sucesso!');
            fecharModal();
            e.target.reset();
            carregarMeusPedidos();
        } else {
            // Se der erro, tenta ler a mensagem do backend
            const erroMsg = await response.text();
            console.error('Erro Backend:', erroMsg);
            alert('Erro ao cadastrar. Verifique os campos.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
>>>>>>> carlos
    } finally {
        btn.disabled = false;
        btn.innerText = 'Publicar Agora';
    }
<<<<<<< HEAD
}
=======
});
>>>>>>> carlos
