document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const textoAlternar = document.getElementById('textoAlternar');
    const btnLogin = document.getElementById('btnLogin');
    const btnCadastro = document.getElementById('btnCadastro');
    const inputFoto = document.getElementById('inputFoto');
    const campoCategoria = document.getElementById('campoCategoria');
    const containerTipoUsuario = document.getElementById('container-tipo-usuario');
    const grupoCadastro = document.getElementById('grupo-cadastro');
    const tipoUsuario = document.getElementById('tipoUsuario');

    const btnTipoCliente = document.getElementById('btnTipoCliente');
    const btnTipoProfissional = document.getElementById('btnTipoProfissional');

    const btnToggleSenha = document.getElementById('btnToggleSenha');

    let modoAtual = 'login';

    textoAlternar.addEventListener('click', () => {
        modoAtual = modoAtual === 'login' ? 'cadastro' : 'login';
        atualizarInterface();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (modoAtual === 'login') {
            await realizarLogin();
        } else {
            await realizarCadastro();
        }
    });

    if (btnToggleSenha) {
        btnToggleSenha.addEventListener('click', () => {
            const campoSenha = document.getElementById('senha');
            if (!campoSenha) return;
            const mostrando = campoSenha.type === 'text';
            campoSenha.type = mostrando ? 'password' : 'text';
            btnToggleSenha.setAttribute('aria-label', mostrando ? 'Mostrar senha' : 'Ocultar senha');
        });
    }

    if (inputFoto) {
        inputFoto.addEventListener('change', (e) => {
            const arquivo = e.target.files[0];
            if (arquivo) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const preview = document.getElementById('previewFoto');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(arquivo);
            }
        });
    }

    function definirTipo(tipo) {
        if (tipoUsuario) tipoUsuario.value = tipo;

        if (btnTipoCliente && btnTipoProfissional) {
            if (tipo === 'cliente') {
                btnTipoCliente.classList.add('selecionado');
                btnTipoProfissional.classList.remove('selecionado');
            } else {
                btnTipoProfissional.classList.add('selecionado');
                btnTipoCliente.classList.remove('selecionado');
            }
        }

        if (campoCategoria) {
            if (modoAtual === 'cadastro' && tipo === 'profissional') {
                campoCategoria.classList.remove('oculto');
            } else {
                campoCategoria.classList.add('oculto');
            }
        }
    }

    if (btnTipoCliente) btnTipoCliente.addEventListener('click', () => definirTipo('cliente'));
    if (btnTipoProfissional) btnTipoProfissional.addEventListener('click', () => definirTipo('profissional'));

    const camposCadastro = {
        nome: document.getElementById('nomeCadastro'),
        telefone: document.getElementById('telefone'),
        rua: document.getElementById('rua'),
        bairro: document.getElementById('bairro'),
        numero: document.getElementById('numero'),
        cidade: document.getElementById('cidade'),
        cep: document.getElementById('cep'),
        estado: document.getElementById('estado'),
        complemento: document.getElementById('complemento'),
        categoria: document.getElementById('categoria'),
        foto: document.getElementById('inputFoto')
    };

    function ativarCadastro(ativo) {
        Object.values(camposCadastro).forEach((el) => {
            if (!el) return;
            el.disabled = !ativo;
        });

        if (camposCadastro.nome) camposCadastro.nome.required = ativo;
        if (camposCadastro.rua) camposCadastro.rua.required = ativo;
        if (camposCadastro.bairro) camposCadastro.bairro.required = ativo;
        if (camposCadastro.numero) camposCadastro.numero.required = ativo;
        if (camposCadastro.cidade) camposCadastro.cidade.required = ativo;
        if (camposCadastro.cep) camposCadastro.cep.required = ativo;
        if (camposCadastro.estado) camposCadastro.estado.required = ativo;
    }

    function mensagemErroAmigavel(mensagem) {
        if (!mensagem) return 'Erro na requisição.';
        if (mensagem.includes('A senha deve ter no mínimo 8 caracteres')) return 'A senha deve ter no mínimo 8 caracteres.';
        if (mensagem.includes('já existe') || mensagem.includes('already')) return 'Já existe uma conta com esse e-mail.';
        return mensagem;
    }

    function atualizarInterface() {
        if (modoAtual === 'login') {
            textoAlternar.textContent = 'Não tem conta? Cadastre-se';
            btnLogin.style.display = 'block';
            btnCadastro.classList.add('oculto');

            if (grupoCadastro) grupoCadastro.classList.add('oculto');
            if (containerTipoUsuario) containerTipoUsuario.classList.add('oculto');

            ativarCadastro(false);

            definirTipo(tipoUsuario ? tipoUsuario.value : 'cliente');
        } else {
            textoAlternar.textContent = 'Já tem conta? Faça login';
            btnLogin.style.display = 'none';
            btnCadastro.classList.remove('oculto');

            if (grupoCadastro) grupoCadastro.classList.remove('oculto');
            if (containerTipoUsuario) containerTipoUsuario.classList.remove('oculto');

            ativarCadastro(true);

            definirTipo(tipoUsuario ? tipoUsuario.value : 'cliente');
        }
    }

    async function realizarLogin() {
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const tipo = document.getElementById('tipoUsuario').value;

        btnLogin.disabled = true;
        btnLogin.textContent = 'Entrando...';

        const resultado = await login(email, senha, tipo);

        if (!resultado.sucesso) {
            alert('Erro ao fazer login: ' + mensagemErroAmigavel(resultado.erro));
        }

        btnLogin.disabled = false;
        btnLogin.textContent = 'Entrar no Sistema';
    }

    async function realizarCadastro() {
        const nome = document.getElementById('nomeCadastro').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const telefone = document.getElementById('telefone').value;
        const tipo = document.getElementById('tipoUsuario').value;
        const categoria = document.getElementById('categoria').value;
        const arquivo = inputFoto.files[0];

        if (!senha || senha.length < 8) {
            alert('A senha deve ter no mínimo 8 caracteres.');
            document.getElementById('senha').focus();
            return;
        }

        if (!/.*[a-z].*/.test(senha)) {
            alert('A senha deve conter pelo menos uma letra minúscula.');
            document.getElementById('senha').focus();
            return;
        }

        if (!/.*[A-Z].*/.test(senha)) {
            alert('A senha deve conter pelo menos uma letra maiúscula.');
            document.getElementById('senha').focus();
            return;
        }

        if (!/.*[0-9].*/.test(senha)) {
            alert('A senha deve conter pelo menos um número.');
            document.getElementById('senha').focus();
            return;
        }

        if (tipo === 'profissional' && (!categoria || categoria.trim() === '')) {
            alert('Selecione sua categoria profissional.');
            if (camposCadastro.categoria) camposCadastro.categoria.focus();
            return;
        }

        const rua = document.getElementById('rua').value;
        const bairro = document.getElementById('bairro').value;
        const numero = document.getElementById('numero').value;
        const cidade = document.getElementById('cidade').value;
        const cep = document.getElementById('cep').value;
        const estado = document.getElementById('estado').value;
        const complemento = document.getElementById('complemento').value;

        const role = tipo === 'profissional' ? 'PROFISSIONAL' : 'USUARIO';

        const dados = {
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone,
            localizacao: {
                cidade: cidade,
                estado: estado,
                rua: rua,
                bairro: bairro,
                numero: numero,
                cep: cep,
                complemento: complemento
            },
            role: role
        };

        if (tipo === 'profissional') {
            dados.categoria = categoria;
        }

        btnCadastro.disabled = true;
        btnCadastro.textContent = 'Cadastrando...';

        const resultado = await cadastrarUsuario(dados, arquivo, tipo);

        if (resultado.sucesso) {
            if (resultado.loginAutomatico) {
                // Login automático funcionou, redirecionamento já foi feito
                return;
            } else {
                // Cadastro funcionou mas login automático falhou
                alert('Cadastro realizado com sucesso! Por favor, faça login manualmente.');
                modoAtual = 'login';
                atualizarInterface();
                document.getElementById('email').value = email;
                document.getElementById('senha').value = '';
                document.getElementById('senha').focus();
            }
        } else {
            alert('Erro ao cadastrar: ' + mensagemErroAmigavel(resultado.erro));
        }

        btnCadastro.disabled = false;
        btnCadastro.textContent = 'Cadastrar';
    }

    function limparPreviewFoto() {
        const preview = document.getElementById('previewFoto');
        if (preview) {
            preview.src = '';
            preview.style.display = 'none';
        }
        if (inputFoto) {
            inputFoto.value = '';
        }
    }

    function aplicarMascaraTelefone() {
        const telefone = document.getElementById('telefone');
        if (telefone) {
            telefone.addEventListener('input', (e) => {
                let valor = e.target.value.replace(/\D/g, '');
                if (valor.length > 11) valor = valor.slice(0, 11);
                
                if (valor.length > 10) {
                    valor = `(${valor.slice(0,2)}) ${valor.slice(2,7)}-${valor.slice(7)}`;
                } else if (valor.length > 6) {
                    valor = `(${valor.slice(0,2)}) ${valor.slice(2,6)}-${valor.slice(6)}`;
                } else if (valor.length > 2) {
                    valor = `(${valor.slice(0,2)}) ${valor.slice(2)}`;
                }
                
                e.target.value = valor;
            });
        }
    }

    // Função para buscar endereço pelo CEP (automático ao digitar)
    async function buscarEnderecoPorCep() {
        const cepInput = document.getElementById('cep');
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                // Preencher os campos automaticamente
                document.getElementById('rua').value = data.logradouro || '';
                document.getElementById('bairro').value = data.bairro || '';
                document.getElementById('cidade').value = data.localidade || '';
                document.getElementById('estado').value = data.uf || '';
                document.getElementById('complemento').value = data.complemento || '';

                document.getElementById('numero').focus();
            }
        } catch (error) {

        }
    }


    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', buscarEnderecoPorCep);
    }

    aplicarMascaraTelefone();
    atualizarInterface();
});
