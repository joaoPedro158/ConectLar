-document.addEventListener('DOMContentLoaded', () => {
    async function carregarUsuariosAdm(){
        try{
            const usuarios = await listarUsuarios();
            const div = document.getElementById('listaUsuariosAdm');
            div.innerHTML = '';
            usuarios.forEach(u => {
                const el = document.createElement('div');
                el.className = 'cartao-servico';
                el.innerHTML = `<div><strong>${u.nome}</strong> <br>${u.email}</div><div><button onclick="deletarUsuario(${u.id})">Deletar</button></div>`;
                div.appendChild(el);
            });
        }catch(e){ document.getElementById('listaUsuariosAdm').innerText = 'Erro ao carregar.' }
    }

    const formAdm = document.getElementById('formAdmCadastro');
    if(formAdm){
        formAdm.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const email = document.getElementById('admEmail').value;
            const senha = document.getElementById('admSenha').value;
            try{
                await criarAdm({email, senha});
                alert('ADM criado.');
                carregarUsuariosAdm();
            }catch(err){ alert(err.message || 'Erro ao criar ADM'); }
        });
    }

    carregarUsuariosAdm();
});
