// Funções para gerenciamento de avaliações

async function avaliarTrabalho(idTrabalho, nota, comentario) {
    try {
        const avaliacao = {
            nota: nota,
            comentario: comentario,
            dataAvaliacao: new Date().toISOString()
        };

        const resposta = await enviarRequisicao(`/avaliacao/avaliar/${idTrabalho}`, 'POST', avaliacao);
        
        if (resposta) {
            alert('Avaliação enviada com sucesso!');
            return resposta;
        }
    } catch (error) {
        console.error('Erro ao avaliar trabalho:', error);
        alert('Erro ao enviar avaliação. Tente novamente.');
        throw error;
    }
}

function abrirModalAvaliacao(idTrabalho, nomeProfissional) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal-conteudo">
            <div class="modal-cabecalho">
                <h2>Avaliar Serviço</h2>
                <button class="modal-fechar" onclick="fecharModalAvaliacao()">&times;</button>
            </div>
            
            <div class="modal-corpo">
                <div class="detalhe-grupo">
                    <label>Profissional</label>
                    <input type="text" value="${nomeProfissional}" readonly>
                </div>
                
                <div class="detalhe-grupo">
                    <label>Nota (1 a 5)</label>
                    <div class="estrelas-container">
                        ${[1,2,3,4,5].map(n => `
                            <span class="estrela" data-nota="${n}" onclick="selecionarNota(${n})">⭐</span>
                        `).join('')}
                    </div>
                    <input type="hidden" id="avaliacao-nota" value="5">
                </div>
                
                <div class="detalhe-grupo">
                    <label>Comentário</label>
                    <textarea id="avaliacao-comentario" placeholder="Descreva sua experiência com o serviço..."></textarea>
                </div>
            </div>
            
            <div class="modal-rodape">
                <button class="btn-fechar" onclick="fecharModalAvaliacao()">Cancelar</button>
                <button class="btn-avaliar" onclick="enviarAvaliacao(${idTrabalho})">Enviar Avaliação</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Evento para fechar clicando fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModalAvaliacao();
        }
    });
    
    // ESC para fechar
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            fecharModalAvaliacao();
            document.removeEventListener('keydown', escHandler);
        }
    });
}

function selecionarNota(nota) {
    document.getElementById('avaliacao-nota').value = nota;
    
    // Atualizar estrelas visuais
    const estrelas = document.querySelectorAll('.estrela');
    estrelas.forEach((estrela, index) => {
        if (index < nota) {
            estrela.style.color = '#ffd700';
            estrela.style.transform = 'scale(1.2)';
        } else {
            estrela.style.color = '#ccc';
            estrela.style.transform = 'scale(1)';
        }
    });
}

function fecharModalAvaliacao() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

async function enviarAvaliacao(idTrabalho) {
    const nota = parseInt(document.getElementById('avaliacao-nota').value);
    const comentario = document.getElementById('avaliacao-comentario').value;
    
    if (!nota || nota < 1 || nota > 5) {
        alert('Por favor, selecione uma nota de 1 a 5 estrelas.');
        return;
    }
    
    if (!comentario.trim()) {
        alert('Por favor, deixe um comentário sobre o serviço.');
        return;
    }
    
    try {
        await avaliarTrabalho(idTrabalho, nota, comentario);
        fecharModalAvaliacao();
        
        // Recarregar a página ou lista se necessário
        if (typeof listarMeusPedidos === 'function') {
            listarMeusPedidos();
        }
    } catch (error) {
        // Erro já tratado na função avaliarTrabalho
    }
}

// Funções globais para uso no HTML
window.abrirModalAvaliacao = abrirModalAvaliacao;
window.selecionarNota = selecionarNota;
window.fecharModalAvaliacao = fecharModalAvaliacao;
window.enviarAvaliacao = enviarAvaliacao;
