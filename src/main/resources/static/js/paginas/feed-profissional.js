document.addEventListener('DOMContentLoaded', () => {
  verificarAutenticacao();

  // carrega o feed automaticamente
  carregarFeedGeral();
});

async function carregarFeedGeral() {
  const container = document.getElementById('listaOportunidades');
  if (!container) return;

  try {
    const trabalhos = await requisicao('/trabalho/list', 'GET');
    container.innerHTML = '';

    const abertos = Array.isArray(trabalhos) ? trabalhos.filter(t => t.status === 'ABERTO') : [];

    if (abertos.length === 0) {
      container.innerHTML = '<p class="mensagem-vazia">Nenhuma oportunidade disponível no momento.</p>';
      return;
    }

    abertos.forEach(trabalho => {
      const card = document.createElement('div');
      card.className = 'card-trabalho';

      const cidade = trabalho.localizacao?.cidade || 'Não informada';
      const estado = trabalho.localizacao?.estado || 'RN';

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
          <button class="btn-pesquisar" onclick="candidatar(${trabalho.id}, this)">
            Candidatar-se
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (e) {
    console.error('Erro ao carregar feed:', e);
    container.innerHTML = '<p style="color:red">Erro ao carregar oportunidades.</p>';
  }
}

window.buscarVagas = async function () {
  const termo = (document.getElementById('campoBusca')?.value || '').trim().toLowerCase();

  // Sem API de busca? faz filtro no front mesmo
  const container = document.getElementById('listaOportunidades');
  if (!container) return;

  try {
    const trabalhos = await requisicao('/trabalho/list', 'GET');
    container.innerHTML = '';

    const filtrados = (Array.isArray(trabalhos) ? trabalhos : [])
      .filter(t => t.status === 'ABERTO')
      .filter(t => {
        if (!termo) return true;
        const texto = `${t.problema || ''} ${t.descricao || ''} ${t.categoria || ''}`.toLowerCase();
        return texto.includes(termo);
      });

    if (filtrados.length === 0) {
      container.innerHTML = '<p class="mensagem-vazia">Nenhuma vaga encontrada.</p>';
      return;
    }

    filtrados.forEach(t => {
      const cidade = t.localizacao?.cidade || 'Não informada';
      const estado = t.localizacao?.estado || 'RN';

      const card = document.createElement('div');
      card.className = 'card-trabalho';
      card.innerHTML = `
        <div class="info-trabalho">
          <h3>${t.problema || 'Sem título'}</h3>
          <p class="descricao">${t.descricao || 'Sem descrição'}</p>
          <div class="detalhes">
            <span>📍 ${cidade} - ${estado}</span>
            <span>🔧 ${t.categoria || 'Geral'}</span>
            <span>💰 R$ ${t.pagamento || '0,00'}</span>
          </div>
        </div>
        <div class="acoes">
          <button class="btn-pesquisar" onclick="candidatar(${t.id}, this)">
            Candidatar-se
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    container.innerHTML = '<p style="color:red">Erro ao buscar vagas.</p>';
  }
};

window.candidatar = async function(idTrabalho, botao) {
  if (botao?.disabled) return;

  botao.disabled = true;
  botao.innerText = 'Processando...';

  try {
    await requisicao(`/trabalho/${idTrabalho}/candidatar`, 'POST');
    botao.innerText = 'Candidatura Enviada!';
  } catch (e) {
    console.error('Erro ao candidatar:', e);
    botao.innerText = 'Erro ao candidatar';
    botao.disabled = false;
  }
};
