// Função para formatar moeda real
function mascaraMoeda(valor) {
  valor = valor.replace(/\D/g, '');
  valor = (Number(valor) / 100).toFixed(2);
  return valor.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
import React, { useMemo, useState } from 'react';
import { X, DollarSign, UserPlus } from 'lucide-react';
import PainelInferior from './PainelInferior';
import '../styles/components/ModalContraproposta.css';

const formatarBRL = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return '';
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};

const ModalContraproposta = ({ aoFechar, aoConfirmar, valorEstimado }) => {
  const [valor, definirValor] = useState('');

  const valorEstimadoFmt = useMemo(() => formatarBRL(valorEstimado), [valorEstimado]);

  const valorNumerico = useMemo(() => {
    if (!valor) return null;
    const normalizado = String(valor).replace(/\./g, '').replace(',', '.');
    const n = Number(normalizado);
    return Number.isFinite(n) ? n : null;
  }, [valor]);

  const podeEnviar = valor === '' || valorNumerico !== null;

  return (
    <PainelInferior aoFechar={aoFechar} ariaLabel="Candidatar-se com contraproposta">
      <div className="cabecalho-contraproposta">
        <h2 className="titulo-contraproposta">Contraproposta</h2>
        <button onClick={aoFechar} className="botao-fechar-contraproposta" aria-label="Fechar">
          <X size={24} />
        </button>
      </div>

      <div className="cartao-info-contraproposta">
        <div className="info-linha-contraproposta">
          <span className="info-label-contraproposta">Orçamento do cliente</span>
          <span className="info-valor-contraproposta">
            {valorEstimadoFmt ? `R$ ${valorEstimadoFmt}` : '—'}
          </span>
        </div>
        <p className="info-texto-contraproposta">
          Se quiser, sugira um valor diferente antes de enviar sua candidatura. (Opcional)
        </p>
      </div>

      <div className="grupo-input-contraproposta">
        <label className="label-contraproposta">Seu valor sugerido (opcional)</label>
        <div className="campo-icone-contraproposta">
          <DollarSign size={20} className="icone-contraproposta" />
          <input
            type="text"
            inputMode="decimal"
            placeholder="Ex: 120,00"
            className="input-contraproposta"
            value={mascaraMoeda(valor)}
            onChange={(e) => definirValor(e.target.value)}
          />
        </div>
        {!podeEnviar ? (
          <div className="dica-erro-contraproposta">
            Digite um valor válido (ex: 120,00) ou deixe em branco.
          </div>
        ) : null}
      </div>

      <button
        className="botao-enviar-contraproposta"
        type="button"
        disabled={!podeEnviar}
        onClick={() => aoConfirmar(valorNumerico)}
      >
        <UserPlus size={20} />
        Enviar candidatura
      </button>
    </PainelInferior>
  );
};

export default ModalContraproposta;