import React from "react";
import { Outlet } from "react-router-dom";
import { NavegacaoInferior } from "./components/NavegacaoInferior";
import { useTemaEscuro } from "./context/ContextoTemaEscuro";
import "./Root.css";

export function Root() {
  const { temaEscuro } = useTemaEscuro();

  return (
    <div className={`root-container ${temaEscuro ? "root-container--escuro" : ""}`}>
      <main className="root-conteudo">
        <Outlet />
      </main>
      <NavegacaoInferior />
    </div>
  );
}