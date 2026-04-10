import React, { createContext, useContext, useEffect, useState } from 'react';
import { conta } from '../services/appwrite';

const ContextoAutenticacao = createContext();

export function usarAutenticacao() {
  return useContext(ContextoAutenticacao);
}

export function ProvedorAutenticacao({ children }) {
  const [usuario, definirUsuario] = useState(null);
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    async function validarSessao() {
      definirCarregando(true);
      try {
        const usuarioLogado = await conta.get();
        definirUsuario(usuarioLogado);
      } catch {
        definirUsuario(null);
      } finally {
        definirCarregando(false);
      }
    }
    validarSessao();
  }, []);

  async function entrar(email, senha) {
    definirCarregando(true);
    try {
      try {
        await conta.deleteSession('current');
      } catch {}
      await conta.createEmailPasswordSession(email, senha);
      const usuarioLogado = await conta.get();
      definirUsuario(usuarioLogado);
      return { sucesso: true };
    } catch (erro) {
      definirUsuario(null);
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
      await conta.deleteSession('current');
      definirUsuario(null);
      localStorage.removeItem('conectlar-session');
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <ContextoAutenticacao.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </ContextoAutenticacao.Provider>
  );
}