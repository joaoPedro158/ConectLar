export function BarraDeBusca({ valor, aoMudar }) {
  return (
    <div className="busca-container">
      <input 
        type="text" 
        placeholder="Buscar trabalhos..." 
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
      />
    </div>
  );
}
