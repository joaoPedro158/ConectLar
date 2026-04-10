import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getMe, getToken, login, setToken } from '../services/api';

const ContextoAutenticacao = createContext();

export function usarAutenticacao() {
  return useContext(ContextoAutenticacao);
}

export function ProvedorAutenticacao({ children }) {
  const [usuario, definirUsuario] = useState(null);
  const [tipoPerfil, definirTipoPerfil] = useState(null);
  const [token, definirToken] = useState(getToken());
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    async function validarSessao() {
      definirCarregando(true);
      try {
        const stored = getToken();
        if (!stored) {
          definirUsuario(null);
          definirTipoPerfil(null);
          definirToken('');
          return;
        }

        const me = await getMe(stored);
        definirUsuario(me.usuario);
        definirTipoPerfil(me.tipoPerfil);
        definirToken(stored);
      } catch {
        definirUsuario(null);
        definirTipoPerfil(null);
        definirToken('');
        clearToken();
      } finally {
        definirCarregando(false);
      }
    }
    validarSessao();
  }, []);

  async function entrar(email, senha) {
    definirCarregando(true);
    try {
      const resp = await login({ login: email, senha });
      const nextToken = resp?.token;
      if (!nextToken) throw new Error('Token não retornado pelo servidor.');

      setToken(nextToken);
      const me = await getMe(nextToken);
      definirUsuario(me.usuario);
      definirTipoPerfil(me.tipoPerfil);
      definirToken(nextToken);
      return { sucesso: true };
    } catch (erro) {
      definirUsuario(null);
      definirTipoPerfil(null);
      definirToken('');
      clearToken();
      let mensagem = 'E-mail ou senha incorretos.';
      if (erro && erro.message) {
        mensagem += ` (${erro.message})`;
      }
      return { sucesso: false, erro: mensagem };
    } finally {
      definirCarregando(false);
    }
  }

  async function sair() {
    definirCarregando(true);
    try {
      definirUsuario(null);
      definirTipoPerfil(null);
      definirToken('');
      clearToken();
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <ContextoAutenticacao.Provider value={{ usuario, tipoPerfil, token, carregando, entrar, sair }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}