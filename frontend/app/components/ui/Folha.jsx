"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import "./Folha.css";

function Folha({ ...props }) {
  return <SheetPrimitive.Root data-slot="folha" {...props} />;
}

function FolhaGatilho({ ...props }) {
  return <SheetPrimitive.Trigger data-slot="folha-gatilho" {...props} />;
}

function FolhaFechar({ ...props }) {
  return <SheetPrimitive.Close data-slot="folha-fechar" {...props} />;
}

function FolhaPortal({ ...props }) {
  return <SheetPrimitive.Portal data-slot="folha-portal" {...props} />;
}

function FolhaSobreposicao({ className, ...props }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="folha-sobreposicao"
      className={`folha__sobreposicao ${className || ""}`}
      {...props}
    />
  );
}

function FolhaConteudo({ className, children, lado = "right", ...props }) {
  return (
    <FolhaPortal>
      <FolhaSobreposicao />
      <SheetPrimitive.Content
        data-slot="folha-conteudo"
        className={`folha__conteudo folha__conteudo--${lado} ${className || ""}`}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="folha__botao-fechar">
          <XIcon size={16} />
          <span className="sr-only">Fechar</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </FolhaPortal>
  );
}

function FolhaCabecalho({ className, ...props }) {
  return <div className={`folha__cabecalho ${className || ""}`} {...props} />;
}

function FolhaRodape({ className, ...props }) {
  return <div className={`folha__rodape ${className || ""}`} {...props} />;
}

function FolhaTitulo({ className, ...props }) {
  return <SheetPrimitive.Title className={`folha__titulo ${className || ""}`} {...props} />;
}

function FolhaDescricao({ className, ...props }) {
  return <SheetPrimitive.Description className={`folha__descricao ${className || ""}`} {...props} />;
}

export {
  Folha,
  FolhaGatilho,
  FolhaFechar,
  FolhaConteudo,
  FolhaCabecalho,
  FolhaRodape,
  FolhaTitulo,
  FolhaDescricao,
};