"use client";

import React, { createContext, useContext } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import "./GrupoAlternancia.css";

const ContextoGrupoAlternancia = createContext({
  tamanho: "padrao",
  variante: "padrao",
});

function GrupoAlternancia({
  className,
  variante = "padrao",
  tamanho = "padrao",
  children,
  ...props
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="grupo-alternancia"
      data-variant={variante}
      data-size={tamanho}
      className={`grupo-alternancia grupo-alternancia--${variante} ${className || ""}`}
      {...props}
    >
      <ContextoGrupoAlternancia.Provider value={{ variante, tamanho }}>
        {children}
      </ContextoGrupoAlternancia.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function GrupoAlternanciaItem({
  className,
  children,
  variante,
  tamanho,
  ...props
}) {
  const contexto = useContext(ContextoGrupoAlternancia);

  const varianteFinal = contexto.variante || variante;
  const tamanhoFinal = contexto.tamanho || tamanho;

  return (
    <ToggleGroupPrimitive.Item
      data-slot="grupo-alternancia-item"
      data-variant={varianteFinal}
      data-size={tamanhoFinal}
      className={`grupo-alternancia__item grupo-alternancia__item--${varianteFinal} grupo-alternancia__item--${tamanhoFinal} ${className || ""}`}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { GrupoAlternancia, GrupoAlternanciaItem };