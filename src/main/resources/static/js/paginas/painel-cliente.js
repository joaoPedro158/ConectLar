document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarUsuario();
    carregarPedidos();
    carregarContadores();

    const btnSair = document.getElementById('btnSair');
    if (btnSair) btnSair.onclick = logout;
    window.abrirModal = abrirModal;
    window.fecharModal = fecharModal;
    window.abrirModalDetalhes = abrirModalDetalhes;
    window.fecharModalDetalhes = fecharModalDetalhes;

    const formNovoTrabalho = document.getElementById('formNovoTrabalho');
    if (formNovoTrabalho) {
        formNovoTrabalho.addEventListener('submit', enviarNovoTrabalho);
    }
});

function abrirModalDetalhes(pedido) {
    const modal = document.getElementById('modalDetalhesPedido');
    if (!modal) return;

    const loc = pedido && pedido.localizacao ? pedido.localizacao : {};

    const set = (id, valor) => {
        const e = document.getElementById(id);
        if (e) e.value = (valor === null || valor === undefined) ? '' : String(valor);
    };

    set('detalheTitulo', pedido && pedido.problema ? pedido.problema : '');
    set('detalheCategoria', pedido && pedido.categoria ? pedido.categoria : '');
    set('detalhePagamento', pedido && pedido.pagamento !== undefined ? pedido.pagamento : '');
    set('detalheCep', loc.cep || '');
    set('detalheCidade', loc.cidade || '');
    set('detalheEstado', loc.estado || '');
    set('detalheRua', loc.rua || '');
    set('detalheBairro', loc.bairro || '');
    set('detalheNumero', loc.numero || '');
    set('detalheComplemento', loc.complemento || '');

    const descricaoEl = document.getElementById('detalheDescricao');
    if (descricaoEl) descricaoEl.value = pedido && pedido.descricao ? String(pedido.descricao) : '';

    set('detalheStatus', pedido && pedido.status ? String(pedido.status).replace('_', ' ') : '');

    modal.classList.remove('escondido');
}

function fecharModalDetalhes() {
    const modal = document.getElementById('modalDetalhesPedido');
    if (modal) modal.classList.add('escondido');
}

function el(id) {
    return document.getElementById(id);
}

function valor(id) {
    const e = el(id);
    return e ? e.value : '';
}

function resolverSrcFoto(foto) {
    if (!foto) return '/assets/avatar-padrao.png';
    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) return foto;
    return `/upload/${foto}`;
}

function carregarUsuario() {
    const nome = localStorage.getItem('usuario_nome') || 'Cliente';

    const nomeSaudacao = document.getElementById('nomeUsuarioSaudacao');
    if (nomeSaudacao) nomeSaudacao.innerText = nome;

    const foto = localStorage.getItem('usuario_foto');
    const fotoEl = document.getElementById('fotoUsuario');
    if (fotoEl) fotoEl.src = resolverSrcFoto(foto);

    atualizarMeusDados();
}

async function atualizarMeusDados() {
    try {
        const dados = await requisicao('/usuario/meusdados', 'GET');
        if (dados && dados.nome) {
            localStorage.setItem('usuario_nome', dados.nome);
            const nomeSaudacao = document.getElementById('nomeUsuarioSaudacao');
            if (nomeSaudacao) nomeSaudacao.innerText = dados.nome;
        }

        if (dados && dados.fotoPerfil) {
            localStorage.setItem('usuario_foto', dados.fotoPerfil);
            const fotoEl = document.getElementById('fotoUsuario');
            if (fotoEl) fotoEl.src = resolverSrcFoto(dados.fotoPerfil);
        }
    } catch (e) {
    }
}

