const URL_API = 'http://localhost:8181';
let modoAtual = 'LOGIN';
let tipoUsuarioCadastro = 'CLIENTE';



function alternarModo() {
    const titulo = document.querySelector('.titulo-bonitao');
    const btn = document.getElementById('btnAcao');
    const link = document.getElementById('linkTroca');
    const camposExtras = document.getElementById('camposCadastro');
    const secaoTipo = document.getElementById('secaoTipo');

    if (modoAtual === 'LOGIN') {
        modoAtual = 'CADASTRO';
        titulo.innerText = 'Criar Nova Conta';
        btn.innerText = 'Cadastrar-se';
        link.innerText = 'Já tem conta? Entrar.';
        camposExtras.classList.remove('escondido');
        secaoTipo.classList.remove('escondido');
    } else {
        modoAtual = 'LOGIN';
        titulo.innerText = 'ConectLar';
        btn.innerText = 'Entrar no Sistema';
        link.innerText = 'Não tem conta? Crie agora!';
        camposExtras.classList.add('escondido');
        secaoTipo.classList.add('escondido');
    }
}

function mudarTipo(botao) {
    // Remove classe 'selecionado' de todos e adiciona no clicado
    document.querySelectorAll('.botaozinho-tipo').forEach(b => b.classList.remove('selecionado'));
    botao.classList.add('selecionado');
    tipoUsuarioCadastro = botao.getAttribute('data-tipo');
}

function abrirModal() {
    document.getElementById('modalNovoPedido').classList.remove('escondido');
}

function fecharModal() {
    document.getElementById('modalNovoPedido').classList.add('escondido');
}

function fazerLogout() {
    localStorage.removeItem('token_conectlar');
    localStorage.removeItem('tipo_usuario');
    window.location.href = 'index.html';
}


async function mandarProServidor(endpoint, metodo, corpo = null, temArquivo = false) {
    const token = localStorage.getItem('token_conectlar');
    const headers = {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const opcoes = {
        method: metodo,
        headers: headers
    };

    if (corpo) {
        if (temArquivo) {

            opcoes.body = corpo;
        } else {

            headers['Content-Type'] = 'application/json';
            opcoes.body = JSON.stringify(corpo);
        }
    }

    try {
        const resposta = await fetch(`${URL_API}${endpoint}`, opcoes);
        const texto = await resposta.text();
        const json = (() => {
            try { return texto ? JSON.parse(texto) : null; } catch(e) { return null; }
        })();

        if (!resposta.ok) {
            // Prioriza mensagens de erro vindas do servidor (objeto JSON ou campo 'error')
            if (json) {
                // Se for objeto de campos de validação, formata legível
                if (typeof json === 'object' && !Array.isArray(json)) {
                    const partes = Object.entries(json).map(([k,v]) => `${k}: ${v}`).join('\n');
                    throw new Error(partes || JSON.stringify(json));
                }
                throw new Error(JSON.stringify(json));
            }
            throw new Error('Deu ruim na requisição: ' + resposta.status);
        }

        return json || {};
    } catch (erro) {
        console.error(erro);
        // Mostra mensagem de erro mais específica quando disponível
        alert(erro.message || 'Erro de conexão. O servidor tá ligado?');
        throw erro;
    }
}



const formAuth = document.getElementById('formAutenticacao');
if (formAuth) {
    formAuth.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = new FormData(formAuth);

        if (modoAtual === 'LOGIN') {

            const payload = {
                login: dados.get('login'),
                senha: dados.get('senha')
            };

            try {
                const resp = await mandarProServidor('/auth/login', 'POST', payload);
                // resp expected: { token: '...'}
                localStorage.setItem('token_conectlar', resp.token);

                window.location.href = 'painel-cliente.html';
            } catch (e) {
                // e.message já contém a mensagem detalhada se o servidor retornou uma
                // Mostra mensagem amigável
                alert(e.message || 'Login falhou. Senha errada?');
            }

        } else {

            // Construir payload compatível com UsuarioRecord (espera `localizacao`)
            const jsonDados = {
                email: dados.get('login') || `sem-email-${Date.now()}@local.test`, // fallback dev-only
                senha: dados.get('senha'),
                nome: dados.get('nome'),
                telefone: dados.get('telefone'),
                localizacao: {
                    rua: dados.get('rua') || "Rua padrão",
                    bairro: dados.get('bairro') || "",
                    numero: dados.get('numero') || "0",
                    cidade: dados.get('cidade') || "Não informada",
                    cep: dados.get('cep') || "",
                    estado: dados.get('estado') || "",
                    complemento: dados.get('complemento') || ""
                },
                // O backend espera os valores do enum: 'USUARIO' ou 'PROFISSIONAL'
                role: (tipoUsuarioCadastro === 'CLIENTE') ? 'USUARIO' : 'PROFISSIONAL'
            };

            const formDataApi = new FormData();
            // O Java espera @RequestPart("dados") como JSON e @RequestPart("arquivo") como File
            const blobJson = new Blob([JSON.stringify(jsonDados)], { type: 'application/json' });

            formDataApi.append('dados', blobJson);

            const arquivoInput = document.getElementById('arquivoFoto');
            if (arquivoInput.files[0]) {
                formDataApi.append('arquivo', arquivoInput.files[0]);
            }

            // Rotas ajustadas para corresponder ao backend (RotasBases.Cadastra == "/form")
            const rota = tipoUsuarioCadastro === 'CLIENTE' ? '/usuario/form' : '/profissional/form';

            try {
                await mandarProServidor(rota, 'POST', formDataApi, true);
                alert('Conta criada com sucesso! Agora faz o login aí.');
                alternarModo();
            } catch (e) {
                alert('Erro ao cadastrar. Tente novamente.');
            }
        }
    });
}

