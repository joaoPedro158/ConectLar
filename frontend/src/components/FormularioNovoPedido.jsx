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

   const handleSubmit = (e) => {
      e.preventDefault();
      aoEnviar(formData);
   };

   const handleChange = (campo, valor) => {
      if (campo === 'cep') {
         const mascarado = formatarCep(valor);
         setFormData((prev) => ({ ...prev, [campo]: mascarado }));
         const digitos = valor.replace(/\D/g, '');
         if (digitos.length === 8) {
            buscarCep(digitos);
         }
      } else if (campo === 'pagamento') {
         const formatado = formatarMoeda(valor);
         setFormData((prev) => ({ ...prev, [campo]: formatado }));
      } else {
         setFormData(prev => ({ ...prev, [campo]: valor }));
      }
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
              placeholder="Pagamento Sugerido (R$)" 
              value={formData.pagamento} 
              onChange={e => handleChange('pagamento', e.target.value)} 
              type="text"
           />
           
           <button type="submit" className="btn-primary">Solicitar</button>
       </form>
  );
}
