import React, { useState } from "react";
import { X, Check, Briefcase } from "lucide-react";
import "../../styles/components/ModalBruto.css";

export default function ModalUpgradePro({ isOpen, onClose, onConfirm }) {
  const [categoria, setCategoria] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content-bruto">
        <div className="modal-header-bruto">
          <Briefcase size={20} />
          <h2>Perfil Profissional</h2>
          <button onClick={onClose} className="btn-close-modal"><X size={20}/></button>
        </div>
        
        <div className="modal-body-bruto">
          <p>Para começar a receber pedidos, escolha a sua categoria principal de trabalho:</p>
          <select 
            className="select-bruto"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecione uma categoria...</option>
            <option value="Encanador">Encanador</option>
            <option value="Eletricista">Eletricista</option>
            <option value="Limpeza">Limpeza</option>
            <option value="Serviços Gerais">Serviços Gerais</option>
          </select>
        </div>

        <div className="modal-footer-bruto">
          <button 
            disabled={!categoria}
            onClick={() => onConfirm(categoria)} 
            className="btn-confirmar-modal"
          >
            Ativar Modo Profissional <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}