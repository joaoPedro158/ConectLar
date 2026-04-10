import React from 'react';
import AppWrapper from './AppWrapper';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TelaLogin from './pages/TelaLogin';
import TelaCadastro from './pages/TelaCadastro';
import TelaFeedCliente from './pages/TelaFeedCliente';
import TelaFeedProfissional from './pages/TelaFeedProfissional';
import TelaHistorico from './pages/TelaHistorico';
import TelaPerfil from './pages/TelaPerfil';
import TelaNovaProposta from './pages/TelaNovaProposta';
import RotaProtegida from './components/RotaProtegida';
import './App.css';

const App = () => {
  return (
    <AppWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/cadastro" element={<TelaCadastro />} />
          <Route path="/verificacao-email" element={<Navigate to="/login" replace />} />
          <Route path="/verificar-email" element={<Navigate to="/login" replace />} />
          <Route path="/recuperar-senha" element={<Navigate to="/login" replace />} />
          <Route path="/login-google" element={<Navigate to="/login" replace />} />
          <Route
            path="/feed-cliente"
            element={
              <RotaProtegida>
                <TelaFeedCliente />
              </RotaProtegida>
            }
          />
          <Route
            path="/feed-profissional"
            element={
              <RotaProtegida>
                <TelaFeedProfissional />
              </RotaProtegida>
            }
          />
          <Route
            path="/historico"
            element={
              <RotaProtegida>
                <TelaHistorico />
              </RotaProtegida>
            }
          />
          <Route
            path="/perfil"
            element={
              <RotaProtegida>
                <TelaPerfil />
              </RotaProtegida>
            }
          />
          <Route
            path="/nova-proposta"
            element={
              <RotaProtegida>
                <TelaNovaProposta />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AppWrapper>
  );
};

export default App;