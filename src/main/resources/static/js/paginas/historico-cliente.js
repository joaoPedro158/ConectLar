document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarHistorico();

    document.getElementById('btnSair').onclick = logout;
});

async function carregarHistorico() {
    const container = document.getElementById('listaHistorico');

    try {
        const servicos = await requisicao('/usuario/historico', 'GET');
        container.innerHTML = '';

        if (!servicos || servicos.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h2>Nenhum serviço encontrado</h2>
                    <p>Você ainda não publicou nenhum serviço.</p>
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

            card.innerHTML = `
                <div class="info-historico">
                    <h3>${servico.problema || 'Sem título'}</h3>
                    <p class="descricao">${servico.descricao || 'Sem descrição'}</p>
                    <div class="detalhes">
                        <span>📍 ${cidade} - ${estado}</span>
                        <span>🔧 ${servico.categoria || 'Geral'}</span>
                        <span>💰 R$ ${servico.pagamento || '0,00'}</span>
                    </div>
                    ${servico.nomeProfissional ? `<span class="profissional">👨‍💼 ${servico.nomeProfissional}</span>` : ''}
                </div>
                <div class="status-info">
                    <span class="status-badge ${statusClass}">${statusTexto}</span>
                    ${servico.status === 'CONCLUIDO' ? `<button class="botao-avaliar" onclick="avaliarServico(${servico.id})">Avaliar</button>` : ''}
                    ${servico.status === 'EM_ANDAMENTO' ? `<button class="botao-concluir" onclick="concluirServico(${servico.id})">Concluir</button>` : ''}
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        container.innerHTML = '<p style="color:red">Erro ao carregar histórico.</p>';
    }
}

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
