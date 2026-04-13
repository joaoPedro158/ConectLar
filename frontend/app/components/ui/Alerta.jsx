import React from "react";
import "./Alerta.css";

function Alerta({ className, variante = "padrao", ...props }) {
  return (
    <div
      data-slot="alerta"
      role="alert"
      className={`alerta alerta--${variante} ${className || ""}`}
      {...props}
    />
  );
}

function AlertaTitulo({ className, ...props }) {
  return (
    <div
      data-slot="alerta-titulo"
      className={`alerta__titulo ${className || ""}`}
      {...props}
    />
  );
}

function AlertaDescricao({ className, ...props }) {
  return (
    <div
      data-slot="alerta-descricao"
      className={`alerta__descricao ${className || ""}`}
      {...props}
    />
  );
}

export { Alerta, AlertaTitulo, AlertaDescricao };