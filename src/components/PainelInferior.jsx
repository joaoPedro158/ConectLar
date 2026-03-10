import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../styles/components/PainelInferior.css';

const LIMIAR_FECHAR_PX = 120;

const PainelInferior = ({
  aoFechar,
  children,
  ariaLabel = 'Painel inferior',
  maxAltura = '60dvh'
}) => {
  const painelRef = useRef(null);
  const inicioYRef = useRef(0);
  const pointerIdRef = useRef(null);

  const [arrastando, definirArrastando] = useState(false);
  const [deslocamentoY, definirDeslocamentoY] = useState(0);

  useEffect(() => {
    const aoTeclar = (e) => {
      if (e.key === 'Escape') aoFechar?.();
    };

    document.addEventListener('keydown', aoTeclar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = overflowAnterior;
    };
  }, [aoFechar]);

  useEffect(() => {
    if (!painelRef.current) return;
    painelRef.current.style.setProperty('--painel-inferior-max-altura', maxAltura);
  }, [maxAltura]);

  useEffect(() => {
    if (!painelRef.current) return;
    painelRef.current.style.setProperty('--painel-inferior-deslocamento-y', `${deslocamentoY}px`);
  }, [deslocamentoY]);

  const aoPointerDown = (e) => {
    if (!aoFechar) return;

    pointerIdRef.current = e.pointerId;
    inicioYRef.current = e.clientY;
    definirArrastando(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const aoPointerMove = (e) => {
    if (!arrastando) return;
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;

    const delta = Math.max(0, e.clientY - inicioYRef.current);
    definirDeslocamentoY(delta);
  };

  const finalizarArrasto = () => {
    if (!arrastando) return;

    definirArrastando(false);

    if (deslocamentoY >= LIMIAR_FECHAR_PX) {
      aoFechar?.();
      return;
    }

    definirDeslocamentoY(0);
  };

  return createPortal(
    <div
      className="sobreposicao-modal animacao-esmaecer"
      role="presentation"
      onClick={() => aoFechar?.()}
    >
      <div
        ref={painelRef}
        className={`painel-inferior ${arrastando ? 'painel-inferior--arrastando' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="area-arrasto-painel"
          onPointerDown={aoPointerDown}
          onPointerMove={aoPointerMove}
          onPointerUp={finalizarArrasto}
          onPointerCancel={finalizarArrasto}
        >
          <div className="indicador-arrasto" />
        </div>
        <div className="conteudo-painel">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PainelInferior;