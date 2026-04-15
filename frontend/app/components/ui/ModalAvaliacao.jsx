import React from "react";

// Modal para avaliação após conclusão do serviço
export default function ModalAvaliacao({ aberto, onClose, onAvaliar }) {
  if (!aberto) return null;
  return (
    <div className="modal-avaliacao-overlay">
      <div className="modal-avaliacao">
        <h2>Avalie o Serviço</h2>
        {/* TODO: Campos de avaliação (estrelas, comentário, etc.) */}
        <p>Em breve: formulário de avaliação.</p>
        <button onClick={onClose}>Fechar</button>
        <button onClick={onAvaliar}>Enviar Avaliação</button>
      </div>
    </div>
  );
}
