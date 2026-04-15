"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import "../../../styles/ui/DicaFlutuante.css";

function DicaFlutuanteProvedor({
  atraso = 0,
  ...props
}) {
  return (
    <TooltipPrimitive.Provider
      data-slot="dica-flutuante-provedor"
      delayDuration={atraso}
      {...props}
    />
  );
}

function DicaFlutuante({
  ...props
}) {
  return (
    <DicaFlutuanteProvedor>
      <TooltipPrimitive.Root data-slot="dica-flutuante" {...props} />
    </DicaFlutuanteProvedor>
  );
}

function DicaFlutuanteGatilho({
  ...props
}) {
  return <TooltipPrimitive.Trigger data-slot="dica-flutuante-gatilho" {...props} />;
}

function DicaFlutuanteConteudo({
  className,
  deslocamentoLateral = 4,
  children,
  ...props
}) {
  const classes = ["dica-flutuante__conteudo", className].filter(Boolean).join(" ").trim();

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="dica-flutuante-conteudo"
        sideOffset={deslocamentoLateral}
        className={classes}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="dica-flutuante__seta" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { 
  DicaFlutuante, 
  DicaFlutuanteGatilho, 
  DicaFlutuanteConteudo, 
  DicaFlutuanteProvedor 
};