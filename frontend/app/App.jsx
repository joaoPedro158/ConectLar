import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ProvedorTemaEscuro } from "./context/ContextoTemaEscuro";
import { ProvedorAutenticacao, useAuth } from "./context/ContextoAutenticacao";
import { SplashScreen } from "./pages/SplashScreen";
import { Login } from "./pages/Login";
import { ClientFeed } from "./pages/ClientFeed";
import { ProfessionalFeed } from "./pages/ProfessionalFeed";
import { Perfil } from "./pages/Perfil";
import { ConectaRide } from "./pages/ConectaRide";
import { NavegacaoInferior } from "./components/NavegacaoInferior";
import "./styles/global.css";



function AppRoutes() {
  const { usuario } = useAuth();
  if (!usuario) {
    return <Login />;
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<ClientFeed />} />
        <Route path="/profissional" element={<ProfessionalFeed />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/conectaride" element={<ConectaRide />} />
      </Routes>
      <NavegacaoInferior />
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
        <AppRoutes />
      </ProvedorTemaEscuro>
    </ProvedorAutenticacao>
  );
}