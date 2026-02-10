import '../css/components/EstatisticasCard.css';

export function EstatisticasCard({ stats }) {
  return (
    <section className="caixa-estatisticas">
      <div className="estatisticas-grid">
        <div className="estatistica-card">
          <p>{stats.totalLabel || 'Total de Pedidos'}</p>
          <h2>{stats.total || 0}</h2>
        </div>

        <div className="estatistica-card">
          <p>{stats.concluidosLabel || 'Pedidos Concluídos'}</p>
          <h2>{stats.concluidos || 0}</h2>
        </div>

        <div className="estatistica-card">
          <p>{stats.valorLabel || 'Gasto Total'}</p>
          <h2>{stats.valor || 'R$ 0,00'}</h2>
        </div>

        <div className="estatistica-card">
          <p>Avaliação Média</p>
          <h2>{stats.avaliacao || '0.0'}</h2>
        </div>
      </div>
    </section>
  );
}
