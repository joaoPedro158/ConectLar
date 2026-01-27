    const URL_BASE = '';
    let tipoUsuarioSelecionado = 'USUARIO';

    // funcao pra mudar a cor do botao selecionado
    function mudarTipo(elemento) {
        document.querySelectorAll('.botao-selecao').forEach(btn => btn.classList.remove('selecionado'));
        elemento.classList.add('selecionado');
        tipoUsuarioSelecionado = elemento.getAttribute('data-tipo');
    }

    // funcao pra alternar entre login e cadastro
    function alternarModo() {
        const grupoCadastro = document.getElementById('grupo-cadastro');
        const containerTipo = document.getElementById('container-tipo-usuario');
        const linkTexto = document.getElementById('link-alternar');
        const btnSubmit = document.getElementById('btn-submeter');
        const inputsCadastro = grupoCadastro.querySelectorAll('input:not([type="file"])');

        if (grupoCadastro.classList.contains('oculto')) {
            // modo cadastro
            grupoCadastro.classList.remove('oculto');
            containerTipo.classList.remove('oculto');
            linkTexto.innerText = 'Já tem conta? Faça login';
            btnSubmit.innerText = 'Finalizar Cadastro';
            inputsCadastro.forEach(input => input.setAttribute('required', 'true'));
        } else {
            // modo login
            grupoCadastro.classList.add('oculto');
            containerTipo.classList.add('oculto');
            linkTexto.innerText = 'Não tem conta? Crie agora!';
            btnSubmit.innerText = 'Entrar no Sistema';
            inputsCadastro.forEach(input => input.removeAttribute('required'));
        }
    }

    // escuta o envio do formulario
    document.getElementById('form-auth').addEventListener('submit', async (e) => {
        e.preventDefault();

        const grupoCadastro = document.getElementById('grupo-cadastro');
        const isCadastro = !grupoCadastro.classList.contains('oculto');

        const login = document.querySelector('input[name="login"]').value;
        const senha = document.querySelector('input[name="senha"]').value;

        if (!isCadastro) {
            // logica de login
            try {
                const response = await fetch(`${URL_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ login, senha })
                });

                if (response.ok) {
                    const data = await response.json();

                    // salva o token e a role no navegador
                    // Compatibilidade: grava nas duas chaves (legacy 'token' e nova 'conectlar_token')
                    try {
                        localStorage.setItem('conectlar_token', data.token);
                    } catch (e) { /* ignore storage error */ }
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('role', data.role);

                    alert('Login realizado com sucesso!');

                    // redirecionamento limpo controlado pelo webconfig
                    if (data.role === 'USUARIO') {
                        window.location.href = '/app/cliente';
                    } else if (data.role === 'PROFISSIONAL') {
                        window.location.href = '/app/profissional';
                    } else if (data.role === 'ADM') {
                        alert('Painel de ADM em construção');
                    } else {
                        window.location.href = '/app/cliente';
                    }

                } else {
                    alert('Login ou senha incorretos.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao conectar com o servidor.');
            }

        } else {
            // logica de cadastro
            const formData = new FormData();

            const dadosUsuario = {
                nome: document.querySelector('input[name="nome"]').value,
                email: login,
                senha: senha,
                telefone: document.querySelector('input[name="telefone"]').value,
                role: tipoUsuarioSelecionado,
                localizacao: {
                    rua: document.querySelector('input[name="rua"]').value,
                    bairro: document.querySelector('input[name="bairro"]').value,
                    numero: document.querySelector('input[name="numero"]').value,
                    cidade: document.querySelector('input[name="cidade"]').value,
                    cep: document.querySelector('input[name="cep"]').value,
                    estado: document.querySelector('input[name="estado"]').value,
                    complemento: document.querySelector('input[name="complemento"]').value
                }
            };

            // converte o json para blob pq o spring exige assim no multipart
            formData.append('dados', new Blob([JSON.stringify(dadosUsuario)], { type: 'application/json' }));

            const arquivoInput = document.getElementById('input-arquivo');
            if (arquivoInput.files[0]) {
                formData.append('arquivo', arquivoInput.files[0]);
            }

            try {
                // define a rota com base no tipo selecionado
                let endpoint = tipoUsuarioSelecionado === 'PROFISSIONAL' ? '/profissional/cadastrar' : '/usuario/cadastrar';

                const response = await fetch(`${URL_BASE}${endpoint}`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Cadastro realizado! Faça login para entrar.');
                    alternarModo();
                } else {
                    alert('Erro ao cadastrar. Verifique os dados.');
                }
            } catch (error) {
                console.error(error);
                alert('Erro ao conectar com o servidor.');
            }
        }
    });