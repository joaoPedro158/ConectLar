document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarUsuario();
    carregarContadorHistorico();
    carregarLucroTotal();
    carregarNotificacoes();
    carregarTrabalhos();

    setInterval(carregarNotificacoes, 12000);
});

window.buscarVagas = async function() {
    const termo = document.getElementById('campoBusca')?.value?.trim().toLowerCase();
    const container = document.getElementById('listaTrabalhos');
    if (!container) return;

    try {
        const trabalhos = await requisicao('/trabalho/list', 'GET');
        container.innerHTML = '';

        if (!trabalhos || trabalhos.length === 0) {
            container.innerHTML = '<p class="mensagem-vazia">Nenhum trabalho encontrado.</p>';
            return;
        }

        const filtrados = trabalhos.filter(t => {
            if (t.status !== 'ABERTO') return false;
            if (!termo) return true;
            const titulo = (t.problema || '').toLowerCase();
            const desc = (t.descricao || '').toLowerCase();
            const cat = (t.categoria || '').toLowerCase();
            const cidade = (t.localizacao?.cidade || '').toLowerCase();
            return titulo.includes(termo) || desc.includes(termo) || cat.includes(termo) || cidade.includes(termo);
        });

        if (filtrados.length === 0) {
            container.innerHTML = '<p class="mensagem-vazia">Nenhum trabalho encontrado para este termo.</p>';
            return;
        }

        filtrados.forEach(trabalho => {
            const card = document.createElement('div');
            card.className = 'card-pedido';
            card.style.cursor = 'pointer';
            card.onclick = () => abrirModalDetalhesTrabalho(trabalho);

            const cidade = trabalho.localizacao ? trabalho.localizacao.cidade : 'Não informada';
            const estado = trabalho.localizacao ? trabalho.localizacao.estado : 'RN';
            const corStatus = getStatusColor(trabalho.status);
            const textoStatus = getStatusText(trabalho.status);

            let botoesAcao = '';
            
            if (trabalho.status === 'ABERTO') {
                botoesAcao = `
                    <div class="botoes-card">
                        <button class="botao-aceitar" onclick="candidatar(${trabalho.id})">Candidatar</button>
                    </div>
                `;
            } else if (trabalho.status === 'EM_ESPERA' && trabalho.profissionalId == idUsuarioLogado) {
                botoesAcao = `
                    <div class="botoes-card">
                        <button class="botao-cancelar" onclick="cancelarCandidatura(${trabalho.id})">Cancelar Candidatura</button>
                    </div>
                `;
            } else if (trabalho.status === 'EM_ANDAMENTO' && trabalho.profissionalId == idUsuarioLogado) {
                botoesAcao = `
                    <div class="botoes-card">
                        <button class="botao-cancelar" onclick="cancelarTrabalho(${trabalho.id})">Cancelar Trabalho</button>
                    </div>
                `;
            } else if (trabalho.status === 'CONCLUIDO' && trabalho.profissionalId == idUsuarioLogado) {
                botoesAcao = `
                    <div class="valor-recebido">
                        <span style="color: #4caf50; font-weight: 700;">💰 Valor recebido: R$ ${trabalho.pagamento || '0'}</span>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="info-card">
                    <h3>${trabalho.problema || 'Sem título'}</h3>
                    <div class="detalhes-card">
                        <span>📍 ${cidade} - ${estado}</span>
                        <span style="color: #00e0ff;">🔧 ${trabalho.categoria || 'Geral'}</span>
                        <span>💰 R$ ${trabalho.pagamento || '0'}</span>
                    </div>
                    ${trabalho.clienteNome ? `<div class="cliente-nome">Cliente: ${trabalho.clienteNome}</div>` : ''}
                </div>
                <span class="status-badge" style="border-color: ${corStatus}; color: ${corStatus};">
                    ${textoStatus}
                </span>
                ${botoesAcao}
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao buscar trabalhos:', error);
        container.innerHTML = '<p style="color:red">Erro ao buscar trabalhos.</p>';
    }
};

window.cancelarTrabalho = async function(idTrabalho) {
    if (!confirm('Tem certeza que deseja cancelar este trabalho?')) return;
    try {
        await requisicao(`/trabalho/${idTrabalho}/cancelar`, 'POST');
        alert('Trabalho cancelado.');
        carregarTrabalhos();
    } catch (error) {
        console.error('Erro ao cancelar:', error);
        alert('Erro ao cancelar trabalho.');
    }
};

function getStatusColor(status) {
    switch (status) {
        case 'ABERTO': return '#00e0ff';
        case 'EM_ESPERA': return '#ffa500';
        case 'EM_ANDAMENTO': return '#4caf50';
        case 'CONCLUIDO': return '#9c27b0';
        case 'CANCELADO': return '#f44336';
        default: return '#666';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'ABERTO': return 'ABERTO';
        case 'EM_ESPERA': return 'EM ESPERA';
        case 'EM_ANDAMENTO': return 'EM ANDAMENTO';
        case 'CONCLUIDO': return 'CONCLUIDO';
        case 'CANCELADO': return 'CANCELADO';
        default: return status;
    }
}

window.abrirModalDetalhesTrabalho = function(trabalho) {
    const modal = document.getElementById('modalDetalhesTrabalho');
    if (!modal) return;

    const loc = trabalho && trabalho.localizacao ? trabalho.localizacao : {};

    const set = (id, valor) => {
        const e = document.getElementById(id);
        if (e) e.value = (valor === null || valor === undefined) ? '' : String(valor);
    };

    set('detalheTitulo', trabalho && trabalho.problema ? trabalho.problema : '');
    set('detalheCategoria', trabalho && trabalho.categoria ? trabalho.categoria : '');
    set('detalhePagamento', trabalho && trabalho.pagamento !== undefined ? trabalho.pagamento : '');
    set('detalheCep', loc.cep || '');
    set('detalheCidade', loc.cidade || '');
    set('detalheEstado', loc.estado || '');
    set('detalheRua', loc.rua || '');
    set('detalheBairro', loc.bairro || '');
    set('detalheNumero', loc.numero || '');
    set('detalheComplemento', loc.complemento || '');

    const descricaoEl = document.getElementById('detalheDescricao');
    if (descricaoEl) descricaoEl.value = trabalho && trabalho.descricao ? String(trabalho.descricao) : '';

    set('detalheStatus', trabalho && trabalho.status ? String(trabalho.status).replace('_', ' ') : '');

    const imagensEl = document.getElementById('detalheImagens');
    if (imagensEl) {
        if (trabalho && trabalho.imagens && trabalho.imagens.length > 0) {
            imagensEl.innerHTML = `
                <div class="imagens-problema">
                    ${trabalho.imagens.map((img, index) => `
                        <div style="text-align: center;">
                            <img src="${img.startsWith('http') || img.startsWith('/') ? img : '/upload/' + img}" 
                                 alt="Imagem do problema" 
                                 class="img-problema"
                                 onclick="abrirImagemTelaCheia('${img.startsWith('http') || img.startsWith('/') ? img : '/upload/' + img}')">
                            <br>
                            <button class="botao-visualizar" onclick="abrirImagemTelaCheia('${img.startsWith('http') || img.startsWith('/') ? img : '/upload/' + img}')">
                                Visualizar
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            imagensEl.innerHTML = '<p style="color:#888;font-size:0.9rem;">Nenhuma imagem anexada.</p>';
        }
    }

    modal.classList.remove('escondido');
};

window.fecharModalDetalhesTrabalho = function() {
    const modal = document.getElementById('modalDetalhesTrabalho');
    if (modal) modal.classList.add('escondido');
};

window.abrirImagemTelaCheia = function(src) {
    const janela = window.open('', '_blank');
    janela.document.write(`
        <html>
            <head>
                <title>Imagem em Tela Cheia</title>
                <style>
                    body { 
                        margin: 0; 
                        padding: 20px; 
                        background: #000; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        min-height: 100vh;
                        flex-direction: column;
                    }
                    img { 
                        max-width: 100%; 
                        max-height: 90vh; 
                        object-fit: contain;
                        border-radius: 8px;
                    }
                    button {
                        margin-top: 20px;
                        padding: 10px 20px;
                        background: #00e0ff;
                        color: #000;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 600;
                    }
                    button:hover {
                        background: #33ebff;
                    }
                </style>
            </head>
            <body>
                <img src="${src}" alt="Imagem do problema">
                <button onclick="window.close()">Fechar</button>
            </body>
        </html>
    `);
    janela.document.close();
};

function resolverSrcFoto(foto) {
    if (!foto) return '/assets/avatar-padrao.png';
    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) return foto;
    return `/upload/${foto}`;
}

async function carregarNotificacoes() {
    const pendentesEl = document.getElementById('notificacoesPendentes');
    const aceitasEl = document.getElementById('notificacoesAceitas');
    if (!pendentesEl && !aceitasEl) return;

    try {
        const historico = await requisicao('/profissional/historico', 'GET');
        const lista = Array.isArray(historico) ? historico : [];

        const pendentes = lista.filter(t => t && t.status === 'EM_ESPERA').length;
        const aceitas = lista.filter(t => t && t.status === 'EM_ANDAMENTO').length;

        if (pendentesEl) pendentesEl.innerText = String(pendentes);
        if (aceitasEl) aceitasEl.innerText = String(aceitas);
    } catch (e) {
        if (pendentesEl) pendentesEl.innerText = '0';
        if (aceitasEl) aceitasEl.innerText = '0';
    }
}

function carregarUsuario() {
    const nome = localStorage.getItem('usuario_nome') || 'Profissional';
    const nomeEl = document.getElementById('nomeUsuarioSaudacao');
    if (nomeEl) nomeEl.innerText = nome;

    const foto = localStorage.getItem('usuario_foto');
    const fotoEl = document.getElementById('fotoUsuario');
    if (fotoEl) fotoEl.src = resolverSrcFoto(foto);

    atualizarMeusDados();
}

async function atualizarMeusDados() {
    try {
        const dados = await requisicao('/profissional/meusdados', 'GET');
        if (dados && dados.nome) {
            localStorage.setItem('usuario_nome', dados.nome);
            const nomeEl = document.getElementById('nomeUsuarioSaudacao');
            if (nomeEl) nomeEl.innerText = dados.nome;
        }

        if (dados && dados.fotoPerfil) {
            localStorage.setItem('usuario_foto', dados.fotoPerfil);
            const fotoEl = document.getElementById('fotoUsuario');
            if (fotoEl) fotoEl.src = resolverSrcFoto(dados.fotoPerfil);
        }
    } catch (e) {
    }
}

async function carregarContadorHistorico() {
    const contador = document.getElementById('contadorHistorico');
    if (!contador) return;

    try {
        const historico = await requisicao('/profissional/historico', 'GET');
        contador.innerText = Array.isArray(historico) ? String(historico.length) : '0';
    } catch (e) {
        contador.innerText = '0';
    }
}

async function carregarLucroTotal() {
    const contador = document.getElementById('contadorLucroTotal');
    if (!contador) return;

    try {
        const historico = await requisicao('/profissional/historico', 'GET');
        if (!Array.isArray(historico)) {
            contador.innerText = 'R$ 0,00';
            return;
        }
        const lucro = historico
            .filter(t => t && t.status === 'CONCLUIDO' && t.pagamento)
            .reduce((sum, t) => sum + Number(t.pagamento), 0);
        contador.innerText = 'R$ ' + lucro.toFixed(2).replace('.', ',');
    } catch (e) {
        contador.innerText = 'R$ 0,00';
    }
}

async function carregarTrabalhos() {
    const container = document.getElementById('listaTrabalhos');

    try {
        const trabalhos = await requisicao('/trabalho/list', 'GET');
        container.innerHTML = '';

        if (!trabalhos || trabalhos.length === 0) {
            container.innerHTML = '<p class="mensagem-vazia">Nenhum trabalho disponível no momento.</p>';
            return;
        }

        trabalhos.forEach(trabalho => {
            if (trabalho.status !== 'ABERTO') return;

            const card = document.createElement('div');
            card.className = 'card-trabalho';
            card.style.cursor = 'pointer';
            card.onclick = () => abrirModalDetalhesTrabalho(trabalho);

            const cidade = trabalho.localizacao ? trabalho.localizacao.cidade : 'Não informada';
            const estado = trabalho.localizacao ? trabalho.localizacao.estado : 'RN';

            card.innerHTML = `
                <div class="info-trabalho">
                    <h3>${trabalho.problema || 'Sem título'}</h3>
                    <p class="descricao">${trabalho.descricao || 'Sem descrição'}</p>
                    <div class="detalhes">
                        <span>📍 ${cidade} - ${estado}</span>
                        <span>🔧 ${trabalho.categoria || 'Geral'}</span>
                        <span>💰 R$ ${trabalho.pagamento || '0,00'}</span>
                    </div>
                </div>
                <div class="acoes">
                    <button class="btn-solicitar" onclick="event.stopPropagation(); candidatar(${trabalho.id}, this)">
                        Candidatar-se
                    </button>
                    <button class="btn-cancelar" onclick="event.stopPropagation(); cancelarCandidatura(${trabalho.id}, this)">
                        Cancelar
                    </button>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar trabalhos:', error);
        container.innerHTML = '<p style="color:red">Erro ao carregar trabalhos.</p>';
    }
}

window.candidatar = async function(idTrabalho, botao) {
    if (botao.disabled) return;

    botao.disabled = true;
    botao.innerText = 'Processando...';

    try {
        await requisicao(`/trabalho/${idTrabalho}/candidatar`, 'POST');
        botao.innerText = 'Candidatura Enviada!';
        botao.style.backgroundColor = '#00875f';
    } catch (error) {
        console.error('Erro ao candidatar:', error);
        botao.innerText = 'Erro ao candidatar';
        botao.style.backgroundColor = '#ff6b6b';
        
        setTimeout(() => {
            botao.innerText = 'Candidatar-se';
            botao.style.backgroundColor = '';
            botao.disabled = false;
        }, 3000);
    }
};
