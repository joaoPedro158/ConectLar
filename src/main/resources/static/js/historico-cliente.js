// JavaScript do Histórico do Cliente
let servicoAtual = null;
let filtroAtual = 'todos';

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarHistoricoCompleto();
});

async function carregarHistoricoCompleto() {
    const container = document.getElementById('listaHistorico');
    
    try {
        const servicos = await enviarRequisicao('/usuario/historico', 'GET');
        container.innerHTML = '';

        if (!servicos || servicos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <h2>Nenhum serviço encontrado</h2>
                    <p>Você ainda não solicitou nenhum serviço.</p>
                </div>
            `;
            return;
        }

        servicos.forEach(servico => {
            const card = criarCardHistorico(servico);
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

function criarCardHistorico(servico) {
    const div = document.createElement('div');
    div.className = 'card-historico';
    div.dataset.status = servico.status;
    div.onclick = () => abrirDetalhesHistorico(servico);

    const cidade = servico.localizacao ? servico.localizacao.cidade : 'Não informado';
    const statusClass = getStatusClass(servico.status);

    // Foto do profissional
    const fotoProfissional = servico.profissional?.fotoPerfil 
        ? `/uploads/${servico.profissional.fotoPerfil}` 
        : '/assets/avatar-padrao.png';

    div.innerHTML = `
        <div class="historico-cabecalho">
            <div class="historico-titulo">
                <h3>${servico.problema || 'Serviço sem título'}</h3>
                <span class="status-badge ${statusClass}">${servico.status}</span>
            </div>
            ${servico.profissional ? `
                <div class="profissional-mini">
                    <img src="${fotoProfissional}" alt="${servico.profissional.nome}" onerror="this.src='/assets/avatar-padrao.png'">
                    <span>${servico.profissional.nome}</span>
                </div>
            ` : ''}
        </div>
        
        <div class="historico-corpo">
            <p class="descricao">${servico.descricao || ''}</p>
            <div class="historico-info">
                <span>📍 ${cidade}</span>
                <span>💰 R$ ${servico.pagamento || '0'}</span>
                <span>🏷️ ${servico.categoria || 'Geral'}</span>
            </div>
        </div>
        
        <div class="historico-rodape">
            <span class="data">${formatarData(servico.dataCriacao)}</span>
        </div>
    `;

    return div;
}

function getStatusClass(status) {
    switch(status) {
        case 'ABERTO': return 'status-aberto';
        case 'ANDAMENTO': return 'status-andamento';
        case 'CONCLUIDO': return 'status-concluido';
        case 'CANCELADO': return 'status-cancelado';
        default: return 'status-pendente';
    }
}

function formatarData(data) {
    if (!data) return 'Data não informada';
    return new Date(data).toLocaleDateString('pt-BR');
}

function abrirDetalhesHistorico(servico) {
    servicoAtual = servico;
    
    // Preencher modal
    document.getElementById('hist-titulo').value = servico.problema || '';
    document.getElementById('hist-categoria').value = servico.categoria || '';
    document.getElementById('hist-valor').value = `R$ ${servico.pagamento || '0'}`;
    document.getElementById('hist-status').value = servico.status || '';
    document.getElementById('hist-descricao').value = servico.descricao || '';
    
    const localizacao = servico.localizacao;
    if (localizacao) {
        document.getElementById('hist-localizacao').value = 
            `${localizacao.rua || ''}, ${localizacao.numero || ''} - ${localizacao.bairro || ''}, ${localizacao.cidade || ''}/${localizacao.estado || ''}`;
    }

    // Profissional
    if (servico.profissional) {
        document.getElementById('profissional-info').style.display = 'block';
        document.getElementById('prof-nome').textContent = servico.profissional.nome || '';
        document.getElementById('prof-email').textContent = servico.profissional.email || '';
        document.getElementById('prof-categoria').textContent = servico.profissional.categoria || '';
    } else {
        document.getElementById('profissional-info').style.display = 'none';
    }

    // Botões de ação
    document.getElementById('btn-avaliar-servico').style.display = 
        servico.status === 'CONCLUIDO' ? 'block' : 'none';
    document.getElementById('btn-cancelar-servico').style.display = 
        (servico.status === 'ABERTO' || servico.status === 'ANDAMENTO') ? 'block' : 'none';
    document.getElementById('btn-concluir-servico').style.display = 
        servico.status === 'ANDAMENTO' ? 'block' : 'none';

    // Mostrar modal
    document.getElementById('modalDetalhesHistorico').classList.remove('escondido');
}

function fecharModalDetalhesHistorico() {
    document.getElementById('modalDetalhesHistorico').classList.add('escondido');
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
    const cards = document.querySelectorAll('.card-historico');
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
    const cards = document.querySelectorAll('.card-historico');

    cards.forEach(card => {
        const texto = card.textContent.toLowerCase();
        if (texto.includes(termo)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function cancelarServico() {
    if (!servicoAtual) return;
    
    if (!confirm('Tem certeza que deseja cancelar este serviço?')) return;

    try {
        await enviarRequisicao(`/trabalho/${servicoAtual.id}/cancelar`, 'POST');
        alert('Serviço cancelado com sucesso!');
        fecharModalDetalhesHistorico();
        carregarHistoricoCompleto();
    } catch (error) {
        alert('Erro ao cancelar serviço: ' + error.message);
    }
}

async function concluirServico() {
    if (!servicoAtual) return;
    
    if (!confirm('Tem certeza que deseja concluir este serviço?')) return;

    try {
        await enviarRequisicao(`/trabalho/${servicoAtual.id}/concluir`, 'POST');
        alert('Serviço concluído com sucesso!');
        fecharModalDetalhesHistorico();
        carregarHistoricoCompleto();
    } catch (error) {
        alert('Erro ao concluir serviço: ' + error.message);
    }
}

// Função para avaliação (será chamada pelo avaliacoes.js)
window.abrirModalAvaliacao = function() {
    if (!servicoAtual) return;
    
    const nomeProfissional = servicoAtual.profissional ? servicoAtual.profissional.nome : 'Profissional';
    
    // Chamar função do avaliacoes.js
    if (typeof abrirModalAvaliacaoGlobal === 'function') {
        abrirModalAvaliacaoGlobal(servicoAtual.id, nomeProfissional);
    }
};

// ESC para fechar modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fecharModalDetalhesHistorico();
    }
});

// Funções globais para uso no HTML
window.filtrarStatus = filtrarStatus;
window.buscarNoHistorico = buscarNoHistorico;
window.cancelarServico = cancelarServico;
window.concluirServico = concluirServico;
window.fecharModalDetalhesHistorico = fecharModalDetalhesHistorico;
