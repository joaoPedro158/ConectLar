import { useState } from 'react';
import '../css/components/ModalAvaliacao.css';

export function ModalAvaliacao({ aoFechar, aoEnviar }) {
  const [estrelas, setEstrelas] = useState(0);
  const [comentario, setComentario] = useState('');

  const handleSubmit = () => {
    if (estrelas === 0) {
      alert('Selecione uma avaliação de 1 a 5 estrelas');
      return;
    }
    aoEnviar({ estrelas, comentario });
  };

  return (
    <div className="modal-avaliacao-overlay" onClick={aoFechar}>
      <div className="modal-avaliacao-content" onClick={(e) => e.stopPropagation()}>
        <h2>Avaliar Serviço</h2>
        <p>Como foi sua experiência com o profissional?</p>

        <div className="estrelas-selecao">
          {[5, 4, 3, 2, 1].map(num => (
            <label key={num} className={estrelas >= num ? 'selecionada' : ''}>
              <input
                type="radio"
                name="estrela"
                value={num}
                checked={estrelas === num}
                onChange={() => setEstrelas(num)}
              />
              ★
            </label>
          ))}
        </div>

        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Deixe um comentário sobre o serviço (opcional)..."
          rows="4"
        />

        <div className="modal-acoes">
          <button onClick={aoFechar} className="btn-cancelar">Depois</button>
          <button onClick={handleSubmit} className="btn-confirmar">Enviar Avaliação</button>
        </div>
      </div>
    </div>
  );
}
