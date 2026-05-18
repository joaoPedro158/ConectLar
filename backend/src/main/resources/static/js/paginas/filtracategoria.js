
async function filtrarPorCategoria(categoria) {
    const container = document.getElementById('listaTrabalhos');

    try {
        const trabalhos = await requisicao(`/trabalho/filtro/categoria?termo=${encodeURIComponent(categoria)}`, 'GET');
        container.innerHTML = '';

        if (!trabalhos || trabalhos.length === 0) {
            container.innerHTML = '<p class="mensagem-vazia">Nenhum trabalho disponível nesta categoria.</p>';
            return;
        }

        trabalhos.forEach(trabalho => {
            if (trabalho.status !== 'ABERTO') return;

            const card = document.createElement('div');
            card.className = 'card-trabalho';
            card.style.cursor = 'pointer';
            card.onclick = (e) => {
                if (!e.target.closest('button')) {
                    window.location.href = `detalhes-trabalho.html?id=${trabalho.id}`;
                }
            };

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
              
                </div>
            `;

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao filtrar trabalhos:', error);
        container.innerHTML = '<p style="color:red">Erro ao carregar trabalhos.</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const botoesCategoria = document.querySelectorAll('.card-cat');

    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', () => {

            botoesCategoria.forEach(b => b.classList.remove('active'));

            botao.classList.add('active');

            const categoria = botao.getAttribute('data-categoria');

            if (categoria) {
                filtrarPorCategoria(categoria);
            }
        });
    });
});