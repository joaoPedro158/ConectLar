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




    const botoesAceitar = document.querySelectorAll('[onclick*="responderSolicitacao"]');

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
                e.stopPropagation();
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


async function filtrarPorCategoria(categoria) {
    const lista = document.getElementById('listaMeusPedidos');
    if(lista) lista.innerHTML = '<p class="carregando">Buscando trabalhos...</p>';

    try {

        const resultado = await requisicao(`/trabalho/filtro/categoria?termo=${encodeURIComponent(categoria)}`, 'GET');


        renderizarListaTrabalhos(resultado);

    } catch (erro) {
        console.error("Erro ao filtrar:", erro);
        if(lista) lista.innerHTML = '<p class="erro">Erro ao buscar categoria. Tente novamente.</p>';
    }
}