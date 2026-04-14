// srcdefinito/app/context/ContextoAutenticacao.jsx
import React, { createContext, useContext, useState } from "react";

const ContextoAutenticacao = createContext();

export function ProvedorAutenticacao({ children }) {
  // Estado inicial: null significa que ninguém está logado
  const [usuario, setUsuario] = useState(null); 
  
  // O modo determina qual interface carregar: 'cliente' ou 'profissional'
  const [modoAtivo, setModoAtivo] = useState("cliente"); 

  const login = (dadosUsuario) => {
    // Quando o usuário loga (após inserir email e senha corretos)
    setUsuario(dadosUsuario);
    // Por padrão, todo mundo entra vendo a tela de cliente primeiro
    setModoAtivo("cliente"); 
  };

  const logout = () => {
    setUsuario(null);
    setModoAtivo("cliente");
  };

  const alternarModo = () => {
    // Só deixa alternar se a conta tiver a permissão de profissional
    if (usuario?.isProfissional) {
      setModoAtivo((prev) => (prev === "cliente" ? "profissional" : "cliente"));
    } else {
      alert("Precisas de te registar como profissional primeiro!");
    }
  };

  return (
    <ContextoAutenticacao.Provider value={{ usuario, modoAtivo, login, logout, alternarModo }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

// Hook para ser usado em qualquer componente que precise saber quem está logado
export function useAuth() {
  const contexto = useContext(ContextoAutenticacao);
  if (contexto === undefined) {
    throw new Error("useAuth deve ser usado dentro de um ProvedorAutenticacao");
  }
  return contexto;
}