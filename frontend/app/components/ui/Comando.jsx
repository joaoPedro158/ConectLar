"use client";

import React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";
import { Dialogo, DialogoConteudo, DialogoCabecalho, DialogoTitulo, DialogoDescricao } from "./Dialogo";
import "./Comando.css";

function Comando({ className, ...props }) {
  return (
    <CommandPrimitive
      data-slot="comando"
      className={`comando ${className || ""}`}
      {...props}
    />
  );
}

function ComandoDialogo({
  titulo = "Paleta de Comandos",
  descricao = "Pesquise por um comando ou ação...",
  children,
  ...props
}) {
  return (
    <Dialogo {...props}>
      <DialogoCabecalho className="sr-only">
        <DialogoTitulo>{titulo}</DialogoTitulo>
        <DialogoDescricao>{descricao}</DialogoDescricao>
      </DialogoCabecalho>
      <DialogoConteudo className="comando-dialogo__conteudo">
        <Comando className="comando--dialogo">
          {children}
        </Comando>
      </DialogoConteudo>
    </Dialogo>
  );
}

function ComandoInput({ className, ...props }) {
  return (
    <div data-slot="comando-input-wrapper" className="comando__input-wrapper">
      <SearchIcon className="comando__input-icone" />
      <CommandPrimitive.Input
        data-slot="comando-input"
        className={`comando__input ${className || ""}`}
        {...props}
      />
    </div>
  );
}

function ComandoLista({ className, ...props }) {
  return (
    <CommandPrimitive.List
      data-slot="comando-lista"
      className={`comando__lista ${className || ""}`}
      {...props}
    />
  );
}

function ComandoVazio({ ...props }) {
  return (
    <CommandPrimitive.Empty
      data-slot="comando-vazio"
      className="comando__vazio"
      {...props}
    />
  );
}

function ComandoGrupo({ className, ...props }) {
  return (
    <CommandPrimitive.Group
      data-slot="comando-grupo"
      className={`comando__grupo ${className || ""}`}
      {...props}
    />
  );
}

function ComandoSeparador({ className, ...props }) {
  return (
    <CommandPrimitive.Separator
      data-slot="comando-separador"
      className={`comando__separador ${className || ""}`}
      {...props}
    />
  );
}

function ComandoItem({ className, ...props }) {
  return (
    <CommandPrimitive.Item
      data-slot="comando-item"
      className={`comando__item ${className || ""}`}
      {...props}
    />
  );
}

function ComandoAtalho({ className, ...props }) {
  return (
    <span
      data-slot="comando-atalho"
      className={`comando__atalho ${className || ""}`}
      {...props}
    />
  );
}

export {
  Comando,
  ComandoDialogo,
  ComandoInput,
  ComandoLista,
  ComandoVazio,
  ComandoGrupo,
  ComandoItem,
  ComandoAtalho,
  ComandoSeparador,
};