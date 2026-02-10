import { useState } from 'react';

export function FormularioNovoPedido({ aoEnviar }) {
  const [formData, setFormData] = useState({
      problema: '',
      descricao: '',
      categoria: 'GERAL',
      pagamento: '',
      cep: '',
      cidade: '',
      numero: '',
      rua: '',
      bairro: '',
      estado: ''
  });

  const handleSubmit = (e) => {
      e.preventDefault();
      aoEnviar(formData);
  };

  const handleChange = (campo, valor) => {
      setFormData(prev => ({ ...prev, [campo]: valor }));
  };

  return (
       <form onSubmit={handleSubmit} className="form-novo-pedido">
           <h3>Novo Pedido</h3>
           <input 
              placeholder="Título do problema" 
              value={formData.problema} 
              onChange={e => handleChange('problema', e.target.value)} 
              required 
           />
           <input 
              placeholder="Descrição" 
              value={formData.descricao} 
              onChange={e => handleChange('descricao', e.target.value)} 
           />
           <select 
              value={formData.categoria} 
              onChange={e => handleChange('categoria', e.target.value)}
           >
               <option value="GERAL">Geral</option>
               <option value="ENCANADOR">Encanador</option>
               <option value="ELETRICISTA">Eletricista</option>
           </select>
           <input 
              placeholder="CEP" 
              value={formData.cep} 
              onChange={e => handleChange('cep', e.target.value)} 
              required 
           />
           <input 
              placeholder="Cidade" 
              value={formData.cidade} 
              onChange={e => handleChange('cidade', e.target.value)} 
              required 
           />
           <input 
              placeholder="Rua" 
              value={formData.rua} 
              onChange={e => handleChange('rua', e.target.value)} 
              required 
           />
           <input 
              placeholder="Bairro" 
              value={formData.bairro} 
              onChange={e => handleChange('bairro', e.target.value)} 
              required 
           />
           <input 
              placeholder="Número" 
              value={formData.numero} 
              onChange={e => handleChange('numero', e.target.value)} 
              required 
           />
           <input 
              placeholder="Pagamento Sugerido" 
              value={formData.pagamento} 
              onChange={e => handleChange('pagamento', e.target.value)} 
              type="number"
           />
           
           <button type="submit" className="btn-primary">Solicitar</button>
       </form>
  );
}
