import { ClientFeed } from "./pages/cliente/ClientFeed.jsx";
import { ConectaRide } from "./pages/cliente/ConectaRide.jsx";
import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProvedorTemaEscuro } from "./context/ContextoTemaEscuro.jsx";
import { ProvedorAutenticacao, useAuth } from "./context/ContextoAutenticacao.jsx";
import { ProvedorCorridas } from "./context/ContextoCorridas.jsx";
import { SplashScreen } from "./pages/SplashScreen.jsx";
import { Login } from "./pages/Login.jsx"; 
import { Perfil } from "./pages/Perfil.jsx"; 
import { NavegacaoInferior } from "./components/NavegacaoInferior.jsx";
import "./styles/global.css";

import { useTemaEscuro } from "./context/ContextoTemaEscuro.jsx";
import "./styles/pages/ConectaRide.css";
// Ficheiros do Profissional (agora na pasta profissional)
import { ProfessionalFeed } from "./pages/profissional/ProfessionalFeed.jsx"; 
import { MotoristaRide } from "./pages/profissional/MotoristaRide.jsx"; 

function RotaProtegida({ children }) {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={usuario ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route 
          path="/" 
          element={<RotaProtegida><ClientFeed /></RotaProtegida>} 
        />
        <Route 
          path="/profissional" 
          element={<RotaProtegida><ProfessionalFeed /></RotaProtegida>} 
        />
        <Route 
          path="/motoristaride" 
          element={<RotaProtegida><MotoristaRide /></RotaProtegida>} 
        />
        <Route 
          path="/ganhos" 
          element={<RotaProtegida><ProfessionalFeed initialAba="ganhos" /></RotaProtegida>} 
        />
        <Route 
          path="/perfil" 
          element={<RotaProtegida><Perfil /></RotaProtegida>} 
        />
        <Route 
          path="/conectaride" 
          element={<RotaProtegida><ConectaRide /></RotaProtegida>} 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {usuario && <NavegacaoInferior />}
    </>
  );
}

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);

  if (mostrarSplash) {
    return <SplashScreen aoFinalizar={() => setMostrarSplash(false)} />;
  }

  return (
    <ProvedorAutenticacao>
      <ProvedorTemaEscuro>
        <ProvedorCorridas>
          <div className="app-container">
            <AppRoutes />
          </div>
        </ProvedorCorridas>
      </ProvedorTemaEscuro>
    </ProvedorAutenticacao>
  );
}