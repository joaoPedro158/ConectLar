"use client";

import React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import "./Seletor.css";

function Seletor({ ...props }) {
  return <SelectPrimitive.Root data-slot="seletor" {...props} />;
}

function SeletorGrupo({ ...props }) {
  return <SelectPrimitive.Group data-slot="seletor-grupo" {...props} />;
}

function SeletorValor({ ...props }) {
  return <SelectPrimitive.Value data-slot="seletor-valor" {...props} />;
}

function SeletorGatilho({ className, tamanho = "padrao", children, ...props }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="seletor-gatilho"
      className={`seletor__gatilho seletor__gatilho--${tamanho} ${className || ""}`}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="seletor__icone-seta" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SeletorConteudo({ className, children, posicao = "popper", ...props }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="seletor-conteudo"
        position={posicao}
        className={`seletor__conteudo ${className || ""}`}
        {...props}
      >
        <SeletorBotaoRolarCima />
        <SelectPrimitive.Viewport className="seletor__viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SeletorBotaoRolarBaixo />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SeletorItem({ className, children, ...props }) {
  return (
    <SelectPrimitive.Item
      data-slot="seletor-item"
      className={`seletor__item ${className || ""}`}
      {...props}
    >
      <span className="seletor__item-indicador">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon size={16} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SeletorRotulo({ className, ...props }) {
  return (
    <SelectPrimitive.Label
      data-slot="seletor-rotulo"
      className={`seletor__rotulo ${className || ""}`}
      {...props}
    />
  );
}

function SeletorSeparador({ className, ...props }) {
  return (
    <SelectPrimitive.Separator
      data-slot="seletor-separador"
      className={`seletor__separador ${className || ""}`}
      {...props}
    />
  );
}

function SeletorBotaoRolarCima({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollUpButton className="seletor__botao-rolar" {...props}>
      <ChevronUpIcon size={16} />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SeletorBotaoRolarBaixo({ className, ...props }) {
  return (
    <SelectPrimitive.ScrollDownButton className="seletor__botao-rolar" {...props}>
      <ChevronDownIcon size={16} />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Seletor,
  SeletorConteudo,
  SeletorGrupo,
  SeletorItem,
  SeletorRotulo,
  SeletorBotaoRolarBaixo,
  SeletorBotaoRolarCima,
  SeletorSeparador,
  SeletorGatilho,
  SeletorValor,
};