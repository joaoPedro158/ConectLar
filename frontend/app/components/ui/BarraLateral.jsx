"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { Slot } from "@radix-ui/react-slot";
import { PanelLeftIcon } from "lucide-react";
import { useDispositivoMovel } from "./useDispositivoMovel";
import { Botao } from "./Botao";
import { Folha, FolhaConteudo } from "./Folha";
import { Esqueleto } from "./Esqueleto";
import { DicaFlutuante, DicaFlutuanteConteudo, DicaFlutuanteProvedor, DicaFlutuanteGatilho } from "./DicaFlutuante";
import "./BarraLateral.css";

const SIDEBAR_COOKIE_NOME = "estado_barra_lateral";
const SIDEBAR_CHAVE_ATALHO = "b";

const ContextoBarraLateral = createContext(null);

export function useBarraLateral() {
  const contexto = useContext(ContextoBarraLateral);
  if (!contexto) throw new Error("useBarraLateral deve ser usado dentro de um ProvedorBarraLateral.");
  return contexto;
}

export function ProvedorBarraLateral({ defaultAberto = true, children, className, ...props }) {
  const isMovel = useDispositivoMovel();
  const [abertoMovel, setAbertoMovel] = useState(false);
  const [_aberto, _setAberto] = useState(defaultAberto);

  const aberto = _aberto;

  const setAberto = useCallback((valor) => {
    const novoEstado = typeof valor === "function" ? valor(aberto) : valor;
    _setAberto(novoEstado);
    document.cookie = `${SIDEBAR_COOKIE_NOME}=${novoEstado}; path=/; max-age=604800`;
  }, [aberto]);

  const alternarBarra = useCallback(() => {
    return isMovel ? setAbertoMovel((v) => !v) : setAberto((v) => !v);
  }, [isMovel, setAberto]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === SIDEBAR_CHAVE_ATALHO && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        alternarBarra();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [alternarBarra]);

  const estado = aberto ? "expandido" : "colapsado";

  const valorContexto = useMemo(() => ({
    estado, aberto, setAberto, isMovel, abertoMovel, setAbertoMovel, alternarBarra
  }), [estado, aberto, setAberto, isMovel, abertoMovel, alternarBarra]);

  return (
    <ContextoBarraLateral.Provider value={valorContexto}>
      <DicaFlutuanteProvedor delayDuration={0}>
        <div className={`barra-lateral__wrapper ${className || ""}`} {...props}>
          {children}
        </div>
      </DicaFlutuanteProvedor>
    </ContextoBarraLateral.Provider>
  );
}

export function BarraLateral({ side = "left", variante = "sidebar", colapsavel = "offcanvas", className, children, ...props }) {
  const { isMovel, estado, abertoMovel, setAbertoMovel } = useBarraLateral();

  if (isMovel) {
    return (
      <Folha open={abertoMovel} onOpenChange={setAbertoMovel}>
        <FolhaConteudo className="barra-lateral--mobile" side={side}>
          <div className="barra-lateral__conteudo-movel">{children}</div>
        </FolhaConteudo>
      </Folha>
    );
  }

  return (
    <div className="barra-lateral__desktop-root" data-state={estado} data-variant={variante}>
      <div className="barra-lateral__gap" />
      <div className={`barra-lateral__container ${className || ""}`} {...props}>
        <div className="barra-lateral__interno">{children}</div>
      </div>
    </div>
  );
}

export function BarraLateralGatilho({ className, onClick, ...props }) {
  const { alternarBarra } = useBarraLateral();
  return (
    <Botao
      variante="fantasma"
      tamanho="icone"
      className={`barra-lateral__gatilho ${className || ""}`}
      onClick={(e) => { onClick?.(e); alternarBarra(); }}
      {...props}
    >
      <PanelLeftIcon />
    </Botao>
  );
}

export function BarraLateralGrupo({ className, ...props }) {
  return <div className={`barra-lateral__grupo ${className || ""}`} {...props} />;
}

export function BarraLateralMenu({ className, ...props }) {
  return <ul className={`barra-lateral__menu ${className || ""}`} {...props} />;
}

export function BarraLateralMenuItem({ className, ...props }) {
  return <li className={`barra-lateral__menu-item ${className || ""}`} {...props} />;
}

export function BarraLateralMenuBotao({ asChild = false, ativo = false, variante = "padrao", tamanho = "padrao", dica, className, ...props }) {
  const Comp = asChild ? Slot : "button";
  const { estado, isMovel } = useBarraLateral();

  const botao = (
    <Comp
      className={`barra-lateral__menu-botao barra-lateral__menu-botao--${variante} ${ativo ? "ativo" : ""} ${className || ""}`}
      {...props}
    />
  );

  if (!dica) return botao;

  return (
    <DicaFlutuante>
      <DicaFlutuanteGatilho asChild>{botao}</DicaFlutuanteGatilho>
      <DicaFlutuanteConteudo side="right" hidden={estado !== "colapsado" || isMovel}>
        {dica}
      </DicaFlutuanteConteudo>
    </DicaFlutuante>
  );
}

// Outros subcomponentes (Header, Footer, Content, Separator) seguem a mesma lógica de classes BEM simples.