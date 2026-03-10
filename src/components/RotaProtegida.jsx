import React from 'react';
import { Navigate } from 'react-router-dom';
import IndicadorCarregamento from './IndicadorCarregamento';
import { usarAutenticacao } from '../context/AuthContext';
import '../styles/components/RotaProtegida.css';

const RotaProtegida = ({ children }) => {
  const { usuario, carregando } = usarAutenticacao();

  if (carregando) {
    return (
      <div className="recipiente-carregamento-rota">
        <IndicadorCarregamento />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RotaProtegida;