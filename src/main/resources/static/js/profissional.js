document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarFeedGeral();

    // Busca (se houver campo de busca)
    const btnBusca = document.getElementById('btnBuscar');
    if (btnBusca) {
        btnBusca.addEventListener('click', buscarVagas);
    }

    // Botão Sair
    const btnSair = document.getElementById('btnSair');
    if (btnSair) btnSair.onclick = fazerLogout;

    // Eventos do modal
    const modal = document.getElementById('modalDetalhesServico');
    if (modal) {
        // Fechar modal clicando fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModalDetalhes();
            }
        });

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                fecharModalDetalhes();
            }
        });
    }
});

async function carregarFeedGeral() {
    const container = document.getElementById('listaOportunidades');
    if (!container) return;

    try {
        const trabalhos = await enviarRequisicao('/trabalho/list', 'GET');
        container.innerHTML = '';

        const disponiveis = trabalhos.filter(t => t.status === 'ABERTO');

        if (disponiveis.length === 0) {
            container.innerHTML = '<p class="aviso-vazio">Nenhuma oportunidade disponível no momento.</p>';
            return;
        }

        disponiveis.forEach(t => {
            const div = document.createElement('div');
            div.className = 'cartao-servico';
            div.style.cursor = 'pointer';
            div.onclick = () => abrirModalDetalhes(t);

            const cidade = t.localizacao ? t.localizacao.cidade : 'Não informado';

            div.innerHTML = `
                <div class="cabecalho-servico">
                    <h3>${t.problema}</h3>
                    <span class="tag-categoria">${t.categoria}</span>
                </div>
                
                <div class="descricao-servico">
                    <p>${t.descricao}</p>
                </div>
                
                <div class="info-servico">
                    <div class="info-item">
                        <span class="info-label">📍 Localização</span>
                        <span class="info-valor">${cidade}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">💰 Valor</span>
                        <span class="info-valor">R$ ${t.pagamento}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📅 Status</span>
                        <span class="info-valor status-aberto">${t.status}</span>
                    </div>
                </div>
                
                <div class="acoes-servico">
                    <button class="btn-aceitar-verde" onclick="event.stopPropagation(); candidatarVaga(${t.id}, this)">
                        ✅ Aceitar Serviço
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    } catch (e) {
        container.innerHTML = '<p class="erro">Erro ao carregar oportunidades.</p>';
    }
}

async function buscarVagas() {
    const campo = document.getElementById('campoBusca');
    if(!campo) return;

    const termo = campo.value.toLowerCase();
    const cards = document.querySelectorAll('.cartao-servico');

    cards.forEach(card => {
        const texto = card.innerText.toLowerCase();
        if (texto.includes(termo)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function buscarTrabalhosPorTermo(termo) {
    try {
        const trabalhos = await enviarRequisicao(`/trabalho/busca?termo=${encodeURIComponent(termo)}`, 'GET');
        return trabalhos;
    } catch (error) {
        console.error('Erro na busca:', error);
        return [];
    }
}

async function filtrarPorCategoria(categoria) {
    try {
        const trabalhos = await enviarRequisicao(`/trabalho/filtro/categoria?termo=${encodeURIComponent(categoria)}`, 'GET');
        return trabalhos;
    } catch (error) {
        console.error('Erro no filtro:', error);
        return [];
    }
}

// Global para o botão onclick
window.candidatarVaga = async function(idTrabalho, botao) {
    if (!confirm('Tem certeza que deseja aceitar este serviço?')) return;

    botao.disabled = true;
    botao.innerText = "⏳ Processando...";
    botao.style.backgroundColor = "#ffa500";

    try {
        await enviarRequisicao(`/trabalho/${idTrabalho}/candidatar`, 'POST');
        botao.innerText = "✅ Candidatura Enviada!";
        botao.style.backgroundColor = "#00875f";
        botao.style.cursor = "default";
    } catch (e) {
        alert('Erro ao se candidatar: ' + (e.message || 'Tente novamente.'));
        botao.disabled = false;
        botao.innerText = "✅ Aceitar Serviço";
        botao.style.backgroundColor = "#00c853";
    }
}

// Funções do Modal de Detalhes
function abrirModalDetalhes(trabalho) {
    const modal = document.getElementById('modalDetalhesServico');
    
    // Se não tiver todos os dados, buscar por ID
    if (!trabalho.localizacao || !trabalho.descricao) {
        buscarDetalhesTrabalho(trabalho.id);
        return;
    }
    
    // Preencher os campos do modal
    document.getElementById('detalhe-titulo').value = trabalho.problema || '';
    document.getElementById('detalhe-categoria').value = trabalho.categoria || '';
    document.getElementById('detalhe-valor').value = trabalho.pagamento ? `R$ ${trabalho.pagamento}` : '';
    document.getElementById('detalhe-status').value = trabalho.status || '';
    document.getElementById('detalhe-descricao').value = trabalho.descricao || '';
    
    // Endereço
    if (trabalho.localizacao) {
        document.getElementById('detalhe-cep').value = trabalho.localizacao.cep || '';
        document.getElementById('detalhe-cidade').value = trabalho.localizacao.cidade || '';
        document.getElementById('detalhe-estado').value = trabalho.localizacao.estado || '';
        document.getElementById('detalhe-rua').value = trabalho.localizacao.rua || '';
        document.getElementById('detalhe-bairro').value = trabalho.localizacao.bairro || '';
        document.getElementById('detalhe-numero').value = trabalho.localizacao.numero || '';
        document.getElementById('detalhe-complemento').value = trabalho.localizacao.complemento || '';
    }
    
    // Configurar botão de aceitar do modal
    const btnAceitarModal = document.getElementById('btn-aceitar-modal');
    btnAceitarModal.onclick = () => {
        fecharModalDetalhes();
        candidatarVaga(trabalho.id, btnAceitarModal);
    };
    
    // Mostrar modal
    modal.classList.add('active');
}

async function buscarDetalhesTrabalho(id) {
    try {
        const trabalho = await enviarRequisicao(`/trabalho/${id}`, 'GET');
        abrirModalDetalhes(trabalho);
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        alert('Erro ao carregar detalhes do serviço.');
    }
}

function fecharModalDetalhes() {
    const modal = document.getElementById('modalDetalhesServico');
    modal.classList.remove('active');
}