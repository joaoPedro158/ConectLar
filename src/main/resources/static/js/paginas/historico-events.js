document.addEventListener('DOMContentLoaded', () => {
    const botoesResponder = document.querySelectorAll('[onclick*="responderSolicitacao"]');
    const botoesFinalizar = document.querySelectorAll('[onclick*="finalizarTrabalho"]');
    const botoesCancelar = document.querySelectorAll('[onclick*="cancelarTrabalho"]');
    
    botoesResponder.forEach(botao => {
        const match = botao.getAttribute('onclick').match(/responderSolicitacao\((\d+),\s*(true|false)\)/);
        if (match) {
            const [, id, aceitar] = match;
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.responderSolicitacao(parseInt(id), aceitar === 'true'));
        }
    });
    
    botoesFinalizar.forEach(botao => {
        const id = botao.getAttribute('onclick').match(/finalizarTrabalho\((\d+)\)/)?.[1];
        if (id) {
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.finalizarTrabalho(parseInt(id)));
        }
    });
    
    botoesCancelar.forEach(botao => {
        const id = botao.getAttribute('onclick').match(/cancelarTrabalho\((\d+)\)/)?.[1];
        if (id) {
            botao.removeAttribute('onclick');
            botao.addEventListener('click', () => window.cancelarTrabalho(parseInt(id)));
        }
    });
});
