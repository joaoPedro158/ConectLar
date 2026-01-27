// Funções do painel do cliente

// 1. Carregar Histórico (GET /usuario/historico)
async function carregarMeusPedidos() {
    const divLista = document.getElementById('listaMeusPedidos');

    try {
        // Rota definida no UsuarioController: @GetMapping("/historico")
        const lista = await mandarProServidor('/usuario/historico', 'GET');

        divLista.innerHTML = '';

        if (!lista || lista.length === 0) {
            divLista.innerHTML = `
                <div class="aviso-vazio">
                    <p>Você ainda não tem pedidos.</p>
                    <small>Clique no + para criar um.</small>
                </div>`;
            return;
        }

        // Renderiza os cards
        lista.forEach(item => {
            // Define cor do status
            let classeStatus = 'status-pendente';
            if(item.status === 'CONCLUIDO') classeStatus = 'status-concluido';
            if(item.status === 'EM_ANDAMENTO') classeStatus = 'status-andamento';

            const cidade = item.localizacao ? item.localizacao.cidade : 'Sem local';

            const html = `
                <div class="cartao-servico">
                    <div class="info-topo">
                        <div style="display:flex; justify-content:space-between;">
                            <h3>${item.titulo}</h3>
                            <span class="etiqueta-categoria">${item.categoria}</span>
                        </div>
                        <p class="desc">${item.descricao}</p>
                        <small>📍 ${cidade}</small>
                    </div>
                    <div class="rodape-card">
                        <span class="etiqueta-status ${classeStatus}">
                            ${item.status}
                        </span>
                        ${item.status === 'PENDENTE' ?
                `<button onclick="cancelarPedido(${item.id})" class="btn-cancelar">Cancelar</button>` : ''}
                        
                         ${item.status === 'EM_ANDAMENTO' ?
                `<button onclick="concluirPedido(${item.id})" class="botaozao-roxo" style="padding: 5px 10px; font-size: 0.8rem">Finalizar</button>` : ''}
                    </div>
                </div>
            `;
            divLista.innerHTML += html;
        });

    } catch (e) {
        console.error(e);
        divLista.innerHTML = '<p style="color: red; text-align: center;">Erro ao carregar pedidos. Tente logar novamente.</p>';
    }
}

// 2. Criar Novo Trabalho (POST /trabalho/form)
const formNovoTrabalho = document.getElementById('formNovoTrabalho');
if (formNovoTrabalho) {
    formNovoTrabalho.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Monta o objeto JSON (TrabalhoRecord)
        const dtoTrabalho = {
            titulo: document.getElementById('tituloServico').value,
            descricao: document.getElementById('descServico').value,
            categoria: document.getElementById('categoriaServico').value,
            status: "PENDENTE",
            localizacao: {
                cidade: document.getElementById('cidadeServico').value,
                estado: document.getElementById('estadoServico').value
            }
        };

        // Prepara o Multipart (Arquivo + JSON)
        const formData = new FormData();

        // O Backend espera @RequestPart("dados")
        const blobJson = new Blob([JSON.stringify(dtoTrabalho)], { type: 'application/json' });
        formData.append('dados', blobJson);

        // O Backend espera @RequestPart("imagen") <-- ATENÇÃO: Teu controller tá escrito "imagen" com N
        const fileInput = document.getElementById('fotoServico');
        if (fileInput && fileInput.files[0]) {
            formData.append('imagen', fileInput.files[0]);
        }

        try {
            // Chama a função utilitária com flag de arquivo = true
            // Rota: /trabalho/form
            await mandarProServidor('/trabalho/form', 'POST', formData, true);

            alert('Serviço publicado com sucesso!');
            fecharModal();
            formNovoTrabalho.reset();
            carregarMeusPedidos(); // Recarrega a lista

        } catch (erro) {
            console.error(erro);
            alert('Erro ao publicar: ' + erro.message);
        }
    });
}

// 3. Cancelar Pedido (POST /trabalho/{id}/cancelar)
async function cancelarPedido(id) {
    if(!confirm("Tem certeza que deseja cancelar?")) return;
    try {
        await mandarProServidor(`/trabalho/${id}/cancelar`, 'POST');
        alert("Cancelado!");
        carregarMeusPedidos();
    } catch (e) {
        alert("Erro ao cancelar.");
    }
}

// 4. Concluir Pedido (POST /trabalho/{id}/concluir)
async function concluirPedido(id) {
    if(!confirm("O serviço foi realizado?")) return;
    try {
        await mandarProServidor(`/trabalho/${id}/concluir`, 'POST');
        alert("Trabalho concluído!");
        // Aqui poderia abrir modal de avaliação
        carregarMeusPedidos();
    } catch (e) {
        alert("Erro ao concluir.");
    }
}