// === LÓGICA DO CLIENTE (PAINEL) ===

const formNovoTrabalho = document.getElementById('formNovoTrabalho');
if (formNovoTrabalho) {
    formNovoTrabalho.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Montar o objeto DTO Java
        const dtoTrabalho = {
            titulo: document.getElementById('tituloServico').value,
            descricao: document.getElementById('descServico').value,
            categoria: document.getElementById('categoriaServico').value,
            status: "PENDENTE",
            localizacao: {
                cidade: document.getElementById('localServico').value
            }
        };

        const formDataTrabalho = new FormData();
        const blobJson = new Blob([JSON.stringify(dtoTrabalho)], { type: 'application/json' });
        formDataTrabalho.append('dados', blobJson);

        // Java pede List<MultipartFile> chamado "imagen" (note o 'n' no final que vi no seu Java)
        const fileInput = document.getElementById('fotoServico');
        if (fileInput.files[0]) {
            formDataTrabalho.append('imagen', fileInput.files[0]);
        }

        try {
            // backend espera /trabalho/form
            await mandarProServidor('/trabalho/form', 'POST', formDataTrabalho, true);
            alert('Serviço publicado!');
            fecharModal();
            carregarMeusPedidos();
        } catch (e) {
            alert('Erro ao publicar serviço.');
        }
    });
}

async function carregarMeusPedidos() {
    try {
        const divLista = document.getElementById('listaMeusPedidos');
        // Usa a rota de histórico que retorna os trabalhos do usuário logado
        const lista = await mandarProServidor('/usuario/historico', 'GET');

        divLista.innerHTML = '';
        if (lista.length === 0) {
            divLista.innerHTML = '<p style="text-align: center; color: #a8a8b3;">Você ainda não tem pedidos.</p>';
            return;
        }

        lista.forEach(item => {
            const html = `
                <div class="cartao-servico">
                    <div class="info-topo">
                        <h3>${item.titulo}</h3>
                        <p>${item.localizacao ? item.localizacao.cidade : 'Sem local'}</p>
                    </div>
                    <span class="etiqueta-status ${item.status === 'PENDENTE' ? 'pendente' : 'concluido'}">
                        ${item.status}
                    </span>
                </div>
            `;
            divLista.innerHTML += html;
        });
    } catch (e) {
        console.log("Erro ao carregar histórico (se você for profissional, essa rota muda)");
        // Se der erro, pode ser que o usuário seja profissional tentando acessar página de cliente
    }
}

// === LÓGICA DO PROFISSIONAL (FEED) ===

