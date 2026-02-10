import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import FeedTrabalhador from './pages/FeedTrabalhador';
import PainelCliente from './pages/PainelCliente';
import DetalhesTrabalho from './pages/DetalhesTrabalho';
import HistoricoCliente from './pages/HistoricoCliente';
import HistoricoProfissional from './pages/HistoricoProfissional';
import PerfilTrabalhador from './pages/PerfilTrabalhador';
import { authService } from './services/api';

const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/painel-cliente" element={
          <PrivateRoute>
             <PainelCliente />
          </PrivateRoute>
        } />

        <Route path="/historico-cliente" element={
          <PrivateRoute>
             <HistoricoCliente />
          </PrivateRoute>
        } />

        <Route path="/detalhes-trabalho" element={
          <PrivateRoute>
             <DetalhesTrabalho />
          </PrivateRoute>
        } />

        <Route path="/feed-trabalhador" element={
          <PrivateRoute>
            <FeedTrabalhador />
          </PrivateRoute>
        } />

        <Route path="/historico-profissional" element={
          <PrivateRoute>
            <HistoricoProfissional />
          </PrivateRoute>
        } />

        <Route path="/perfil-trabalhador" element={
          <PrivateRoute>
            <PerfilTrabalhador />
          </PrivateRoute>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
