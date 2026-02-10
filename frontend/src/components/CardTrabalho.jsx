import '../css/components/CardTrabalho.css';

export function CardTrabalho({ trabalho, onVerDetalhes }) {
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

  return (
    <div className="card-trabalho">
      <div className="card-trabalho-header">
        <div className="categoria-badge">
          <span className="categoria-icon">{catInfo.icon}</span>
          {catInfo.label}
        </div>
        <div className="valor-badge">{formatarValor(trabalho.pagamento)}</div>
      </div>

      <h3 className="trabalho-titulo">{trabalho.problema}</h3>
      <p className="trabalho-descricao">{trabalho.descricao}</p>

      <div className="trabalho-localizacao">
        <span className="icon-localizacao">📍</span>
        {trabalho.localizacao?.cidade}, {trabalho.localizacao?.estado}
      </div>

      <button className="btn-ver-detalhes" onClick={() => onVerDetalhes(trabalho)}>
        Ver Detalhes
      </button>
    </div>
  );
}
