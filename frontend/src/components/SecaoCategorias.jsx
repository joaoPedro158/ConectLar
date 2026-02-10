export function SecaoCategorias() {
  const categorias = [
    { nome: 'Encanador', icone: '💧', classe: 'encanador' },
    { nome: 'Eletricista', icone: '⚡', classe: 'eletricista' },
    { nome: 'Limpeza', icone: '✨', classe: 'limpeza' },
    { nome: 'Pintor', icone: '🖌️', classe: 'pintor' },
    { nome: 'Marceneiro', icone: '🔨', classe: 'marceneiro' },
    { nome: 'Jardineiro', icone: '🌳', classe: 'jardineiro' },
    { nome: 'Mecânico', icone: '🚗', classe: 'mecanico' },
    { nome: 'Geral', icone: '🛠️', classe: 'geral' }
  ];

  return (
    <div className="secao-categorias">
      <h1 className="titulo-sessao">Categorias</h1>
      <div className="grid-categorias">
        {categorias.map((cat) => (
          <button key={cat.classe} className={`card-cat ${cat.classe}`}>
            <div className="icon-circle">{cat.icone}</div>
            <span>{cat.nome}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
