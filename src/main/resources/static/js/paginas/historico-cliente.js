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
                    <h2>Caixinha de pedidos vazia</h2>
                    <p>Você ainda não publicou nenhum pedido.</p>
                </div>
            `;
            return;
        }

        servicos.forEach(servico => {
            const card = document.createElement('div');
            card.className = 'card-historico';

            const cidade = servico.localizacao ? servico.localizacao.cidade : 'Não informada';
            const estado = servico.localizacao ? servico.localizacao.estado : 'RN';
            const statusClass = getStatusClass(servico.status);
            const statusTexto = getStatusTexto(servico.status);

            const resumo = montarResumo(servico);

            card.innerHTML = `
                <div class="historico-cabecalho">
                    <h3>${servico.problema || 'Sem título'}</h3>
                    <span class="status-badge ${statusClass}">${statusTexto}</span>
                </div>
                <div class="historico-corpo">
                    <div class="caixa-descricao">
                        <p class="descricao">${servico.descricao || 'Sem descrição'}</p>
                    </div>
                    ${servico.imagens && servico.imagens.length > 0 ? `
                        <div class="caixa-imagens">
                            <div class="imagens-problema">
                                ${servico.imagens.map(img => `
                                    <img src="${img.startsWith('http') || img.startsWith('/') ? img : '/upload/' + img}" alt="Imagem do problema" class="img-problema">
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    <div class="caixa-detalhes">
                        <div class="detalhes-historico">
                            <span>📍 ${cidade} - ${estado}</span>
                            <span>🔧 ${servico.categoria || 'Geral'}</span>
                            <span>💰 R$ ${servico.pagamento || '0,00'}</span>
                        </div>
                    </div>
                </div>
                <div class="historico-rodape">
                    <div class="caixa-data">
                        <span class="data">${new Date(servico.dataHoraAberta).toLocaleDateString('pt-BR')}</span>
                    </div>
                    ${servico.profissionalNome ? `
                        <div class="caixa-profissional">
                            <span class="profissional">Profissional: ${servico.profissionalNome}</span>
                        </div>
                    ` : ''}
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        container.innerHTML = '<p style="color:red">Erro ao carregar histórico.</p>';
    }
}

window.responderSolicitacao = async function(idTrabalho, resposta) {
    const texto = resposta ? 'Aceitar este profissional e iniciar o serviço?' : 'Recusar este profissional e liberar o pedido novamente?';
    if (!confirm(texto)) return;

    try {
        await requisicao(`/trabalho/${idTrabalho}/responder`, 'POST', resposta);
        alert(resposta ? 'Profissional aceito! O serviço foi iniciado.' : 'Profissional recusado! O pedido voltou para o feed.');
        carregarHistorico();
    } catch (error) {
        console.error('Erro ao responder solicitação:', error);
        alert('Erro ao processar sua resposta.');
    }
};

window.finalizarTrabalho = async function(idTrabalho) {
    try {
        await requisicao(`/trabalho/${idTrabalho}/concluir`, 'POST');
        const avaliacao = prompt('Avalie o serviço (0 a 5):');
        if (avaliacao && avaliacao >= 0 && avaliacao <= 5) {
            await requisicao(`/avaliacao/avaliar/${idTrabalho}`, 'POST', { nota: Number(avaliacao) });
        }
        alert('Serviço finalizado!');
        carregarHistorico();
    } catch (error) {
        console.error('Erro ao finalizar:', error);
        alert('Erro ao finalizar serviço.');
    }
};

window.cancelarTrabalho = async function(idTrabalho) {
    if (!confirm('Tem certeza que deseja cancelar este serviço?')) return;
    try {
        await requisicao(`/trabalho/${idTrabalho}/cancelar`, 'POST');
        alert('Serviço cancelado.');
        carregarHistorico();
    } catch (error) {
        console.error('Erro ao cancelar:', error);
        alert('Erro ao cancelar serviço.');
    }
};

function getStatusClass(status) {
    switch (status) {
        case 'ABERTO': return 'status-aberto';
        case 'EM_ESPERA': return 'status-espera';
        case 'EM_ANDAMENTO': return 'status-andamento';
        case 'CONCLUIDO': return 'status-concluido';
        case 'CANCELADO': return 'status-cancelado';
        default: return '';
    }
}

function getStatusTexto(status) {
    switch (status) {
        case 'ABERTO': return 'Aberto';
        case 'EM_ESPERA': return 'Aguardando';
        case 'EM_ANDAMENTO': return 'Em Andamento';
        case 'CONCLUIDO': return 'Concluído';
        case 'CANCELADO': return 'Cancelado';
        default: return status;
    }
}

function montarResumo(servico) {
    const partes = [];

    if (servico && servico.descricao) {
        const texto = String(servico.descricao).trim();
        partes.push(texto.length > 120 ? texto.slice(0, 117) + '...' : texto);
    }

    if (servico && servico.dataHoraAberta) {
        try {
            const data = new Date(servico.dataHoraAberta);
            partes.push('Aberto em ' + data.toLocaleDateString('pt-BR'));
        } catch (e) {
        }
    }

    if (servico && servico.status) {
        partes.push('Status: ' + getStatusTexto(servico.status));
    }

    return partes.filter(Boolean).join(' • ') || 'Sem descrição';
}

function formatarMoeda(valor) {
    try {
        return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } catch (e) {
        return 'R$ 0,00';
    }
}

async function atualizarResumo(servicos) {
    const totalEl = document.getElementById('total-pedidos');
    const concluidosEl = document.getElementById('pedidos-concluidos');
    const gastoEl = document.getElementById('gasto-total');
    const avaliacaoEl = document.getElementById('avaliacao-media');

    const lista = Array.isArray(servicos) ? servicos : [];
    const total = lista.length;
    const concluidos = lista.filter(s => s && s.status === 'CONCLUIDO').length;

    if (totalEl) totalEl.innerText = String(total);
    if (concluidosEl) concluidosEl.innerText = String(concluidos);
    if (avaliacaoEl) avaliacaoEl.innerText = '0.0';

    try {
        const totalGasto = await requisicao('/usuario/gastoTotal', 'GET');
        if (gastoEl) gastoEl.innerText = formatarMoeda(totalGasto);
    } catch (e) {
        if (gastoEl) gastoEl.innerText = 'R$ 0,00';
    }
}

window.avaliarServico = function(idServico) {
    const nota = prompt('Avalie o serviço (1 a 5):');
    if (!nota || nota < 1 || nota > 5) {
        alert('Por favor, informe uma nota de 1 a 5.');
        return;
    }

    const comentario = prompt('Deixe um comentário (opcional):') || '';

    avaliar(idServico, parseInt(nota), comentario);
};

window.concluirServico = async function(idServico) {
    if (!confirm('Tem certeza que deseja concluir este serviço?')) return;

    try {
        await requisicao(`/trabalho/${idServico}/concluir`, 'POST');
        alert('Serviço concluído com sucesso!');
        carregarHistorico();
    } catch (error) {
        console.error('Erro ao concluir serviço:', error);
        alert('Erro ao concluir serviço.');
    }
};

async function avaliar(idServico, nota, comentario) {
    try {
        await requisicao(`/avaliacao/avaliar/${idServico}`, 'POST', {
            nota: nota,
            comentario: comentario
        });
        alert('Avaliação enviada com sucesso!');
        carregarHistorico();
    } catch (error) {
        console.error('Erro ao avaliar:', error);
        alert('Erro ao enviar avaliação.');
    }
}
