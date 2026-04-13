import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ProvedorTemaEscuro } from "./context/ContextoTemaEscuro";
import { SplashScreen } from "./pages/SplashScreen";
import { Login } from "./pages/Login";
import { ClientFeed } from "./pages/ClientFeed";
import { ProfessionalFeed } from "./pages/ProfessionalFeed";
import { Perfil } from "./pages/Perfil";
import { ConectaRide } from "./pages/ConectaRide";
import { NavegacaoInferior } from "./components/NavegacaoInferior";
import "./styles/global.css";

export default function App() {
  const [mostrarSplash, setMostrarSplash] = useState(true);
  const [usuario, setUsuario] = useState(null);

  if (mostrarSplash) {
    return <SplashScreen aoFinalizar={() => setMostrarSplash(false)} />;
  }

  return (
    <ProvedorTemaEscuro>
      {usuario == null ? (
        <Login onLogin={setUsuario} />
      ) : (
        <div className="app-container">
          <main className="app-conteudo">
            <Routes>
              <Route path="/" element={<ClientFeed />} />
              <Route path="/profissional" element={<ProfessionalFeed />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/conectaride" element={<ConectaRide />} />
            </Routes>
          </main>
          <NavegacaoInferior />
        </div>
      )}
    </ProvedorTemaEscuro>
  );
}