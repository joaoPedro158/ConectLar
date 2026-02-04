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

    const cepInput = document.getElementById('cepServico');
    if (cepInput) {
        cepInput.addEventListener('blur', buscarEnderecoPorCep);
        cepInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '')
                .replace(/^(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{3})\d+?$/, '$1');
        });
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

    const imagensEl = document.getElementById('detalheImagens');
    if (imagensEl) {
        if (pedido && pedido.imagens && pedido.imagens.length > 0) {
            imagensEl.innerHTML = `
                <div class="imagens-problema">
                    ${pedido.imagens.map(img => `
                        <img src="${img.startsWith('http') || img.startsWith('/') ? img : '/upload/' + img}" alt="Imagem do problema" class="img-problema">
                    `).join('')}
                </div>
            `;
        } else {
            imagensEl.innerHTML = '<p style="color:#888;font-size:0.9rem;">Nenhuma imagem anexada.</p>';
        }
    }

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
    try {
        const servicos = await requisicao('/usuario/historico', 'GET');
        renderizarListaTrabalhos(servicos);
    } catch (error) {
        console.error('Erro ao carregar:', error);
        const lista = document.getElementById('listaMeusPedidos');
        if(lista) lista.innerHTML = '<p style="color:red">Erro ao buscar seus pedidos.</p>';
    }
}

window.responderSolicitacao = async function(idTrabalho, resposta) {
    try {
        const endpoint = `/trabalho/${idTrabalho}/responder`;
        const response = await requisicao(endpoint, 'POST', String(resposta));
        if (response) {
            alert(resposta ? 'Trabalho aceito com sucesso!' : 'Trabalho recusado com sucesso!');
            carregarPedidos();
        }
    } catch (error) {
        console.error('Erro ao responder solicitação:', error);
        alert('Erro ao processar solicitação. Tente novamente.');
    }
};

async function carregarPedidos() {
    try {
        const servicos = await requisicao('/usuario/historico', 'GET');
        const servicosAtivos = servicos.filter(servico => servico.status !== 'CONCLUIDO');
        renderizarListaTrabalhos(servicosAtivos);
    } catch (error) {
        console.error('Erro ao carregar:', error);
        const lista = document.getElementById('listaMeusPedidos');
        if(lista) lista.innerHTML = '<p style="color:red">Erro de conexão ao buscar pedidos.</p>';
    }
}

window.cancelarTrabalho = async function(idTrabalho) {
    try {
        const response = await requisicao(`/trabalho/${idTrabalho}/cancelar`, 'POST');
        
        if (response) {
            alert('Trabalho cancelado com sucesso!');
            carregarPedidos();
        }
    } catch (error) {
        console.error('Erro ao cancelar trabalho:', error);
        alert('Erro ao cancelar trabalho. Tente novamente.');
    }
};

