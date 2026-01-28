document.addEventListener('DOMContentLoaded', () => {
    // --- NOVO: Lógica dos Botões de Categoria ---
    const botoesCategoria = document.querySelectorAll('.card-cat');

    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', () => {
            // 1. Remove o visual de 'selecionado' dos outros botões
            botoesCategoria.forEach(b => b.classList.remove('active'));

            // 2. Marca o botão atual como selecionado
            botao.classList.add('active');

            // 3. Pega a categoria e chama a função de filtro
            const categoria = botao.getAttribute('data-categoria');
            if (categoria) {
                // Certifique-se de que a função filtrarPorCategoria está no arquivo!
                filtrarPorCategoria(categoria);
            }
        });
    });
    // ---------------------------------------------


    // --- SEU CÓDIGO EXISTENTE ABAIXO ---
    const botoesAceitar = document.querySelectorAll('[onclick*="responderSolicitacao"]');
    // Note: botoesRecusar seleciona a mesma coisa que botoesAceitar no seu código original,
    // mas mantive conforme você mandou.
    const botoesFinalizar = document.querySelectorAll('[onclick*="finalizarTrabalho"]');
    const botoesCancelar = document.querySelectorAll('[onclick*="cancelarTrabalho"]');
    const modalFechar = document.querySelector('[onclick*="fecharModalDetalhes"]');
    const modalAbrir = document.querySelector('[onclick*="abrirModal"]');

    botoesAceitar.forEach(botao => {
        const match = botao.getAttribute('onclick').match(/responderSolicitacao\((\d+),\s*(true|false)\)/);
        if (match) {
            const [, id, aceitar] = match;
            botao.removeAttribute('onclick');
            botao.addEventListener('click', (e) => {
                e.stopPropagation(); // Previne clique duplo se estiver dentro de um card
                window.responderSolicitacao(parseInt(id), aceitar === 'true');
            });
        }
    });

    botoesFinalizar.forEach(botao => {
        const match = botao.getAttribute('onclick').match(/finalizarTrabalho\((\d+)\)/);
        if (match) {
            const id = match[1];
            botao.removeAttribute('onclick');
            botao.addEventListener('click', (e) => {
                e.stopPropagation();
                window.finalizarTrabalho(parseInt(id));
            });
        }
    });

    botoesCancelar.forEach(botao => {
        const match = botao.getAttribute('onclick').match(/cancelarTrabalho\((\d+)\)/);
        if (match) {
            const id = match[1];
            botao.removeAttribute('onclick');
            botao.addEventListener('click', (e) => {
                e.stopPropagation();
                window.cancelarTrabalho(parseInt(id));
            });
        }
    });

    if (modalFechar) {
        modalFechar.removeAttribute('onclick');
        modalFechar.addEventListener('click', () => window.fecharModalDetalhes());
    }

    if (modalAbrir) {
        modalAbrir.removeAttribute('onclick');
        modalAbrir.addEventListener('click', () => window.abrirModal());
    }
});

// --- IMPORTANTE: COLOCAR A FUNÇÃO FORA DO DOMContentLoaded ---
async function filtrarPorCategoria(categoria) {
    const lista = document.getElementById('listaMeusPedidos');
    if(lista) lista.innerHTML = '<p class="carregando">Buscando trabalhos...</p>';

    try {
        // Chama seu endpoint novo
        const resultado = await requisicao(`/trabalho/filtro/categoria?termo=${encodeURIComponent(categoria)}`, 'GET');

        // Chama sua função de desenhar os cards (que criamos no passo anterior)
        renderizarListaTrabalhos(resultado);

    } catch (erro) {
        console.error("Erro ao filtrar:", erro);
        if(lista) lista.innerHTML = '<p class="erro">Erro ao buscar categoria. Tente novamente.</p>';
    }
}