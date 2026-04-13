"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import "./Dialogo.css";

function Dialogo({ ...props }) {
  return <DialogPrimitive.Root data-slot="dialogo" {...props} />;
}

function DialogoGatilho({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialogo-gatilho" {...props} />;
}

function DialogoPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot="dialogo-portal" {...props} />;
}

function DialogoFechar({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialogo-fechar" {...props} />;
}

function DialogoSobreposicao({ className, ...props }) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialogo-sobreposicao"
      className={`dialogo__sobreposicao ${className || ""}`}
      {...props}
    />
  );
}

function DialogoConteudo({ className, children, ...props }) {
  return (
    <DialogoPortal>
      <DialogoSobreposicao />
      <DialogPrimitive.Content
        data-slot="dialogo-conteudo"
        className={`dialogo__conteudo ${className || ""}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="dialogo__botao-fechar">
          <XIcon size={16} />
          <span className="sr-only">Fechar</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogoPortal>
  );
}

function DialogoCabecalho({ className, ...props }) {
  return (
    <div
      data-slot="dialogo-cabecalho"
      className={`dialogo__cabecalho ${className || ""}`}
      {...props}
    />
  );
}

function DialogoRodape({ className, ...props }) {
  return (
    <div
      data-slot="dialogo-rodape"
      className={`dialogo__rodape ${className || ""}`}
      {...props}
    />
  );
}

function DialogoTitulo({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialogo-titulo"
      className={`dialogo__titulo ${className || ""}`}
      {...props}
    />
  );
}

function DialogoDescricao({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialogo-descricao"
      className={`dialogo__descricao ${className || ""}`}
      {...props}
    />
  );
}

export {
  Dialogo,
  DialogoFechar,
  DialogoConteudo,
  DialogoDescricao,
  DialogoRodape,
  DialogoCabecalho,
  DialogoSobreposicao,
  DialogoPortal,
  DialogoTitulo,
  DialogoGatilho,
};