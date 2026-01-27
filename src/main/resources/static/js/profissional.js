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
});

async function carregarFeedGeral() {
    const container = document.getElementById('listaOportunidades');
    if (!container) return;

    try {
        const trabalhos = await enviarRequisicao('/trabalho/list', 'GET');
        container.innerHTML = '';

        // Filtra apenas os ABERTOS
        const disponiveis = trabalhos.filter(t => t.status === 'ABERTO');

        if (disponiveis.length === 0) {
            container.innerHTML = '<p class="aviso-vazio">Nenhuma oportunidade disponível no momento.</p>';
            return;
        }

        disponiveis.forEach(t => {
            const div = document.createElement('div');
            div.className = 'cartao-servico';

            const cidade = t.localizacao ? t.localizacao.cidade : 'Não informado';

            div.innerHTML = `
                <div class="conteudo-servico">
                    <h3>${t.problema} <span class="tag-categoria">${t.categoria}</span></h3>
                    <p>${t.descricao}</p>
                    <div class="rodape-card">
                        <span>📍 ${cidade}</span>
                        <span class="preco">R$ ${t.pagamento}</span>
                    </div>
                </div>
                <button class="btn-aceitar" onclick="candidatarVaga(${t.id}, this)">
                    Aceitar Serviço
                </button>
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
            card.style.display = 'block'; // ou 'flex' dependendo do seu CSS
        } else {
            card.style.display = 'none';
        }
    });
}

// Global para o botão onclick
window.candidatarVaga = async function(idTrabalho, botao) {
    if (!confirm('Tem certeza que deseja aceitar este serviço?')) return;

    botao.disabled = true;
    botao.innerText = "Processando...";

    try {
        await enviarRequisicao(`/trabalho/${idTrabalho}/candidatar`, 'POST');
        botao.innerText = "Candidatura Enviada!";
        botao.style.backgroundColor = "#00875f"; // Verde sucesso
    } catch (e) {
        alert('Erro ao se candidatar: ' + (e.message || 'Tente novamente.'));
        botao.disabled = false;
        botao.innerText = "Aceitar Serviço";
    }
}