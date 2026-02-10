import '../css/components/CardTrabalho.css';

export function CardTrabalho({ trabalho, onVerDetalhes, onCandidatar }) {
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const mapearCategoria = (cat) => {
    const mapa = {
      ENCANADOR: { icon: '💧', label: 'Encanador' },
      ELETRICISTA: { icon: '⚡', label: 'Eletricista' },
      LIMPEZA: { icon: '✨', label: 'Limpeza' },
      PINTOR: { icon: '🖌️', label: 'Pintor' },
      MARCENEIRO: { icon: '🔨', label: 'Marceneiro' },
      JARDINEIRO: { icon: '🌳', label: 'Jardineiro' },
      MECANICO: { icon: '🚗', label: 'Mecânico' },
      GERAL: { icon: '🛠️', label: 'Geral' }
    };
    return mapa[cat] || { icon: '🛠️', label: cat };
  };

  const catInfo = mapearCategoria(trabalho.categoria);
  const cidade = trabalho.localizacao?.cidade || 'Não informada';
  const estado = trabalho.localizacao?.estado || 'RN';
  const valorFormatado = trabalho.pagamento ? formatarValor(trabalho.pagamento) : 'A combinar';

  const handleCardClick = () => {
    if (onVerDetalhes) {
      onVerDetalhes(trabalho);
    }
  };

  const handleCandidatarClick = (e) => {
    e.stopPropagation();
    if (onCandidatar) {
      onCandidatar(trabalho);
    }
  };

  return (
    <div className="card-trabalho" onClick={handleCardClick}>
      <div className="info-trabalho">
        <h3>{trabalho.problema || 'Sem título'}</h3>
        <p className="descricao">{trabalho.descricao || 'Sem descrição'}</p>

        <div className="detalhes">
          <span>
            📍 {cidade} - {estado}
          </span>
          <span>
            <span>{catInfo.icon}</span>
            {catInfo.label}
          </span>
          <span>
            💰 {valorFormatado}
          </span>
        </div>
      </div>
      <div className="acoes">
        {onCandidatar && (
          <button className="btn-solicitar" onClick={handleCandidatarClick}>
            Candidatar-se
          </button>
        )}
      </div>
    </div>
  );
}
