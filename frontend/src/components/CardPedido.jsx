export function CardPedido({ pedido, onCancelar }) {
  return (
      <div className="card-pedido">
          <h4>{pedido.problema}</h4>
          <p>Status: <strong>{pedido.status}</strong></p>
          <button onClick={() => onCancelar(pedido.id)} className="btn-cancelar">Cancelar</button>
      </div>
  );
}
