import { useState } from 'react';

export function ModalNovoPedido({ aoFechar, aoEnviar }) {
  const [formData, setFormData] = useState({
    problema: '',
    descricao: '',
    categoria: '',
    pagamento: '',
    cep: '',
    cidade: '',
    estado: 'RN',
    bairro: '',
    rua: '',
    numero: '',
    complemento: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const campo = id.replace('Servico', '');
    setFormData(prev => ({ ...prev, [campo]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    aoEnviar(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <header className="modal-header">
          <h3>Publicar Novo Serviço</h3>
          <button className="botao-fechar-modal" onClick={aoFechar}>&times;</button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label>Título do Problema</label>
            <input type="text" id="problemaServico" className="input-dark" placeholder="Ex: Vazamento na cozinha" value={formData.problema} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <div className="form-grupo">
              <label>Categoria</label>
              <select id="categoriaServico" className="input-dark" value={formData.categoria} onChange={handleInputChange} required>
                <option value="">Selecione...</option>
                <option value="ENCANADOR">Encanamento</option>
                <option value="ELETRICISTA">Elétrica</option>
                <option value="PINTOR">Pintura</option>
                <option value="LIMPEZA">Limpeza</option>
                <option value="MARCENEIRO">Marcenaria</option>
                <option value="JARDINEIRO">Jardinagem</option>
                <option value="MECANICO">Mecânica</option>
                <option value="GERAL">Outros</option>
              </select>
            </div>
            <div className="form-grupo">
              <label>Valor Orçamento (R$)</label>
              <input type="number" id="pagamentoServico" className="input-dark" placeholder="100.00" min="1" step="0.01" value={formData.pagamento} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-grupo">
              <label>CEP</label>
              <input type="text" id="cepServico" className="input-dark" placeholder="00000-000" value={formData.cep} onChange={handleInputChange} required />
            </div>
            <div className="form-grupo">
              <label>Cidade</label>
              <input type="text" id="cidadeServico" className="input-dark" value={formData.cidade} onChange={handleInputChange} required />
            </div>
            <div className="form-grupo" style={{ width: '80px' }}>
              <label>UF</label>
              <input type="text" id="estadoServico" className="input-dark" value={formData.estado} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-grupo">
            <label>Rua</label>
            <input type="text" id="ruaServico" className="input-dark" value={formData.rua} onChange={handleInputChange} required />
          </div>

          <div className="form-row">
            <div className="form-grupo">
              <label>Bairro</label>
              <input type="text" id="bairroServico" className="input-dark" value={formData.bairro} onChange={handleInputChange} required />
            </div>
            <div className="form-grupo">
              <label>Número</label>
              <input type="text" id="numeroServico" className="input-dark" value={formData.numero} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="form-grupo">
            <label>Complemento</label>
            <input type="text" id="complementoServico" className="input-dark" value={formData.complemento} onChange={handleInputChange} />
          </div>

          <div className="form-grupo">
            <label>Descrição Detalhada</label>
            <textarea id="descricaoServico" className="input-dark" rows="4" placeholder="Descreva o problema..." value={formData.descricao} onChange={handleInputChange} required></textarea>
          </div>

          <button type="submit" className="botao-submit">Publicar Agora</button>
        </form>
      </div>
    </div>
  );
}
