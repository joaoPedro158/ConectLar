import React, { createContext, useContext, useEffect, useState } from "react";

const ContextoTemaEscuro = createContext();

export function ProvedorTemaEscuro({ children }) {
  const [temaEscuro, setTemaEscuro] = useState(() => {
    const salvo = localStorage.getItem("tema-escuro");
    if (salvo !== null) {
      return salvo === "true";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (temaEscuro) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    localStorage.setItem("tema-escuro", temaEscuro);
  }, [temaEscuro]);

  const alternarTema = () => {
    setTemaEscuro((prev) => !prev);
  };

  return (
    <ContextoTemaEscuro.Provider value={{ temaEscuro, alternarTema }}>
      {children}
    </ContextoTemaEscuro.Provider>
  );
}

export function useTemaEscuro() {
  const contexto = useContext(ContextoTemaEscuro);
  if (contexto === undefined) {
    throw new Error("useTemaEscuro deve ser usado dentro de um ProvedorTemaEscuro");
  }
  return contexto;
}