import React, { useState } from "react";
import {
  Star, MapPin, Phone, Mail, Edit3, ChevronRight, LogOut,
  Shield, Bell, CreditCard, HelpCircle, Zap, Car, CheckCircle,
  Sun, Moon, Repeat // Ícone novo para trocar de modo
} from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import { useAuth } from "../context/ContextoAutenticacao"; // Puxamos o contexto de Auth!
import "../styles/pages/Perfil.css";

const AVATAR_URL = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200";

// Dados que mudam consoante o modo
const statsCliente = [
  { label: "Serviços", value: "24" },
  { label: "Avaliação", value: "4,9" },
  { label: "Membro", value: "2 anos" },
];

const statsProfissional = [
  { label: "Ganhos", value: "R$ 4K" },
  { label: "Nota", value: "4,9" },
  { label: "Corridas", value: "156" },
];

const badgesProfissional = [
  { icon: Zap, label: "Elétrica", colorClass: "bg-amarelo" },
  { icon: Car, label: "ConectaRide", colorClass: "bg-ciano" },
  { icon: CheckCircle, label: "Verificado", colorClass: "bg-lima" },
];

const badgesCliente = [
  { icon: Star, label: "Cliente Top", colorClass: "bg-amarelo" }
];

export function Perfil() {
  const { temaEscuro, alternarTema } = useTemaEscuro();
  
  // Aqui pegamos o usuário, o modo atual e as funções de logout e troca
  const { usuario, modoAtivo, alternarModo, logout } = useAuth(); 
  
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(usuario?.nome || "Carlos Mendes");
  const [phone, setPhone] = useState("(84) 99812-3456");
  const [email, setEmail] = useState(usuario?.email || "carlos@email.com");
  const [city, setCity] = useState("Santo Antônio, RN"); // A tua terra, boy!

  // Decide quais dados mostrar consoante o modo
  const isProfissional = modoAtivo === "profissional";
  const stats = isProfissional ? statsProfissional : statsCliente;
  const badges = isProfissional ? badgesProfissional : badgesCliente;

  const menuSections = [
    {
      title: "Conta",
      items: [
        { icon: Edit3, label: "Editar Perfil", colorClass: "txt-ciano" },
        { icon: CreditCard, label: "Pagamentos e Carteiras", colorClass: "txt-amarelo" },
        { icon: Bell, label: "Notificações", colorClass: "txt-laranja" },
        { icon: Shield, label: "Privacidade e Segurança", colorClass: "txt-lima" },
      ],
    },
    {
      title: "Preferências",
      items: [
        {
          icon: temaEscuro ? Sun : Moon,
          label: `Modo ${temaEscuro ? "Claro" : "Escuro"}`,
          colorClass: "txt-ciano",
          isToggle: true,
          onToggle: alternarTema
        },
      ],
    },
    {
      title: "Suporte",
      items: [
        { icon: HelpCircle, label: "Central de Ajuda", colorClass: "txt-ciano" },
        { icon: Star, label: "Avalie o ConectaLar", colorClass: "txt-amarelo" },
      ],
    },
  ];

  return (
    <div className={`perfil ${temaEscuro ? "perfil--escuro" : ""}`}>
      {/* HEADER */}
      <div className={`perfil-header ${temaEscuro ? "perfil-header--escuro" : "perfil-header--claro"} ${isProfissional ? "perfil-header--pro" : ""}`}>
        
        {/* Topo com Etiqueta e Botões */}
        <div className="perfil-header__topo">
          <span className="perfil-header__etiqueta">
            Meu Perfil {isProfissional ? "(Profissional)" : "(Cliente)"}
          </span>
          <div className="perfil-header__botoes">
            <button onClick={alternarTema} className="btn-circulo-header">
              {temaEscuro ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`btn-editar-header ${editMode ? "btn-editar-header--ativo" : ""}`}
            >
              <Edit3 size={12} />
              {editMode ? "Salvar" : "Editar"}
            </button>
          </div>
        </div>

        {/* Avatar + Info */}
        <div className="perfil-header__info">
          <div className="perfil-header__avatar-box">
            <img src={usuario?.foto || AVATAR_URL} alt="Avatar" className="perfil-header__img" />
            <span className="perfil-header__status-badge">
              <CheckCircle size={12} strokeWidth={3} />
            </span>
          </div>
          
          <div className="perfil-header__dados">
            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-nome-edit"
              />
            ) : (
              <h2 className="perfil-header__nome">{name}</h2>
            )}
            
            <div className="perfil-header__badges">
              {badges.map((b) => (
                <span key={b.label} className={`badge-pill ${b.colorClass}`}>
                  <b.icon size={10} strokeWidth={2.5} /> {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="perfil-header__stats">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <span className="stat-item__valor">{s.value}</span>
              <span className="stat-item__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO MÁGICO: Alternar Modo */}
      {usuario?.isProfissional && (
        <div className="perfil-secao-toggle">
          <button onClick={alternarModo} className="btn-alternar-modo">
            <Repeat size={18} strokeWidth={2.5} />
            Alternar para Modo {isProfissional ? "Cliente" : "Profissional"}
          </button>
        </div>
      )}

      {/* CONTEÚDO SCROLLÁVEL */}
      <main className="perfil-conteudo">
        
        {/* Contato Info */}
        <div className="perfil-card">
          <div className="perfil-card__cabecalho perfil-card__cabecalho--destaque">
            <span>Contato</span>
          </div>
          <div className="perfil-card__corpo">
            {[
              { icon: Phone, value: phone, setter: setPhone, id: "phone" },
              { icon: Mail, value: email, setter: setEmail, id: "email" },
              { icon: MapPin, value: city, setter: setCity, id: "city" },
            ].map((item) => (
              <div key={item.id} className="linha-contato">
                <item.icon size={16} className="txt-ciano shrink-0" strokeWidth={2.5} />
                {editMode ? (
                  <input
                    value={item.value}
                    onChange={(e) => item.setter(e.target.value)}
                    className="input-contato-edit"
                  />
                ) : (
                  <span className="texto-contato">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="perfil-card">
            <div className="perfil-card__cabecalho">
              <span>{section.title}</span>
            </div>
            <div className="perfil-card__corpo">
              {section.items.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={item.isToggle ? item.onToggle : undefined}
                  className={`linha-menu ${idx < section.items.length - 1 ? "com-borda" : ""}`}
                >
                  <item.icon size={16} className={item.colorClass} strokeWidth={2.5} />
                  <span className="linha-menu__label">{item.label}</span>
                  
                  {item.isToggle ? (
                    <div className={`toggle-switch ${temaEscuro ? "ativo" : ""}`}>
                      <div className="toggle-bolinha" />
                    </div>
                  ) : (
                    <ChevronRight size={14} className="icone-seta" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <button onClick={logout} className="btn-logout">
          <LogOut size={16} strokeWidth={2.5} />
          <span>Sair da Conta</span>
        </button>

        {/* Version */}
        <p className="perfil-versao">ConectaLar v1.0.0</p>
      </main>
    </div>
  );
}