async function carregarFeedGeral() {
    try {
        const divLista = document.getElementById('listaOportunidades');
        const lista = await mandarProServidor('/trabalho/list', 'GET');

        divLista.innerHTML = '';
        lista.forEach(item => {
            // Só mostra se for pendente (opcional)
            if (item.status !== 'PENDENTE') return;

            const html = `
                <div class="cartao-servico">
                    <div class="info-topo">
                        <h3>${item.titulo} <small style="color: #8257e6">(${item.categoria})</small></h3>
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
    // Implementar endpoint de busca se existir, ou filtrar no front
    // await mandarProServidor(`/trabalho/busca?termo=${termo}`, 'GET');
    alert('Busca simulada para: ' + termo);
    carregarFeedGeral(); // Recarrega tudo por enquanto
}

async function candidatarVaga(idTrabalho, botao) {
    try {
        // rota no backend é /trabalho/{id}/candidatar
        await mandarProServidor(`/trabalho/${idTrabalho}/candidatar`, 'POST');
        botao.innerText = "Aceito!";
        botao.disabled = true;
        botao.style.background = "#00875f";
    } catch (e) {
        alert('Erro ao se candidatar.');
    }
}

// --- Funções completas para cobrir os endpoints do backend ---

// USUÁRIO
async function usuarioCriar(formData) {
    return await mandarProServidor('/usuario/form', 'POST', formData, true);
}

async function usuarioAtualizar(formData) {
    // O backend espera PUT /usuario/update com multipart
    return await mandarProServidor('/usuario/update', 'PUT', formData, true);
}

async function usuarioListar() {
    return await mandarProServidor('/usuario/list', 'GET');
}

async function usuarioDeletar(id){
    return await mandarProServidor(`/usuario/delete/${id}`, 'DELETE');
}

async function usuarioHistorico(){
    return await mandarProServidor('/usuario/historico', 'GET');
}

// PROFISSIONAL
async function profissionalCriar(formData){
    return await mandarProServidor('/profissional/form', 'POST', formData, true);
}

async function profissionalListar(){
    return await mandarProServidor('/profissional/list', 'GET');
}

async function profissionalDeletar(id){
    return await mandarProServidor(`/profissional/delete/${id}`, 'DELETE');
}

async function profissionalAtualizar(formData){
    return await mandarProServidor('/profissional/update', 'PUT', formData, true);
}

async function profissionalHistorico(){
    return await mandarProServidor('/profissional/historico', 'GET');
}

// TRABALHO
async function trabalhoCriar(formData){
    return await mandarProServidor('/trabalho/form', 'POST', formData, true);
}

async function trabalhoListar(){
    return await mandarProServidor('/trabalho/list', 'GET');
}

async function trabalhoBuscarPorId(id){
    return await mandarProServidor(`/trabalho/${id}`, 'GET');
}

async function trabalhoAtualizar(id, formData){
    return await mandarProServidor(`/trabalho/update/${id}`, 'PUT', formData, true);
}

async function trabalhoDeletar(id){
    return await mandarProServidor(`/trabalho/delete/${id}`, 'DELETE');
}

async function trabalhoCandidatar(id){
    return await mandarProServidor(`/trabalho/${id}/candidatar`, 'POST');
}

async function trabalhoResponder(idTrabalho, resposta){
    return await mandarProServidor(`/trabalho/${idTrabalho}/responder`, 'POST', resposta);
}

async function trabalhoCancelar(idTrabalho){
    return await mandarProServidor(`/trabalho/${idTrabalho}/cancelar`, 'POST');
}

async function trabalhoConcluir(idTrabalho){
    return await mandarProServidor(`/trabalho/${idTrabalho}/concluir`, 'POST');
}

async function trabalhoBuscar(termo){
    return await mandarProServidor(`/trabalho/busca?termo=${encodeURIComponent(termo)}`, 'GET');
}

async function trabalhoFiltrarCategoria(categoria){
    return await mandarProServidor(`/trabalho/filtro/categoria?termo=${encodeURIComponent(categoria)}`, 'GET');
}

// AVALIAÇÃO
async function avaliar(idTrabalho, nota, comentario){
    return await mandarProServidor(`/avaliacao/avaliar/${idTrabalho}`, 'POST', {nota, comentario});
}

// ADM
async function admListar(){
    return await mandarProServidor('/adm/list', 'GET');
}

async function admCriar(payload){
    return await mandarProServidor('/adm/form', 'POST', payload);
}

async function admBuscarPorId(id){
    return await mandarProServidor(`/adm/${id}`, 'GET');
}

async function admAtualizar(id, payload){
    // o backend tem mapeamento PUT /adm/update (possível discrepância com path var), tentamos enviar para /adm/update/{id}
    return await mandarProServidor(`/adm/update/${id}`, 'PUT', payload);
}

async function admDeletar(id){
    return await mandarProServidor(`/adm/delete/${id}`, 'DELETE');
}

// Export/attach functions to window for debug/console usage
window.api = {
    usuarioCriar, usuarioAtualizar, usuarioListar, usuarioDeletar, usuarioHistorico,
    profissionalCriar, profissionalListar, profissionalDeletar, profissionalAtualizar, profissionalHistorico,
    trabalhoCriar, trabalhoListar, trabalhoBuscarPorId, trabalhoAtualizar, trabalhoDeletar, trabalhoCandidatar,
    trabalhoResponder, trabalhoCancelar, trabalhoConcluir, trabalhoBuscar, trabalhoFiltrarCategoria,
    avaliar,
    admListar, admCriar, admBuscarPorId, admAtualizar, admDeletar
};
