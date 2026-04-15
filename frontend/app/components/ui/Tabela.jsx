"use client";

import React from "react";
import "./Tabela.css";

function Tabela({ className, ...props }) {
  return (
    <div data-slot="tabela-container" className="tabela-container">
      <table
        data-slot="tabela"
        className={`tabela ${className || ""}`}
        {...props}
      />
    </div>
  );
}

function TabelaCabecalho({ className, ...props }) {
  return (
    <thead
      data-slot="tabela-cabecalho"
      className={`tabela__cabecalho ${className || ""}`}
      {...props}
    />
  );
}

function TabelaCorpo({ className, ...props }) {
  return (
    <tbody
      data-slot="tabela-corpo"
      className={`tabela__corpo ${className || ""}`}
      {...props}
    />
  );
}

function TabelaRodape({ className, ...props }) {
  return (
    <tfoot
      data-slot="tabela-rodape"
      className={`tabela__rodape ${className || ""}`}
      {...props}
    />
  );
}

function TabelaLinha({ className, ...props }) {
  return (
    <tr
      data-slot="tabela-linha"
      className={`tabela__linha ${className || ""}`}
      {...props}
    />
  );
}

function TabelaCelulaCabecalho({ className, ...props }) {
  return (
    <th
      data-slot="tabela-celula-cabecalho"
      className={`tabela__celula-cabecalho ${className || ""}`}
      {...props}
    />
  );
}

function TabelaCelula({ className, ...props }) {
  return (
    <td
      data-slot="tabela-celula"
      className={`tabela__celula ${className || ""}`}
      {...props}
    />
  );
}

function TabelaLegenda({ className, ...props }) {
  return (
    <caption
      data-slot="tabela-legenda"
      className={`tabela__legenda ${className || ""}`}
      {...props}
    />
  );
}

export {
  Tabela,
  TabelaCabecalho,
  TabelaCorpo,
  TabelaRodape,
  TabelaCelulaCabecalho,
  TabelaLinha,
  TabelaCelula,
  TabelaLegenda,
};