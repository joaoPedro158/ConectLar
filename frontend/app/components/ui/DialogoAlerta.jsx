"use client";

import React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Botao } from "./Botao";
import "./DialogoAlerta.css";

function DialogoAlerta({ ...props }) {
  return <AlertDialogPrimitive.Root data-slot="dialogo-alerta" {...props} />;
}

function DialogoAlertaGatilho({ ...props }) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="dialogo-alerta-gatilho" {...props} />
  );
}

function DialogoAlertaPortal({ ...props }) {
  return (
    <AlertDialogPrimitive.Portal data-slot="dialogo-alerta-portal" {...props} />
  );
}

function DialogoAlertaSobreposicao({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Overlay
      data-slot="dialogo-alerta-sobreposicao"
      className={`dialogo-alerta__sobreposicao ${className || ""}`}
      {...props}
    />
  );
}

function DialogoAlertaConteudo({ className, ...props }) {
  return (
    <DialogoAlertaPortal>
      <DialogoAlertaSobreposicao />
      <AlertDialogPrimitive.Content
        data-slot="dialogo-alerta-conteudo"
        className={`dialogo-alerta__conteudo ${className || ""}`}
        {...props}
      />
    </DialogoAlertaPortal>
  );
}

function DialogoAlertaCabecalho({ className, ...props }) {
  return (
    <div
      data-slot="dialogo-alerta-cabecalho"
      className={`dialogo-alerta__cabecalho ${className || ""}`}
      {...props}
    />
  );
}

function DialogoAlertaRodape({ className, ...props }) {
  return (
    <div
      data-slot="dialogo-alerta-rodape"
      className={`dialogo-alerta__rodape ${className || ""}`}
      {...props}
    />
  );
}

function DialogoAlertaTitulo({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="dialogo-alerta-titulo"
      className={`dialogo-alerta__titulo ${className || ""}`}
      {...props}
    />
  );
}

function DialogoAlertaDescricao({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="dialogo-alerta-descricao"
      className={`dialogo-alerta__descricao ${className || ""}`}
      {...props}
    />
  );
}

function DialogoAlertaAcao({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Action asChild>
      <Botao variante="padrao" className={className} {...props} />
    </AlertDialogPrimitive.Action>
  );
}

function DialogoAlertaCancelar({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Cancel asChild>
      <Botao variante="contorno" className={className} {...props} />
    </AlertDialogPrimitive.Cancel>
  );
}

export {
  DialogoAlerta,
  DialogoAlertaPortal,
  DialogoAlertaSobreposicao,
  DialogoAlertaGatilho,
  DialogoAlertaConteudo,
  DialogoAlertaCabecalho,
  DialogoAlertaRodape,
  DialogoAlertaTitulo,
  DialogoAlertaDescricao,
  DialogoAlertaAcao,
  DialogoAlertaCancelar,
};