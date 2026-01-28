async function carregarDadosHistorico() {
    try {
        const resposta = await fetch('URL_API'); //URL da API
        const dados = await resposta.json();
        
        atualizarStats(dados.stats);
        renderizarPedidos(dados.pedidos);
    } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
        document.getElementById('lista-pedidos').innerHTML = "<p>Erro ao carregar dados.</p>";
    }
}

function atualizarStats(stats) {
  document.getElementById("total-pedidos").textContent = stats.total ?? 0;
  document.getElementById("pedidos-concluidos").textContent = stats.concluidos ?? 0;

  const gasto = Number(stats.gastoTotal ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  document.getElementById("gasto-total").textContent = gasto;
}


function renderizarPedidos(pedidos) {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = ""; 

    pedidos.forEach(pedido => {
        const card = document.createElement('div');
        card.className = 'card-pedido';
        
        card.innerHTML = `
            <div class="card-header">
                <span class="badge categoria-badge">${pedido.categoria}</span>
                <span class="badge status-badge ${pedido.status.toLowerCase()}">${pedido.status}</span>
            </div>
            <h2>${pedido.titulo}</h2>
            <div class="card-footer">
                <span class="data">📅 ${pedido.data}</span>
                <span class="preco">R$ ${pedido.valor}</span>
            </div>
        `;
        lista.appendChild(card);
    });
}
carregarDadosHistorico();