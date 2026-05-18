document.addEventListener('DOMContentLoaded', () => {
    const botoesCandidatar = document.querySelectorAll('[onclick*="candidatar"]');
    const botoesCancelar = document.querySelectorAll('[onclick*="cancelarCandidatura"]');
    const botoesFinalizar = document.querySelectorAll('[onclick*="finalizarTrabalho"]');
    const botoesCancelarTrabalho = document.querySelectorAll('[onclick*="cancelarTrabalho"]');
    const modalFechar = document.querySelector('[onclick*="fecharModalDetalhesTrabalho"]');
    
    botoesCandidatar.forEach(botao => {
        const id = botao.getAttribute('onclick').match(/candidatar\((\d+)\)/)?.[1];
        if (id) {
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.candidatar(parseInt(id)));
        }
    });
    
    botoesCancelar.forEach(botao => {
        const id = botao.getAttribute('onclick').match(/cancelarCandidatura\((\d+)\)/)?.[1];
        if (id) {
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.cancelarCandidatura(parseInt(id)));
        }
    });
    
    botoesFinalizar.forEach(botao => {
        const id = botao.getAttribute('onclick').match(/finalizarTrabalho\((\d+)\)/)?.[1];
        if (id) {
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.finalizarTrabalho(parseInt(id)));
        }
    });
    
    botoesCancelarTrabalho.forEach(botao => {
        const id = botao.getAttribute('onclick').match(/cancelarTrabalho\((\d+)\)/)?.[1];
        if (id) {
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.cancelarTrabalho(parseInt(id)));
        }
    });
    
    if (modalFechar) {
        modalFechar.removeAttribute('onclick');
        modalFechar.addEventListener('click', () => window.fecharModalDetalhesTrabalho());
    }
});
