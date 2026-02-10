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

  const [arquivoImagem, setArquivoImagem] = useState(null);

  const formatarCep = (valor) => {
    if (!valor) return '';
    const digitos = valor.replace(/\D/g, '').slice(0, 8);
    if (digitos.length <= 5) return digitos;
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  };

  const buscarCep = async (cepLimpo) => {
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.erro) return;
      setFormData((prev) => ({
        ...prev,
        cep: formatarCep(cepLimpo),
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }));
    } catch (e) {
      console.error('Erro ao buscar CEP via ViaCEP', e);
    }
  };

  const formatarMoeda = (valor) => {
    const digitos = (valor || '').toString().replace(/\D/g, '');
    if (!digitos) return '';
    const numero = parseInt(digitos, 10);
    return (numero / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const campo = id.replace('Servico', '');

    if (id === 'cepServico') {
      const mascarado = formatarCep(value);
      setFormData((prev) => ({ ...prev, [campo]: mascarado }));
      const digitos = value.replace(/\D/g, '');
      if (digitos.length === 8) {
        buscarCep(digitos);
      }
    } else if (id === 'pagamentoServico') {
      const formatado = formatarMoeda(value);
      setFormData((prev) => ({ ...prev, [campo]: formatado }));
    } else {
      setFormData(prev => ({ ...prev, [campo]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    aoEnviar({ ...formData, arquivo: arquivoImagem });
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
              <input
                type="text"
                id="pagamentoServico"
                className="input-dark"
                placeholder="R$ 100,00"
                value={formData.pagamento}
                onChange={handleInputChange}
                required
              />
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
            <div className="form-grupo form-grupo-uf">
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
            <label>Imagem do problema (opcional)</label>
            <input
              type="file"
              accept="image/*"
              id="imagemServico"
              className="input-dark"
              onChange={(e) => setArquivoImagem(e.target.files[0] || null)}
            />
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
