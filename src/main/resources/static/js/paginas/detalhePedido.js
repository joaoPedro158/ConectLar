
document.addEventListener('DOMContentLoaded', async () => {

    if (typeof verificarAutenticacao === 'function') {
        verificarAutenticacao();
    }


    const params = new URLSearchParams(window.location.search);
    const idTrabalho = params.get('id');

    if (!idTrabalho) {
        alert("Trabalho não identificado.");
        window.location.href = 'painel-cliente.html';
        return;
    }

    try {

        const trabalho = await requisicao(`/trabalho/${idTrabalho}`, 'GET');

        preencherTela(trabalho);

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);
        document.getElementById('loading').innerHTML = `<h3 class="erro-msg">Erro ao carregar os dados: ${erro.message}</h3><a href="painel-cliente.html" class="btn-voltar">Voltar</a>`;
    }
});

function preencherTela(t) {

    console.log("Dados do Trabalho:", t);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('conteudoDetalhes').style.display = 'block';

    setText('titulo', t.problema || 'Sem título');
    setText('categoria', t.categoria || 'Geral');
    setText('descricao', t.descricao || 'Sem descrição informada.');


    const valorFormatado = t.pagamento
        ? t.pagamento.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        : 'A Combinar';
    setText('valor', valorFormatado);


    const dataCrua = t.dataHoraAberta || t.dataHoraAbertura || t.dataCriacao || t.data;

    if (dataCrua) {
        const dataObj = new Date(dataCrua);


        if (!isNaN(dataObj.getTime())) {
            const dataLegivel = dataObj.toLocaleDateString('pt-BR') + ' às ' + dataObj.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
            setText('data', dataLegivel);
        } else {
            setText('data', 'Data inválida');
        }
    } else {
        setText('data', 'Data não informada');
    }

    // --- Status ---
    const elStatus = document.getElementById('status');
    const statusTexto = (t.status || 'ABERTO').replace(/_/g, ' ');
    elStatus.innerText = statusTexto;
    elStatus.className = `status-badge status-${t.status}`;


    const loc = t.localizacao || {};
    const divEnd = document.getElementById('listaEndereco');

    const itensEnd = [
        loc.rua ? `Rua: ${loc.rua}` : null,
        loc.numero ? `Nº: ${loc.numero}` : null,
        loc.bairro ? `Bairro: ${loc.bairro}` : null,
        loc.cidade ? `Cidade: ${loc.cidade}` : null,
        loc.estado ? `UF: ${loc.estado}` : null,
        loc.cep ? `CEP: ${loc.cep}` : null,
        loc.complemento ? `Ref: ${loc.complemento}` : null
    ];


    divEnd.innerHTML = itensEnd
        .filter(item => item !== null)
        .map(item => `<div class="item-end">${item}</div>`)
        .join('');

    if (divEnd.innerHTML === '') {
        divEnd.innerHTML = '<span style="color:#666;">Endereço não informado.</span>';
    }


    const divGaleria = document.getElementById('galeriaImagens');
    if (divGaleria) {
        let listaImagens = [];

        if (Array.isArray(t.imagens)) {
            listaImagens = t.imagens;
        } else if (t.caminhoImagem) {
            listaImagens = [t.caminhoImagem];
        } else if (t.imagem) {
            listaImagens = [t.imagem];
        } else if (t.foto) {
            listaImagens = [t.foto];
        }

        // Renderiza
        if (listaImagens.length > 0) {
            divGaleria.innerHTML = listaImagens.map(img => {
                if (!img) return '';
                const src = (img.startsWith('http') || img.startsWith('/')) ? img : `/upload/${img}`;
                return `<img src="${src}" class="img-detalhe" onclick="window.open('${src}', '_blank')" title="Clique para ampliar">`;
            }).join('');
        } else {
            divGaleria.innerHTML = '<span class="sem-imagem">Nenhuma imagem anexada.</span>';
        }
    }


    function setText(id, valor) {
        const el = document.getElementById(id);
        if (el) el.innerText = valor;
    }
}