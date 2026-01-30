let trabalhoIdAtual = null; // Armazena o ID do trabalho que está sendo avaliado

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarHistorico();
});

async function carregarHistorico() {
    const container = document.getElementById('listaHistorico');

    try {
        const servicos = await requisicao('/usuario/historico', 'GET');
        await atualizarResumo(servicos);
        container.innerHTML = '';

        if (!servicos || servicos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h2>Sua lista está vazia</h2>
                    <p>Você ainda não solicitou nenhum serviço.</p>
                </div>
            `;
            return;
        }

        servicos.forEach(servico => {
            const card = document.createElement('div');
            card.className = 'card-historico';

            const statusClass = getStatusClass(servico.status);
            const statusTexto = getStatusTexto(servico.status);
            const cidade = servico.localizacao ? servico.localizacao.cidade : 'Não informada';

            card.innerHTML = `
                <div class="historico-cabecalho">
                    <h3>${servico.problema || 'Sem título'}</h3>
                    <span class="status-badge ${statusClass}">${statusTexto}</span>
                </div>
                <div class="historico-corpo">
                    <div class="caixa-descricao">
                        <p class="descricao">${servico.descricao || 'Sem descrição'}</p>
                    </div>
                    <div class="caixa-detalhes">
                        <div class="detalhes-historico">
                            <span>📍 ${cidade}</span>
                            <span>🔧 ${servico.categoria || 'Geral'}</span>
                            <span>💰 ${formatarMoeda(servico.pagamento)}</span>
                        </div>
                    </div>
                </div>
                <div class="historico-rodape">
                    <div class="caixa-data">
                        <span>📅 ${new Date(servico.dataHoraAberta).toLocaleDateString('pt-BR')}</span>
                    </div>
                    ${servico.nomeProfissional ? `
                        <div class="caixa-profissional">
                            <span>👷 Profissional: ${servico.nomeProfissional}</span>
                        </div>
                    ` : ''}
                    
                    <div class="acoes-card">
                        ${renderizarBotoesAcao(servico)}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        container.innerHTML = '<p style="color:red; text-align:center;">Erro ao carregar histórico de pedidos.</p>';
    }
}


function renderizarBotoesAcao(servico) {
    if (servico.status === 'EM_ANDAMENTO') {
        return `<button onclick="concluirServico(${servico.id})" class="botao-concluir">Finalizar Serviço</button>`;
    }
    if (servico.status === 'CONCLUIDO') {
        if (servico.avaliado) {
            return `<span class="mensagem-avaliado">✓ Serviço Avaliado</span>`;
        }
        return `<button onclick="abrirModalAvaliacao(${servico.id})" class="botao-avaliar">Avaliar Profissional</button>`;
    }
    if (servico.status === 'ABERTO') {
        return `<button onclick="cancelarTrabalho(${servico.id})" class="btn-cancelar-simples">Cancelar</button>`;
    }

    return '';
}

/* ================= AÇÕES DE STATUS ================= */

async function concluirServico(idServico) {
    if (!confirm('Confirmar que o serviço foi finalizado pelo profissional?')) return;

    try {
        // O padrão do seu back-end é /trabalho/{id}/concluir
        await requisicao(`/trabalho/${idServico}/concluir`, 'POST');

        alert('Serviço concluído com sucesso!');
        carregarHistorico(); // Recarrega a lista
        abrirModalAvaliacao(idServico); // Abre o modal logo em seguida
    } catch (error) {
        console.error('Erro ao concluir:', error);
        alert('Não foi possível concluir o serviço. Verifique o console.');
    }
}

async function cancelarTrabalho(idTrabalho) {
    if (!confirm('Deseja realmente cancelar este pedido?')) return;
    try {
        await requisicao(`/trabalho/cancelar/${idTrabalho}`, 'POST');
        alert('Pedido cancelado.');
        carregarHistorico();
    } catch (error) {
        alert('Erro ao cancelar pedido.');
    }
}


function abrirModalAvaliacao(idServico) {
    trabalhoIdAtual = idServico;
    document.getElementById('modalAvaliacao').style.display = 'flex';
}

function fecharModalAvaliacao() {
    document.getElementById('modalAvaliacao').style.display = 'none';
    trabalhoIdAtual = null;
}

async function enviarAvaliacaoAtual() {
    const estrelas = document.getElementsByName('estrela');
    let notaSelecionada = 0;

    for (const e of estrelas) {
        if (e.checked) {
            notaSelecionada = parseInt(e.value);
            break;
        }
    }

    if (notaSelecionada === 0) {
        alert('Por favor, selecione uma nota.');
        return;
    }

    const comentario = document.getElementById('comentarioAvaliacao').value;
    const dadosAvaliacao = {
        nota: notaSelecionada,
        comentario: comentario
    };

    try {
        const response = await requisicao(`/avaliacao/avaliar/${trabalhoIdAtual}`, 'POST', dadosAvaliacao);

        alert('Avaliação enviada com sucesso!');
        fecharModalAvaliacao();
        carregarHistorico();
    } catch (error) {
        console.error('Erro ao avaliar:', error);
        alert('Falha ao enviar avaliação. Verifique se o serviço já foi concluído no sistema.');
    }
}


function getStatusClass(status) {
    const classes = {
        'ABERTO': 'status-aberto',
        'EM_ESPERA': 'status-espera',
        'EM_ANDAMENTO': 'status-andamento',
        'CONCLUIDO': 'status-concluido',
        'CANCELADO': 'status-cancelado'
    };
    return classes[status] || '';
}

function getStatusTexto(status) {
    const textos = {
        'ABERTO': 'Procurando Profissional',
        'EM_ESPERA': 'Aguardando Aprovação',
        'EM_ANDAMENTO': 'Serviço em Execução',
        'CONCLUIDO': 'Finalizado',
        'CANCELADO': 'Cancelado'
    };
    return textos[status] || status;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

async function atualizarResumo(servicos) {
    const lista = Array.isArray(servicos) ? servicos : [];
    
    document.getElementById('total-pedidos').innerText = lista.length;
    document.getElementById('pedidos-concluidos').innerText = lista.filter(s => s.status === 'CONCLUIDO').length;

    try {
        const totalGasto = await requisicao('/usuario/gastoTotal', 'GET');
        document.getElementById('gasto-total').innerText = formatarMoeda(totalGasto);
    } catch (e) {
        document.getElementById('gasto-total').innerText = 'R$ 0,00';
    }

    // A avaliação média o back-end precisaria fornecer um endpoint específico ou calcular aqui se houvesse o dado
    document.getElementById('avaliacao-media').innerText = '-';
}