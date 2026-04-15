import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../services/api";

const ContextoAutenticacao = createContext();

export function ProvedorAutenticacao({ children }) {
  const [token, setTokenState] = useState(() => api.getToken());
  const [usuario, setUsuario] = useState(() => {
    const salvo = localStorage.getItem("conectlar_usuario");
    return salvo ? JSON.parse(salvo) : null;
  });
  const [tipoLogin, setTipoLogin] = useState(() => localStorage.getItem("conectlar_tipo_login") || null);
  const [modoAtivo, setModoAtivo] = useState(() => {
    const salvo = localStorage.getItem("conectlar_modo_ativo");
    return salvo || "cliente";
  });

  const salvarSessao = (nextToken, nextUsuario, nextTipo, nextModo) => {
    api.setToken(nextToken);
    setTokenState(nextToken || null);

    if (nextUsuario) {
      setUsuario(nextUsuario);
      localStorage.setItem("conectlar_usuario", JSON.stringify(nextUsuario));
    } else {
      setUsuario(null);
      localStorage.removeItem("conectlar_usuario");
    }

    if (nextTipo) {
      setTipoLogin(nextTipo);
      localStorage.setItem("conectlar_tipo_login", nextTipo);
    } else {
      setTipoLogin(null);
      localStorage.removeItem("conectlar_tipo_login");
    }

    if (nextModo) {
      setModoAtivo(nextModo);
      localStorage.setItem("conectlar_modo_ativo", nextModo);
    }
  };

  const parseJwt = (jwt) => {
    try {
      const payloadBase64 = jwt.split(".")[1];
      if (!payloadBase64) return null;
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const login = async (respostaLogin) => {
    const nextToken = respostaLogin?.token ?? null;
    if (!nextToken) return;

    api.setToken(nextToken);
    setTokenState(nextToken);

    const jwtPayload = parseJwt(nextToken);
    const role = jwtPayload?.role || "USUARIO";
    const isProfissional = role === "PROFISSIONAL";
    const tipo = isProfissional ? "PROFISSIONAL" : "USUARIO";
    const modoInicial = isProfissional ? "profissional" : "cliente";

    let usuarioApi = null;
    try {
      const path = isProfissional ? "/profissional/meusdados" : "/usuario/meusdados";
      usuarioApi = await api.get(path);
    } catch (e) {
      // se falhar, seguimos só com os dados do token
      usuarioApi = null;
    }

    const usuarioNormalizado = {
      id: usuarioApi?.id ?? jwtPayload?.id ?? null,
      nome: usuarioApi?.nome ?? jwtPayload?.nome ?? "Usuário",
      email: usuarioApi?.email ?? jwtPayload?.sub ?? "",
      telefone: usuarioApi?.telefone ?? jwtPayload?.telefone ?? "",
      fotoPerfil: usuarioApi?.fotoPerfil ?? jwtPayload?.fotoPerfil ?? "",
      localizacao: Array.isArray(usuarioApi?.localizacao) ? usuarioApi.localizacao : [],
      role,
      tipoLogin: tipo,
      categoria: usuarioApi?.categoria ?? null,
      isProfissional,
    };

    salvarSessao(nextToken, usuarioNormalizado, tipo, modoInicial);
  };

  const logout = () => {
    salvarSessao(null, null, null, "cliente");
  };

  const alternarModo = () => {
    if (usuario?.isProfissional) {
      setModoAtivo((prev) => {
        const proximo = prev === "cliente" ? "profissional" : "cliente";
        localStorage.setItem("conectlar_modo_ativo", proximo);
        return proximo;
      });
    } else {
      alert("Precisas de te registar como profissional primeiro!");
    }
  };

  const value = useMemo(
    () => ({ usuario, token, tipoLogin, modoAtivo, login, logout, alternarModo }),
    [usuario, token, tipoLogin, modoAtivo]
  );

  return (
    <ContextoAutenticacao.Provider value={value}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}

// Hook para ser usado em qualquer componente que precise saber quem está logado
export function useAuth() {
  const contexto = useContext(ContextoAutenticacao);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um ProvedorAutenticacao");
  }
  return contexto;
}