async function enviarNovoTrabalho(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.botao-criar-projeto');
    if (btn) {
        btn.disabled = true;
        btn.innerText = 'Publicando...';
    }

    const titulo = valor('tituloServico').trim();
    const descricao = valor('descServico').trim();

    if (!titulo) {
        alert('Preencha o título do serviço.');
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Publicar Agora';
        }
        return;
    }

    if (descricao.length < 10) {
        alert('A descrição deve ter pelo menos 10 caracteres.');
        if (btn) {
            btn.disabled = false;
            btn.innerText = 'Publicar Agora';
        }
        return;
    }

    const dadosTrabalho = {
        problema: titulo,
        descricao: descricao,
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
        alert('Erro ao publicar: ' + (error.message || 'Verifique os campos e tente novamente.'));
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


async function buscarDadosProfissional(idProfissional) {
    try {
        const dadosPerfil = await requisicao('/profissional/meusdados', 'GET');
        const dadosEstatisticas = await requisicao('/profissional/dadosProfissional', 'GET');
        
        return {
            mediaAvaliacao: dadosEstatisticas && dadosEstatisticas.mediaAvaliacao ? parseFloat(dadosEstatisticas.mediaAvaliacao).toFixed(1) : null,
            fotoPerfil: dadosPerfil && dadosPerfil.fotoPerfil ? dadosPerfil.fotoPerfil : null
        };
    } catch (error) {
        try {
            const dados = await requisicao('/profissional/dadosProfissional', 'GET');
            return {
                mediaAvaliacao: dados && dados.mediaAvaliacao ? parseFloat(dados.mediaAvaliacao).toFixed(1) : null,
                fotoPerfil: null
            };
        } catch (error2) {
            return {
                mediaAvaliacao: null,
                fotoPerfil: null
            };
        }
    }
}

async function renderizarListaTrabalhos(listaDeTrabalhos) {
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
        } else {
            return;
        }
    }

    lista.innerHTML = '';

    if (!listaDeTrabalhos || listaDeTrabalhos.length === 0) {
        lista.innerHTML = '<p class="mensagem-vazia">Nenhum trabalho encontrado.</p>';
        return;
    }

    listaDeTrabalhos.forEach(async (p) => {
        let dadosProfissional = null;
        
        if (p.idProfissional) {
            dadosProfissional = await buscarDadosProfissional(p.idProfissional);
        }

        const card = document.createElement('div');
        card.className = 'card-pedido';

        const cidade = p.localizacao ? p.localizacao.cidade : (p.cidade || 'Local não inf.');
        const estado = p.localizacao ? p.localizacao.estado : (p.estado || 'RN');
        const statusFormatado = (p.status || 'ABERTO').replace('_', ' ');
        const valorFormatado = p.pagamento ? p.pagamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';


        let avaliacaoHtml = '';
        if (p.status === 'CONCLUIDO' && p.nota) {
            avaliacaoHtml = `
                <div class="avaliacao-card-info" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #333;">
                    <span style="color: #f1c40f; font-size: 1.1rem;">
                        ${'★'.repeat(p.nota)}${'☆'.repeat(5 - p.nota)}
                    </span>
                    ${p.comentario ? `<p style="font-style: italic; color: #bbb; font-size: 0.85rem; margin-top: 4px;">"${p.comentario}"</p>` : ''}
                </div>
            `;
        }


        let botoesAcao = '';
        if (p.status === 'EM_ESPERA') {
            botoesAcao = `
                <div class="botoes-card">
                    <button class="botao-aceitar" onclick="responderSolicitacao(${p.id}, true)">Aceitar</button>
                    <button class="botao-recusar" onclick="responderSolicitacao(${p.id}, false)">Recusar</button>
                </div>`;
        } else if (p.status === 'EM_ANDAMENTO') {
            botoesAcao = `
                <div class="botoes-card">
                    <button class="botao-finalizar" onclick="finalizarTrabalho(${p.id})">Finalizar</button>
                    <button class="botao-cancelar" onclick="cancelarTrabalho(${p.id})">Cancelar</button>
                </div>`;
        }

        const mediaAvaliacoes = dadosProfissional ? dadosProfissional.mediaAvaliacao : null;
        const fotoProfissional = dadosProfissional?.fotoPerfil || p.caminhoImagem || null;
        
        const estrelasHtml = mediaAvaliacoes ? 
            '★'.repeat(Math.round(mediaAvaliacoes)) + '☆'.repeat(5 - Math.round(mediaAvaliacoes)) : 
            '☆☆☆☆☆';

        card.innerHTML = `
            <div class="info-card">
                <h3>${p.problema || 'Sem título'}</h3>
                <div class="detalhes-card">
                    <span>📍 ${cidade} - ${estado}</span>
                    <span style="color: #00e0ff;">🔧 ${p.categoria || 'Geral'}</span>
                    <span>💰 ${valorFormatado}</span>
                </div>
                ${p.nomeProfissional ? `
                    <div class="profissional-info">
                        <img src="${fotoProfissional ? resolverSrcFoto(fotoProfissional) : '/assets/avatar-padrao.png'}" alt="Foto do profissional" class="profissional-foto" onerror="this.src='/assets/avatar-padrao.png'">
                        <div class="profissional-dados">
                            <div class="profissional-nome">${p.nomeProfissional}</div>
                            <div class="profissional-avaliacoes">
                                <span class="estrelas-avaliacao">${estrelasHtml}</span>
                                ${mediaAvaliacoes ? `<span class="nota-numerica">(${mediaAvaliacoes}/5)</span>` : ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
                ${avaliacaoHtml} </div>
            <span class="status-badge">
                ${statusFormatado}
            </span>
        `;

        const botoesContainer = document.createElement('div');
        botoesContainer.className = 'botoes-container';
        botoesContainer.innerHTML = botoesAcao;

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'card-wrapper';
        cardWrapper.appendChild(card);
        cardWrapper.appendChild(botoesContainer);

        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.botoes-container')) {
                window.location.href = `detalhes-trabalho.html?id=${p.id}`;
            }
        });

        lista.appendChild(cardWrapper);
    });
}
async function filtrarPorCategoria(categoria) {
    const lista = document.getElementById('listaMeusPedidos');
    if(lista) lista.innerHTML = '<p>Carregando...</p>';

    try {

        const resultado = await requisicao(`/trabalho/filtro/categoria?termo=${encodeURIComponent(categoria)}`, 'GET');

        console.log(`Resultados para ${categoria}:`, resultado);


        renderizarListaTrabalhos(resultado);

    } catch (erro) {
        console.error("Erro ao filtrar:", erro);
        if(lista) lista.innerHTML = '<p>Erro ao buscar categoria.</p>';
    }
}

window.finalizarTrabalho = async function(idTrabalho) {
    try {

        const response = await requisicao(`/trabalho/${idTrabalho}/concluir`, 'POST');

        if (response) {
            alert('Trabalho finalizado com sucesso!');
            carregarPedidos();
        }
    } catch (error) {
        console.error('Erro ao finalizar trabalho:', error);
        alert('Erro ao finalizar trabalho. Tente novamente.');
    }
};

async function buscarEnderecoPorCep() {
    const cepInput = document.getElementById('cepServico');
    const cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        return;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
            return;
        }

        document.getElementById('ruaServico').value = data.logradouro || '';
        document.getElementById('bairroServico').value = data.bairro || '';
        document.getElementById('cidadeServico').value = data.localidade || '';
        document.getElementById('estadoServico').value = data.uf || '';
        document.getElementById('complementoServico').value = data.complemento || '';
        
        document.getElementById('numeroServico').focus();
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP. Por favor, preencha o endereço manualmente.');
    }
}
