document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarTrabalhos();

    document.getElementById('btnSair').onclick = logout;
});

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
                    <button class="botao-candidatar" onclick="candidatar(${trabalho.id}, this)">
                        Candidatar-se
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
