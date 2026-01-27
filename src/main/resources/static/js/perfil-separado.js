// JavaScript do Perfil
let usuarioAtual = null;

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    carregarPerfil();
});

function voltarHome() {
    const role = localStorage.getItem('usuario_role');
    if (role === 'PROFISSIONAL') {
        window.location.href = 'feed-trabalhador.html';
    } else {
        window.location.href = 'painel-cliente.html';
    }
}

function mostrarTab(tabName) {
    // Esconder todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remover active de todos os botões
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar tab selecionada
    document.getElementById(`tab-${tabName}`).classList.add('active');
    event.target.classList.add('active');
}

async function carregarPerfil() {
    try {
        usuarioAtual = await buscarMeuPerfil();
        
        if (!usuarioAtual) {
            throw new Error('Perfil não encontrado');
        }

        // Preencher informações principais
        document.getElementById('nomeUsuario').textContent = usuarioAtual.nome || 'Nome não informado';
        document.getElementById('emailUsuario').textContent = usuarioAtual.email || 'Email não informado';
        
        const role = localStorage.getItem('usuario_role') || 'USUARIO';
        document.getElementById('roleUsuario').textContent = role;
        
        // Preencher formulário de dados
        document.getElementById('inputNome').value = usuarioAtual.nome || '';
        document.getElementById('inputEmail').value = usuarioAtual.email || '';
        document.getElementById('inputTelefone').value = usuarioAtual.telefone || '';
        
        // Mostrar categoria apenas para profissionais
        if (role === 'PROFISSIONAL') {
            document.getElementById('grupoCategoria').style.display = 'block';
            document.getElementById('inputCategoria').value = usuarioAtual.categoria || 'GERAL';
        }
        
        // Preencher endereço
        if (usuarioAtual.localizacao) {
            const loc = usuarioAtual.localizacao;
            document.getElementById('inputCep').value = loc.cep || '';
            document.getElementById('inputCidade').value = loc.cidade || '';
            document.getElementById('inputEstado').value = loc.estado || '';
            document.getElementById('inputRua').value = loc.rua || '';
            document.getElementById('inputBairro').value = loc.bairro || '';
            document.getElementById('inputNumero').value = loc.numero || '';
            document.getElementById('inputComplemento').value = loc.complemento || '';
        }
        
        // Foto de perfil
        if (usuarioAtual.fotoPerfil) {
            document.getElementById('fotoUsuario').src = `/uploads/${usuarioAtual.fotoPerfil}`;
        }
        
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        document.getElementById('meuPerfil').innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <h2>Erro ao carregar perfil</h2>
                <p>Não foi possível carregar suas informações.</p>
            </div>
        `;
    }
}

function atualizarFoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('fotoUsuario').src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function salvarDadosPessoais(e) {
    e.preventDefault();
    
    const dados = {
        nome: document.getElementById('inputNome').value,
        telefone: document.getElementById('inputTelefone').value,
        categoria: document.getElementById('inputCategoria').value
    };

    try {
        const role = localStorage.getItem('usuario_role');
        const endpoint = role === 'PROFISSIONAL' ? '/profissional/update' : '/usuario/update';
        
        const formData = new FormData();
        formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
        
        const arquivoInput = document.getElementById('inputFoto');
        if (arquivoInput && arquivoInput.files[0]) {
            formData.append('arquivo', arquivoInput.files[0]);
        }

        await enviarRequisicao(endpoint, 'PUT', formData, true);
        alert('Dados salvos com sucesso!');
        carregarPerfil(); // Recarregar dados
    } catch (error) {
        alert('Erro ao salvar dados: ' + error.message);
    }
}

async function salvarEndereco(e) {
    e.preventDefault();
    
    const dados = {
        localizacao: {
            cep: document.getElementById('inputCep').value,
            rua: document.getElementById('inputRua').value,
            bairro: document.getElementById('inputBairro').value,
            numero: document.getElementById('inputNumero').value,
            cidade: document.getElementById('inputCidade').value,
            estado: document.getElementById('inputEstado').value,
            complemento: document.getElementById('inputComplemento').value
        }
    };

    try {
        const role = localStorage.getItem('usuario_role');
        const endpoint = role === 'PROFISSIONAL' ? '/profissional/update' : '/usuario/update';
        
        const formData = new FormData();
        formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));

        await enviarRequisicao(endpoint, 'PUT', formData, true);
        alert('Endereço salvo com sucesso!');
        carregarPerfil(); // Recarregar dados
    } catch (error) {
        alert('Erro ao salvar endereço: ' + error.message);
    }
}

async function alterarSenha(e) {
    e.preventDefault();
    
    const senhaAtual = document.getElementById('inputSenhaAtual').value;
    const novaSenha = document.getElementById('inputNovaSenha').value;
    const confirmarSenha = document.getElementById('inputConfirmarSenha').value;
    
    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }
    
    if (novaSenha.length < 6) {
        alert('A nova senha deve ter pelo menos 6 caracteres!');
        return;
    }

    try {
        const dados = {
            senhaAtual: senhaAtual,
            novaSenha: novaSenha
        };

        const role = localStorage.getItem('usuario_role');
        const endpoint = role === 'PROFISSIONAL' ? '/profissional/update' : '/usuario/update';
        
        const formData = new FormData();
        formData.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));

        await enviarRequisicao(endpoint, 'PUT', formData, true);
        alert('Senha alterada com sucesso!');
        e.target.reset();
    } catch (error) {
        alert('Erro ao alterar senha: ' + error.message);
    }
}

// Configurar eventos dos formulários
document.addEventListener('DOMContentLoaded', () => {
    const formDados = document.getElementById('formDadosPessoais');
    const formEndereco = document.getElementById('formEndereco');
    const formSenha = document.getElementById('formSenha');

    if (formDados) {
        formDados.addEventListener('submit', salvarDadosPessoais);
    }

    if (formEndereco) {
        formEndereco.addEventListener('submit', salvarEndereco);
    }

    if (formSenha) {
        formSenha.addEventListener('submit', alterarSenha);
    }
});

// Funções globais para uso no HTML
window.voltarHome = voltarHome;
window.mostrarTab = mostrarTab;
window.atualizarFoto = atualizarFoto;
