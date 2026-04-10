import React, { useEffect, useRef } from 'react';
import '../styles/components/IndicadorCarregamento.css';

const IndicadorCarregamento = ({ tamanho = 42 }) => {
  const dimensao = typeof tamanho === 'number' ? `${tamanho}px` : tamanho;
  const indicadorRef = useRef(null);

  useEffect(() => {
    if (!indicadorRef.current) return;
    indicadorRef.current.style.setProperty('--tamanho-indicador', dimensao);
  }, [dimensao]);

  return (
    <div className="recipiente-carregamento" aria-busy="true" aria-live="polite">
      <div ref={indicadorRef} className="animacao-carregamento" />
    </div>
  );
};

export default IndicadorCarregamento;