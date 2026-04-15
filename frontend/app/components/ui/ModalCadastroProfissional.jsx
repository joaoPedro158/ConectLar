import React from "react";

// Modal para cadastro/validação de profissional
export default function ModalCadastroProfissional({ aberto, onClose, onCadastrar }) {
  if (!aberto) return null;
  return (
    <div className="modal-cadastro-profissional-overlay">
      <div className="modal-cadastro-profissional">
        <h2>Cadastro Profissional</h2>
        {/* TODO: Formulário de cadastro/validação */}
        <p>Em breve: formulário de cadastro de profissional.</p>
        <button onClick={onClose}>Fechar</button>
        <button onClick={onCadastrar}>Cadastrar</button>
      </div>
    </div>
  );
}
