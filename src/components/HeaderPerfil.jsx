import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import '../styles/components/HeaderPerfil.css';

const HeaderPerfil = ({ nome, foto, onLogout }) => {
  const [erroImg, setErroImg] = useState(false);

  return (
    <>
      <header className="cabecalho-perfil">
        <div className="cabecalho-conteudo">
          <div className="cabecalho-avatar">
            {foto && !erroImg ? (
              <img
                src={foto}
                alt="Perfil"
                className="cabecalho-imagem"
                onError={() => setErroImg(true)}
              />
            ) : (
              <div className="cabecalho-avatar-vazio" />
            )}
          </div>
          <div className="cabecalho-textos">
            <span className="cabecalho-saudacao">Olá,</span>
            <span className="cabecalho-nome">{nome}</span>
          </div>
        </div>

        {typeof onLogout === 'function' ? (
          <button
            type="button"
            className="cabecalho-sair"
            onClick={onLogout}
            aria-label="Sair da conta"
            title="Sair"
          >
            <LogOut size={24} />
          </button>
        ) : null}
      </header>
      <div className="barra-separadora" />
    </>
  );
};

export default HeaderPerfil;