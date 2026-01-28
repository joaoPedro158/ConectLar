async function carregarFeedGeral() {
    try {

        if (!localStorage.getItem('token_conectlar')) {
            window.location.href = 'index.html';
        }
        const divLista = document.getElementById('listaOportunidades');
        const lista = await mandarProServidor('/trabalho/list', 'GET');
        divLista.innerHTML = '';
        lista.forEach(item => {
            if (item.status !== 'PENDENTE') return;
            const html = `
                <div class="cartao-servico">
                    <div class="info-topo">
                        <h3>${item.titulo} <small style="color: #00e0ff">(${item.categoria})</small></h3>
                        <p>${item.descricao}</p>
                        <p>📍 ${item.localizacao ? item.localizacao.cidade : 'BR'}</p>
                    </div>
                    <button class="botaozao-roxo" style="padding: 5px 15px; font-size: 0.9rem;" 
                        onclick="candidatarVaga(${item.id}, this)">
                        Aceitar
                    </button>
                </div>
            `;
            divLista.innerHTML += html;
        });
    } catch (e) {
        console.error(e);
    }
}

async function buscarVagas() {
    const termo = document.getElementById('campoBusca').value;
    alert('Busca simulada para: ' + termo);
    carregarFeedGeral();
}

async function candidatarVaga(idTrabalho, botao) {
    try {
        await mandarProServidor(`/trabalho/${idTrabalho}/candidatar`, 'POST');
        botao.innerText = "Aceito!";
        botao.disabled = true;
        botao.style.background = "#00875f";
    } catch (e) {
        alert('Erro ao se candidatar.');
    }
}
