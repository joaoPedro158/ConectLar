import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Car, ClipboardList, User, Briefcase, MapPin, TrendingUp } from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import { useAuth } from "../context/ContextoAutenticacao"; // Puxando o contexto
import "../styles/ui/NavegacaoInferior.css";

// Menu para quem está solicitando serviços
const menuCliente = [
  { rotulo: "Início", icone: Home, caminho: "/" },
  { rotulo: "Ride", icone: Car, caminho: "/conectaride" },
  // { rotulo: "Pedidos", icone: ClipboardList, caminho: "/pedidos" }, // Removido para clientes
  { rotulo: "Perfil", icone: User, caminho: "/perfil" },
];

// Menu para quem está prestando serviços / motorista
const menuProfissional = [
  { rotulo: "Serviços", icone: Briefcase, caminho: "/" },
  { rotulo: "Corridas", icone: MapPin, caminho: "/motoristaride" },
  { rotulo: "Ganhos", icone: TrendingUp, caminho: "/ganhos" },
  { rotulo: "Perfil", icone: User, caminho: "/perfil" },
];

export function NavegacaoInferior() {
  const navigate = useNavigate();
  const location = useLocation();
  const { temaEscuro } = useTemaEscuro();
  
  // Pega o modo atual (cliente ou profissional)
  const { modoAtivo } = useAuth(); 

  // Define qual menu renderizar
  const itensNav = modoAtivo === "profissional" ? menuProfissional : menuCliente;

  return (
    <nav className={`nav-inferior ${temaEscuro ? "nav-inferior--escuro" : ""}`}>
      <div className="nav-inferior__container">
        {itensNav.map((item) => {
          const estaAtivo = location.pathname === item.caminho;
          const Icone = item.icone;
          
          return (
            <button
              key={item.rotulo}
              onClick={() => navigate(item.caminho)}
              className={`nav-inferior__botao ${estaAtivo ? "nav-inferior__botao--ativo" : ""}`}
            >
              <div className="nav-inferior__icone-wrapper">
                <Icone
                  size={20}
                  className="nav-inferior__icone"
                  strokeWidth={estaAtivo ? 3 : 2}
                />
              </div>
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