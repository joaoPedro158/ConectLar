// JavaScript do Histórico do Profissional
let servicoAtual = null;
let filtroAtual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarHistoricoProfissional();
});

async function carregarHistoricoProfissional() {
    const container = document.getElementById('listaHistoricoProfissional');
    
    try {
        const servicos = await enviarRequisicao('/profissional/historico', 'GET');
        container.innerHTML = '';

        if (!servicos || servicos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <h2>Nenhum serviço encontrado</h2>
                    <p>Você ainda não participou de nenhum serviço.</p>
                </div>
            `;
            return;
        }

        servicos.forEach(servico => {
            const card = criarCardHistoricoProfissional(servico);
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h2>Erro ao carregar histórico</h2>
                <p>Não foi possível carregar seus serviços. Tente novamente.</p>
            </div>
        `;
    }
}

function criarCardHistoricoProfissional(servico) {
    const div = document.createElement('div');
    div.className = 'cartao-servico historico-card';
    div.dataset.status = servico.status || 'CANDIDATADO';
    div.style.cursor = 'pointer';
    div.onclick = () => abrirDetalhesHistoricoProfissional(servico);

    const cidade = servico.localizacao ? servico.localizacao.cidade : 'Não informado';
    const statusClass = getStatusClass(servico.status);

    div.innerHTML = `
        <div class="cabecalho-servico">
            <h3>${servico.problema || 'Serviço sem título'}</h3>
            <span class="tag-categoria">${servico.categoria}</span>
        </div>
        
        <div class="descricao-servico">
            <p>${servico.descricao}</p>
        </div>
        
        <div class="info-servico">
            <div class="info-item">
                <span class="info-label">📍 Localização</span>
                <span class="info-valor">${cidade}</span>
            </div>
            <div class="info-item">
                <span class="info-label">💰 Valor</span>
                <span class="info-valor">R$ ${servico.pagamento}</span>
            </div>
            <div class="info-item">
                <span class="info-label">📅 Status</span>
                <span class="info-valor ${statusClass}">${servico.status || 'CANDIDATADO'}</span>
            </div>
        </div>
        
        <div class="acoes-servico">
            <span class="data-historico">${formatarData(servico.dataCandidatura)}</span>
        </div>
    `;

    return div;
}

function getStatusClass(status) {
    switch(status) {
        case 'CANDIDATADO': return 'status-candidatado';
        case 'ACEITO': return 'status-aceito';
        case 'ANDAMENTO': return 'status-andamento';
        case 'CONCLUIDO': return 'status-concluido';
        case 'RECUSADO': return 'status-recusado';
        default: return 'status-pendente';
    }
}

function formatarData(data) {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR');
}

function abrirDetalhesHistoricoProfissional(servico) {
    servicoAtual = servico;
    
    // Preencher modal
    document.getElementById('hist-prof-titulo').value = servico.problema || '';
    document.getElementById('hist-prof-categoria').value = servico.categoria || '';
    document.getElementById('hist-prof-valor').value = servico.pagamento ? `R$ ${servico.pagamento}` : '';
    document.getElementById('hist-prof-status').value = servico.status || 'CANDIDATADO';
    document.getElementById('hist-prof-descricao').value = servico.descricao || '';
    
    // Endereço
    if (servico.localizacao) {
        document.getElementById('hist-prof-cep').value = servico.localizacao.cep || '';
        document.getElementById('hist-prof-cidade').value = servico.localizacao.cidade || '';
        document.getElementById('hist-prof-estado').value = servico.localizacao.estado || '';
        document.getElementById('hist-prof-rua').value = servico.localizacao.rua || '';
        document.getElementById('hist-prof-bairro').value = servico.localizacao.bairro || '';
        document.getElementById('hist-prof-numero').value = servico.localizacao.numero || '';
        document.getElementById('hist-prof-complemento').value = servico.localizacao.complemento || '';
    }
    
    // Cliente
    if (servico.cliente) {
        document.getElementById('hist-prof-cliente-nome').textContent = servico.cliente.nome || '';
        document.getElementById('hist-prof-cliente-email').textContent = servico.cliente.email || '';
    }
    
    // Mostrar modal
    document.getElementById('modalDetalhesHistoricoProf').classList.add('active');
}

function fecharModalDetalhesHistorico() {
    document.getElementById('modalDetalhesHistoricoProf').classList.remove('active');
    servicoAtual = null;
}

function filtrarStatus(status) {
    filtroAtual = status;
    
    // Atualizar botões
    document.querySelectorAll('.filtro-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Filtrar cards
    const cards = document.querySelectorAll('.historico-card');
    cards.forEach(card => {
        if (status === 'todos' || card.dataset.status === status) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function buscarNoHistorico() {
    const termo = document.getElementById('campoBuscaHistorico').value.toLowerCase();
    const cards = document.querySelectorAll('.historico-card');

    cards.forEach(card => {
        const texto = card.textContent.toLowerCase();
        if (texto.includes(termo)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Eventos do modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalDetalhesHistoricoProf');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModalDetalhesHistorico();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                fecharModalDetalhesHistorico();
            }
        });
    }
});

// Funções globais para uso no HTML
window.filtrarStatus = filtrarStatus;
window.buscarNoHistorico = buscarNoHistorico;
window.fecharModalDetalhesHistorico = fecharModalDetalhesHistorico;
