
import React from 'react';
import { Home, User, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/pages/BarraNavegacao.css';

const BarraNavegacao = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="barra-navegacao-container">
      <div className="barra-navegacao-separador" />
      <div className="barra-navegacao-conteudo">
        <button
          className={`barra-navegacao-item${location.pathname === '/' ? ' barra-navegacao-item-ativo' : ''}`}
          onClick={() => navigate('/')}
        >
          <Home size={24} />
          <span className="barra-navegacao-texto">Home</span>
        </button>
        <button
          className={`barra-navegacao-item${location.pathname === '/perfil' ? ' barra-navegacao-item-ativo' : ''}`}
          onClick={() => navigate('/perfil')}
        >
          <User size={24} />
          <span className="barra-navegacao-texto">Perfil</span>
        </button>
        <button
          className={`barra-navegacao-item${location.pathname === '/configuracoes' ? ' barra-navegacao-item-ativo' : ''}`}
          onClick={() => navigate('/configuracoes')}
        >
          <Settings size={24} />
          <span className="barra-navegacao-texto">Configurações</span>
        </button>
      </div>
    </div>
  );
};

export default BarraNavegacao;
