import '../css/components/CardPedido.css';

export function CardPedido({ pedido, onConcluir, onCancelar, onAvaliar, mostrarAvaliar, onVerDetalhes }) {
  const status = pedido.status || '';

  const normalizarStatusClasse = (s) => {
    const key = (s || '').toUpperCase();
    const mapa = {
      ABERTO: 'aberto',
      EM_ESPERA: 'espera',
      EM_ANDAMENTO: 'andamento',
      CONCLUIDO: 'concluido',
      CANCELADO: 'cancelado',
    };
    return mapa[key] || s.toLowerCase();
  };

  const podeConcluir = status === 'EM_ANDAMENTO';
  const podeCancelar = status === 'ABERTO';

  const formatarValor = (valor) => {
    if (valor === null || valor === undefined) return null;
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(valor);
    } catch {
      return null;
    }
  };

  const obterData = () => {
    const dataBruta =
      pedido.dataServico ||
      pedido.dataTrabalho ||
      pedido.dataCriacao ||
      pedido.data;

    if (!dataBruta) return null;

    const dataParse = new Date(dataBruta);
    if (!isNaN(dataParse)) {
      return dataParse.toLocaleDateString('pt-BR');
    }

    return String(dataBruta);
  };

  const obterLocal = () => {
    const cidade = pedido.cidadeServico || pedido.cidade;
    const estado = pedido.estadoServico || pedido.estado;
    const bairro = pedido.bairroServico || pedido.bairro;

    if (bairro && cidade && estado) return `${bairro} - ${cidade}/${estado}`;
    if (cidade && estado) return `${cidade}/${estado}`;
    if (cidade) return cidade;
    if (pedido.localizacao) return pedido.localizacao;

    return null;
  };

  const valorFormatado = formatarValor(pedido.pagamento ?? pedido.valor);
  const dataFormatada = obterData();
  const localFormatado = obterLocal();

  const handleCardClick = () => {
    if (onVerDetalhes) {
      onVerDetalhes(pedido);
    }
  };

  return (
    <div className="card-pedido" onClick={handleCardClick}>
      <div className="cabecalho-card">
        <div className="cabecalho-textos">
          <h4>{pedido.problema || 'Sem título'}</h4>
          {localFormatado && (
            <span className="subtitulo-card">{localFormatado}</span>
          )}
        </div>
        <span className={`status-badge status-${normalizarStatusClasse(status)}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <p className="descricao-pedido">{pedido.descricao || 'Sem descrição'}</p>

      {(valorFormatado || dataFormatada) && (
        <div className="meta-card">
          {valorFormatado && (
            <div className="meta-item">
              <span className="meta-label">Valor</span>
              <span className="meta-value">{valorFormatado}</span>
            </div>
          )}
          {dataFormatada && (
            <div className="meta-item">
              <span className="meta-label">Data</span>
              <span className="meta-value">{dataFormatada}</span>
            </div>
          )}
        </div>
      )}

      <div className="rodape-card">
        <div className="acoes-card">
          {podeConcluir && onConcluir && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onConcluir(pedido.id);
              }}
              className="botao-concluir"
            >
              Finalizar Serviço
            </button>
          )}
          {podeCancelar && onCancelar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelar(pedido.id);
              }}
              className="btn-cancelar-simples"
            >
              Cancelar
            </button>
          )}
          {mostrarAvaliar && onAvaliar && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAvaliar(pedido.id);
              }}
              className="botao-avaliar"
            >
              Avaliar Profissional
            </button>
          )}
          {onVerDetalhes && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVerDetalhes(pedido);
              }}
              className="botao-detalhes"
            >
              Ver detalhes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
