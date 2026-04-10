import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usarAutenticacao } from '../context/AuthContext';
import '../styles/pages/TelaLogin.css';

const TelaLogin = () => {
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [mostrarSenha, definirMostrarSenha] = useState(false);
  const [erro, definirErro] = useState('');
  const [mensagemBoasVindas] = useState('Acesse sua conta com e-mail e senha.');
  const navegar = useNavigate();
  const { usuario, carregando, entrar } = usarAutenticacao();

  useEffect(() => {
    if (usuario) {
      navegar('/feed-cliente');
    }
  }, [usuario, navegar]);

  const lidarComLogin = async (e) => {
    e.preventDefault();
    definirErro('');
    const resultado = await entrar(email.trim(), senha);
    if (!resultado.sucesso) {
      definirErro(resultado.erro);
    }
  };

  return (
    <div className="recipiente-login">
      <div className="cartao-login">
        <div className="cabecalho-login">
          <img src="/banner.png" alt="Banner ConectLar" style={{ width: '200px', height: 'auto' }} />
        </div>

        <form onSubmit={lidarComLogin} className="formulario-login">
          <div className="grupo-entrada-login">
            <Mail className="icone-entrada-login" size={20} />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => definirEmail(e.target.value)}
              placeholder="E-mail"
              className="entrada-login"
            />
          </div>

          <div className="grupo-entrada-login">
            <Lock className="icone-entrada-login" size={20} />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => definirSenha(e.target.value)}
              placeholder="Senha"
              className="entrada-login entrada-com-alternancia"
            />
            <button
              type="button"
              onClick={() => definirMostrarSenha(!mostrarSenha)}
              className="alternar-senha-login"
              aria-label="Alternar visibilidade da senha"
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {erro && <p className="erro-login">{erro}</p>}

          <button type="submit" disabled={carregando || !email.trim() || !senha} className="botao-login">
            {carregando ? 'Autenticando...' : 'Entrar na Plataforma'}
          </button>
        </form>

        <div className="rodape-login">
          Não tem conta? <a href="/cadastro" className="link-login">Criar conta</a>
        </div>
      </div>
    </div>
  );
};

export default TelaLogin;