import { CardPedido } from './CardPedido';

export function ListaPedidos({ pedidos, loading, onCancelar }) {
  return (
    <div className="secao-servicos">
      <h1 className="titulo-sessao">Caixinha de pedidos</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : pedidos.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>Nenhum pedido disponível</h2>
          <p>Você ainda não publicou nenhum pedido. Clique no botão + para começar!</p>
        </div>
      ) : (
        pedidos.map(p => <CardPedido key={p.id} pedido={p} onCancelar={onCancelar} />)
      )}
    </div>
  );
}
