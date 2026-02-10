import '../css/components/BarraBusca.css';

export function BarraBusca({ valor, aoMudar, aoBuscar, placeholder }) {
  return (
    <div className="container-busca">
      <form 
        className="form-busca" 
        onSubmit={(e) => { 
          e.preventDefault(); 
          if(aoBuscar) aoBuscar(); 
        }}
      >
        <span className="icon-busca">&#128269;</span>
        <input 
          type="text" 
          className="input-busca"
          placeholder={placeholder || "Buscar serviços ou categorias..."}
          value={valor || ''}
          onChange={(e) => aoMudar && aoMudar(e.target.value)}
        />
        {aoBuscar && (
          <button type="submit" className="btn-pesquisar">
            Buscar
          </button>
        )}
      </form>
    </div>
  );
}

