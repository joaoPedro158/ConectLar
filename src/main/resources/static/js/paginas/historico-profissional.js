document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarUsuario();
    carregarHistorico();
    carregarContadores();
});

function resolverSrcFoto(foto) {
    if (!foto) return '/assets/avatar-padrao.png';
    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) return foto;
    return `/upload/${foto}`;
}

function carregarUsuario() {
    const nome = localStorage.getItem('usuario_nome') || 'Profissional';
    const nomeEl = document.getElementById('nomeUsuarioSaudacao');
    if (nomeEl) nomeEl.innerText = nome;

    const foto = localStorage.getItem('usuario_foto');
    const fotoEl = document.getElementById('fotoUsuario');
    if (fotoEl) fotoEl.src = resolverSrcFoto(foto);
}

async function carregarHistorico() {
    const container = document.getElementById('listaHistorico');
    if (!container) return;

    try {
        const historico = await requisicao('/profissional/historico', 'GET');
        container.innerHTML = '';

        if (!Array.isArray(historico) || historico.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h2>Nenhum serviço encontrado</h2>
                    <p>Você ainda não realizou nenhum serviço.</p>
                </div>
            `;
            return;
        }

        historico.forEach(trabalho => {
            const card = document.createElement('div');
            card.className = 'card-historico';

            const cidade = trabalho.localizacao ? trabalho.localizacao.cidade : 'Não informada';
            const estado = trabalho.localizacao ? trabalho.localizacao.estado : 'RN';

            card.innerHTML = `
                <div class="historico-cabecalho">
                    <h3>${trabalho.problema || 'Sem título'}</h3>
                    <span class="status-badge status-${trabalho.status?.toLowerCase()}">${trabalho.status?.replace('_', ' ') || 'Desconhecido'}</span>
                </div>
                <div class="historico-corpo">
                    <div class="caixa-descricao">
                        <p class="descricao">${trabalho.descricao || 'Sem descrição'}</p>
                    </div>
                    ${trabalho.imagens && trabalho.imagens.length > 0 ? `
                        <div class="caixa-imagens">
                            <div class="imagens-problema">
                                ${trabalho.imagens.map(img => `
                                    <img src="${img.startsWith('http') || img.startsWith('/') ? img : '/upload/' + img}" alt="Imagem do problema" class="img-problema">
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div class="caixa-detalhes">
                        <div class="detalhes-historico">
                            <span>📍 ${cidade} - ${estado}</span>
                            <span>🔧 ${trabalho.categoria || 'Geral'}</span>
                            <span>💰 R$ ${trabalho.pagamento || '0,00'}</span>
                            ${trabalho.status === 'CONCLUIDO' ? `<span class="lucro">Lucro: R$ ${trabalho.pagamento || '0,00'}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="historico-rodape">
                    <div class="caixa-data">
                        <span class="data">${new Date(trabalho.dataHoraAberta).toLocaleDateString('pt-BR')}</span>
                    </div>
                    ${trabalho.usuarioNome ? `
                        <div class="caixa-cliente">
                            <span class="cliente">Cliente: ${trabalho.usuarioNome}</span>
                        </div>
                    ` : ''}
                </div>
            `;

            container.appendChild(card);
        });
    } catch (erro) {
        console.error('Erro ao carregar histórico:', erro);
        container.innerHTML = '<p style="color:red">Erro ao carregar histórico.</p>';
    }
}

async function carregarContadores() {
    try {
        const dados = await requisicao('/profissional/dadosProfissional', 'GET');

        const total = (dados.pedidosConcluido || 0) + (dados.pedidosAndamento || 0);
        const concluidos = dados.pedidosConcluido || 0;
        const lucro = dados.lucroTotal || 0;
        const media = dados.mediaAvaliacao ? dados.mediaAvaliacao.toFixed(1) : '0.0';

        const totalEl = document.getElementById('total-pedidos');
        const concluidosEl = document.getElementById('pedidos-concluidos');
        const lucroEl = document.getElementById('gasto-total');
        const mediaEl = document.getElementById('avaliacao-media');

        if (totalEl) totalEl.innerText = String(total);
        if (concluidosEl) concluidosEl.innerText = String(concluidos);
        if (lucroEl) lucroEl.innerText = 'R$ ' + lucro.toFixed(2).replace('.', ',');
        if (mediaEl) mediaEl.innerText = media;

        const contadorHistoricoEl = document.getElementById('contadorHistorico');
        const contadorLucroEl = document.getElementById('contadorLucroTotal');
        if (contadorHistoricoEl) contadorHistoricoEl.innerText = String(total);
        if (contadorLucroEl) contadorLucroEl.innerText = 'R$ ' + lucro.toFixed(2).replace('.', ',');
    } catch (erro) {
        console.error('Erro ao carregar contadores:', erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarHistorico();
    carregarContadores();
});