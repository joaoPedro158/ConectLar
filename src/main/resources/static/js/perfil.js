document.addEventListener('DOMContentLoaded', () => {
    async function carregarPerfil(){
        try{
            const usuario = await buscarMeuPerfil();
            const div = document.getElementById('meuPerfil');
            div.innerHTML = `<pre>${JSON.stringify(usuario, null, 2)}</pre>`;
        }catch(e){ document.getElementById('meuPerfil').innerText = 'Erro ao carregar perfil.' }
    }

    carregarPerfil();
});
