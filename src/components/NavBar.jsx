import React from 'react';
import { Home, History, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/BarraNavegacao.css';

const BarraNavegacao = ({ tipoPerfil = 'USUARIO' }) => {
  const navegar = useNavigate();
  const caminho = window.location.pathname;

  const linkFeed = tipoPerfil === 'PROFISSIONAL' ? '/feed-profissional' : '/feed-cliente';
  const feedAtivo = caminho.includes('feed-cliente') || caminho.includes('feed-profissional');

  return (
    <nav className="barra-navegacao-container" aria-label="Navegação">
      <div className="barra-navegacao-separador" aria-hidden="true" />
      <div className="barra-navegacao-conteudo">
        <button
          className={`barra-navegacao-item ${feedAtivo ? 'barra-navegacao-item-ativo' : ''}`}
          onClick={() => navegar(linkFeed)}
        >
          <Home size={24} />
          <span className="barra-navegacao-texto">Feed</span>
        </button>
        <button
          className={`barra-navegacao-item ${caminho.includes('historico') ? 'barra-navegacao-item-ativo' : ''}`}
          onClick={() => navegar('/historico')}
        >
          <History size={24} />
          <span className="barra-navegacao-texto">Histórico</span>
        </button>
        <button
          className={`barra-navegacao-item ${caminho.includes('perfil') ? 'barra-navegacao-item-ativo' : ''}`}
          onClick={() => navegar('/perfil')}
        >
          <User size={24} />
          <span className="barra-navegacao-texto">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

export default BarraNavegacao;