function formatarMoeda(valor) {
    try {
        return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (e) {
        return 'R$ 0,00';
    }
}

async function carregarContadores() {
    const contadorHistorico = document.getElementById('contadorHistorico');
    const contadorGastoTotal = document.getElementById('contadorGastoTotal');

    try {
        const historico = await requisicao('/usuario/historico', 'GET');
        if (contadorHistorico) contadorHistorico.innerText = Array.isArray(historico) ? String(historico.length) : '0';
    } catch (e) {
        if (contadorHistorico) contadorHistorico.innerText = '0';
    }

    try {
        const total = await requisicao('/usuario/gastoTotal', 'GET');
        if (contadorGastoTotal) contadorGastoTotal.innerText = formatarMoeda(total);
    } catch (e) {
        if (contadorGastoTotal) contadorGastoTotal.innerText = 'R$ 0,00';
    }
}

async function carregarPedidos() {
    let lista = document.getElementById('listaMeusPedidos');
    if (!lista) {
        const secao = document.querySelector('.secao-servicos');
        if (secao) {
            const vazio = secao.querySelector('.empty-state');
            if (vazio) vazio.remove();

            lista = document.createElement('div');
            lista.id = 'listaMeusPedidos';
            lista.className = 'lista-pedidos';
            secao.appendChild(lista);
        }
    }

    if (!lista) return;

    try {
        const servicos = await requisicao('/usuario/historico', 'GET');

        if (!servicos || servicos.length === 0) {
            lista.innerHTML = '<p class="mensagem-vazia">Você ainda não publicou nenhum serviço.</p>';
            return;
        }

        lista.innerHTML = '';

        servicos.forEach(p => {
            const div = document.createElement('div');
            div.className = 'card-pedido';

            const cidade = p.localizacao ? p.localizacao.cidade : (p.cidade || 'Local não inf.');
            const estado = p.localizacao ? p.localizacao.estado : (p.estado || 'RN');
            const statusFormatado = (p.status || 'ABERTO').replace('_', ' ');

            div.innerHTML = `
                <div class="info-card">
                    <h3>${p.problema || 'Sem título'}</h3>
                    <div class="detalhes-card">
                        <span>📍 ${cidade} - ${estado}</span>
                        <span style="color: #00e0ff;">🔧 ${p.categoria || 'Geral'}</span>
                        <span>💰 R$ ${p.pagamento || '0,00'}</span>
                    </div>
                </div>
                <span class="status-badge" style="border-color: #00e0ff; color: #00e0ff;">
                    ${statusFormatado}
                </span>
            `;

            div.style.cursor = 'pointer';
            div.addEventListener('click', () => abrirModalDetalhes(p));
            lista.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar:', error);
        lista.innerHTML = '<p style="color:red">Erro de conexão ao buscar pedidos.</p>';
    }
}

async function enviarNovoTrabalho(e) {
    e.preventDefault();

    const btn = document.querySelector('.botao-criar-projeto');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Enviando...';
    }

    const dadosTrabalho = {
        problema: valor('tituloServico'),
        descricao: valor('descServico'),
        categoria: valor('categoriaServico'),
        status: 'ABERTO',
        pagamento: parseFloat(valor('pagamentoServico')) || 0,
        localizacao: {
            cidade: valor('cidadeServico'),
            estado: valor('estadoServico'),
            rua: valor('ruaServico'),
            bairro: valor('bairroServico'),
            numero: valor('numeroServico'),
            cep: valor('cepServico'),
            complemento: valor('complementoServico')
        }
    };

    const formData = new FormData();
    formData.append('dados', new Blob([JSON.stringify(dadosTrabalho)], { type: 'application/json' }));

    const fileInput = el('fotoServico');
    if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('imagen', fileInput.files[0]);
    }

    try {
        await requisicao('/trabalho/cadastrar', 'POST', formData, true);
        alert('Serviço publicado com sucesso!');
        fecharModal();
        e.target.reset();
        carregarPedidos();
    } catch (error) {
        console.error(error);
        alert('Erro de conexão.');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Publicar Agora';
        }
    }
}

function abrirModal() {
    document.getElementById('modalNovoPedido').classList.remove('escondido');
}

function fecharModal() {
    document.getElementById('modalNovoPedido').classList.add('escondido');
}
