import React, { useState } from "react";
import {
  Edit3,
  ChevronRight,
  LogOut,
  CreditCard,
  CheckCircle,
  Sun,
  Moon,
  Zap,
  Car,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
const MENU_SECTIONS = [
  {
    title: "Conta",
    items: [
      { label: "Editar Perfil", icon: Edit3, color: "text-cyan-500" },
      { label: "Pagamentos", icon: CreditCard, color: "text-yellow-400" },
    ],
  },
  {
    title: "Preferências",
    items: [
      { label: "Modo Escuro", icon: Moon, color: "text-cyan-500", isToggle: true },
    ],
  },
];
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/Perfil.css";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200";

const estatisticas = [
  { rotulo: "Corridas", valor: "124" },
  { rotulo: "Avaliação", valor: "4.9" },
  { rotulo: "Membro", valor: "2 anos" },
];

const distintivos = [
  { rotulo: "Pontual", cor: "amarelo", icone: Zap },
  { rotulo: "ConectaRide", cor: "ciano", icone: Car },
];

export function Perfil() {
  const { temaEscuro, alternarTema } = useTemaEscuro();
  const [modoEdicao, setModoEdicao] = useState(false);
  const [nome, setNome] = useState("Carlos Mendes");
  const [phone, setPhone] = useState("(84) 99999-0000");
  const [email, setEmail] = useState("carlos@email.com");
  const [city, setCity] = useState("Nova Cruz - RN");
  const [menuSections] = useState(MENU_SECTIONS);

  return (
    <div className={`perfil ${temaEscuro ? "perfil--escuro" : ""}`}>
      {/* TOPO PERFIL - layout inspirado no snippet */}
      <header
        className={`perfil-topo ${
          temaEscuro ? "perfil-topo--escuro" : "perfil-topo--claro"
        }`}
      >
        <div className="perfil-topo__acoes">
          <span className="perfil-topo__etiqueta">Meu Perfil</span>
          <div className="perfil-topo__botoes">
            <button onClick={alternarTema} className="btn-tema">
              {temaEscuro ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={() => setModoEdicao((v) => !v)}
              className={`btn-editar ${modoEdicao ? "btn-editar--salvar" : ""}`}
            >
              <Edit3 size={12} />
              {modoEdicao ? "Salvar" : "Editar"}
            </button>
          </div>
        </div>

        <div className="perfil-info">
          <div className="perfil-info__avatar-container">
            <img
              src={AVATAR_URL}
              alt="Avatar"
              className="perfil-info__avatar"
            />
            <span className="perfil-info__check">
              <CheckCircle size={12} strokeWidth={3} />
            </span>
          </div>
          <div className="perfil-info__dados">
            {modoEdicao ? (
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-nome"
              />
            ) : (
              <h2 className="perfil-info__nome">{nome}</h2>
            )}
            <div className="perfil-info__distintivos">
              {distintivos.map((b) => (
                <span
                  key={b.rotulo}
                  className={`badge badge--${b.cor}`}
                >
                  <b.icone size={10} strokeWidth={2.5} />
                  {b.rotulo}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grade-estatisticas-perfil">
          {estatisticas.map((s) => (
            <div key={s.rotulo} className="estatistica-perfil-item">
              <span className="valor">{s.valor}</span>
              <span className="rotulo">{s.rotulo}</span>
            </div>
          ))}
        </div>

      </header>

      {/* Caixa de Contato */}
      <div className={`perfil-caixa perfil-caixa--contato ${temaEscuro ? "perfil-caixa--escuro" : "perfil-caixa--claro"}`}>
        <div className="perfil-caixa__header perfil-caixa__header--contato">
          <span className="perfil-caixa__header-label">Contato</span>
        </div>
        {[
          { icon: Phone, value: phone, setter: setPhone, key: "phone" },
          { icon: Mail, value: email, setter: setEmail, key: "email" },
          { icon: MapPin, value: city, setter: setCity, key: "city" },
        ].map((item) => (
          <div
            key={item.key}
            className={`perfil-caixa__linha perfil-caixa__linha--contato ${temaEscuro ? "perfil-caixa__linha--escuro" : "perfil-caixa__linha--claro"}`}
          >
            <item.icon size={16} className="text-cyan-500 flex-shrink-0" strokeWidth={2.5} />
            {modoEdicao ? (
              <input
                value={item.value}
                onChange={(e) => item.setter(e.target.value)}
                className={`perfil-caixa__input ${temaEscuro ? "perfil-caixa__input--escuro" : "perfil-caixa__input--claro"}`}
              />
            ) : (
              <span className={`perfil-caixa__valor ${temaEscuro ? "perfil-caixa__valor--escuro" : "perfil-caixa__valor--claro"}`}>{item.value}</span>
            )}
          </div>
        ))}
      </div>

      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className={`perfil-caixa perfil-caixa--menu ${temaEscuro ? "perfil-caixa--escuro" : "perfil-caixa--claro"}`}>
          <div className={`perfil-caixa__header ${temaEscuro ? "perfil-caixa__header--escuro" : "perfil-caixa__header--claro"}`}>
            <span className="perfil-caixa__header-label perfil-caixa__header-label--menu">{section.title}</span>
          </div>
          {section.items.map((item, idx) => (
            <button
              key={item.label}
              onClick={"isToggle" in item && item.isToggle ? alternarTema : undefined}
              className={`perfil-caixa__linha perfil-caixa__linha--menu ${
                idx < section.items.length - 1
                  ? temaEscuro
                    ? "perfil-caixa__linha--escuro"
                    : "perfil-caixa__linha--claro"
                  : ""
              } ${temaEscuro ? "perfil-caixa__linha--hover-escuro" : "perfil-caixa__linha--hover-claro"}`}
            >
              <item.icon size={16} className={item.color} strokeWidth={2.5} />
              <span className={`perfil-caixa__menu-label ${temaEscuro ? "perfil-caixa__menu-label--escuro" : "perfil-caixa__menu-label--claro"}`}>{item.label}</span>
              {"isToggle" in item && item.isToggle ? (
                <div className={`perfil-caixa__toggle ${temaEscuro ? "perfil-caixa__toggle--escuro" : "perfil-caixa__toggle--claro"}`}>
                  <div className={`perfil-caixa__toggle-bola ${temaEscuro ? "perfil-caixa__toggle-bola--escuro" : "perfil-caixa__toggle-bola--claro"}`} />
                </div>
              ) : (
                <ChevronRight size={14} className={temaEscuro ? "text-zinc-500" : "text-stone-400"} />
              )}
            </button>
          ))}
        </div>
      ))}

      {/* Logout */}
      <div className="perfil-caixa perfil-caixa--logout">
        <button className={`perfil-caixa__logout-btn ${temaEscuro ? "perfil-caixa__logout-btn--escuro" : "perfil-caixa__logout-btn--claro"}`}>
          <LogOut size={16} className="text-red-500" strokeWidth={2.5} />
          <span className="perfil-caixa__logout-label">Sair da Conta</span>
        </button>
      </div>

      {/* SEÇÕES DE MENU */}
      <main className="perfil-menu">
        <section className="menu-grupo">
          <div className="menu-grupo__titulo">Conta</div>
          <button className="menu-item"><Edit3 size={16} className="cor-ciano" /> <span>Editar Perfil</span> <ChevronRight size={14} /></button>
          <button className="menu-item"><CreditCard size={16} className="cor-amarelo" /> <span>Pagamentos</span> <ChevronRight size={14} /></button>
        </section>

        <section className="menu-grupo">
          <div className="menu-grupo__titulo">Preferências</div>
          <button onClick={alternarTema} className="menu-item">
            {temaEscuro ? <Sun size={16} className="cor-ciano" /> : <Moon size={16} className="cor-ciano" />}
            <span className="flex-1">Modo {temaEscuro ? "Claro" : "Escuro"}</span>
            <div className={`toggle-switch ${temaEscuro ? "toggle-switch--ativo" : ""}`}>
              <div className="toggle-switch__bola" />
            </div>
          </button>
        </section>

        <button className="btn-sair">
          <LogOut size={16} /> <span>Sair da Conta</span>
        </button>
      </main>

      <footer className="perfil-rodape">ConectaLar v1.0.0</footer>
    </div>
  );
}