import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, ClipboardList, User } from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/ui/NavegacaoInferior.css";

const itensNav = [
  { rotulo: "Início", icone: Home, caminho: "/" },
  { rotulo: "ConectaRide", icone: Car, caminho: "/conectaride" },
  { rotulo: "Pedidos", icone: ClipboardList, caminho: "/profissional" },
  { rotulo: "Perfil", icone: User, caminho: "/perfil" },
];

export function NavegacaoInferior() {
  const navigate = useNavigate();
  const location = useLocation();
  const { temaEscuro } = useTemaEscuro();

  return (
    <nav className={`nav-inferior ${temaEscuro ? "nav-inferior--escuro" : ""}`}>
      <div className="nav-inferior__container">
        {itensNav.map((item) => {
          const estaAtivo = location.pathname === item.caminho;
          const Icone = item.icone;
          
          return (
            <button
              key={item.caminho}
              onClick={() => navigate(item.caminho)}
              className={`nav-inferior__botao ${estaAtivo ? "nav-inferior__botao--ativo" : ""}`}
            >
              {estaAtivo && <span className="nav-inferior__indicador" />}
              <Icone
                size={22}
                className="nav-inferior__icone"
                strokeWidth={estaAtivo ? 2.5 : 1.8}
              />
              <span className="nav-inferior__texto">
                {item.rotulo}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}