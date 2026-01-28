document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarUsuario();
    carregarContadorHistorico();
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
        console.error('Erro ao buscar trabalhos:', error);
        container.innerHTML = '<p style="color:red">Erro ao buscar trabalhos.</p>';
    }
};

window.cancelarCandidatura = async function(idTrabalho, botao) {
    if (botao.disabled) return;

    botao.disabled = true;
    botao.innerText = 'Cancelando...';

    try {
        await requisicao(`/trabalho/${idTrabalho}/cancelar`, 'POST');
        botao.innerText = 'Cancelado!';
        botao.style.background = '#666';
    } catch (error) {
        console.error('Erro ao cancelar:', error);
        botao.innerText = 'Erro';
        botao.style.background = '#ff6b6b';
        setTimeout(() => {
            botao.innerText = 'Cancelar';
            botao.style.background = '';
            botao.disabled = false;
        }, 3000);
    }
};

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

    const imgEl = document.getElementById('detalheImagem');
    if (imgEl) {
        if (trabalho && trabalho.imagem) {
            imgEl.src = trabalho.imagem.startsWith('http') || trabalho.imagem.startsWith('/') ? trabalho.imagem : `/upload/${trabalho.imagem}`;
            imgEl.style.display = 'block';
        } else {
            imgEl.style.display = 'none';
        }
    }

    modal.classList.remove('escondido');
};

window.fecharModalDetalhesTrabalho = function() {
    const modal = document.getElementById('modalDetalhesTrabalho');
    if (modal) modal.classList.add('escondido');
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
