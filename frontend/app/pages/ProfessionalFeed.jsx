import React, { useState } from "react";
import {
  Bell, Star, MapPin, Clock, Bike, Car, Package, DollarSign,
  CheckCircle, MessageCircle, ChevronRight, Wrench, Zap, Sun, Moon,
  CalendarDays, TrendingUp, History, ArrowUpRight, Wallet, BarChart2
} from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/ProfessionalFeed.css";

const ABAS = [
  { id: "corridas", rotulo: "Corridas", icone: Car },
  { id: "servicos", rotulo: "Serviços", icone: Wrench },
  { id: "agenda", rotulo: "Agenda", icone: CalendarDays },
  { id: "ganhos", rotulo: "Ganhos", icone: TrendingUp },
  { id: "historico", rotulo: "Histórico", icone: History },
];

const configuracaoStatus = {
  novo: { rotulo: "Nova Corrida", classe: "status--novo" },
  negociando: { rotulo: "Em Negociação", classe: "status--negociando" },
  aceito: { rotulo: "Aceita", classe: "status--aceito" },
  espera: { rotulo: "Com Espera", classe: "status--espera" },
};

export function ProfessionalFeed() {
  const { temaEscuro, alternarTema } = useTemaEscuro();
  const [abaAtiva, setAbaAtiva] = useState("corridas");
  const [periodoGanhos, setPeriodoGanhos] = useState("semana");
  const [idsRespondidos, setIdsRespondidos] = useState(new Set());

  const aceitarCorrida = (id) => setIdsRespondidos((ant) => new Set([...ant, id]));

  return (
    <div className={`feed-pro ${temaEscuro ? "feed-pro--escuro" : ""}`}>
      {/* CABEÇALHO */}
      <header className="feed-pro-header">
        <div className="feed-pro-header__topo">
          <div className="perfil-resumo">
            <div className="perfil-resumo__avatar-wrapper">
              <img src="https://images.unsplash.com/photo-1636491628091-0a0dd357f46b?w=200" alt="João" className="perfil-resumo__avatar" />
              <span className="perfil-resumo__status" />
            </div>
            <div className="perfil-resumo__info">
              <p className="perfil-resumo__modo">Modo Profissional</p>
              <p className="perfil-resumo__nome">João Motorista</p>
              <div className="perfil-resumo__nota">
                <Star size={11} className="icone-estrela" />
                <span>4,8 · 342 corridas</span>
              </div>
            </div>
          </div>
          <div className="feed-pro-header__acoes">
            <button onClick={alternarTema} className="btn-circulo">
              {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-circulo btn-circulo--notificacao">
              <Bell size={20} />
              <span className="badge-contagem">4</span>
            </button>
          </div>
        </div>

        <div className="grade-estatisticas">
          <div className="estatistica-item">
            <p className="estatistica-item__valor">--</p>
            <p className="estatistica-item__rotulo">Hoje</p>
          </div>
          <div className="estatistica-item">
            <p className="estatistica-item__valor">--</p>
            <p className="estatistica-item__rotulo">Corridas</p>
          </div>
          <div className="estatistica-item">
            <p className="estatistica-item__valor">--</p>
            <p className="estatistica-item__rotulo">Avaliação</p>
          </div>
          <div className="estatistica-item">
            <p className="estatistica-item__valor">--</p>
            <p className="estatistica-item__rotulo">Pendentes</p>
          </div>
        </div>
      </header>

      {/* BARRA DE ABAS */}
      <nav className="barra-abas">
        {ABAS.map((tab) => {
          const Icone = tab.icone;
          return (
            <button
              key={tab.id}
              onClick={() => setAbaAtiva(tab.id)}
              className={`aba-btn ${abaAtiva === tab.id ? "aba-btn--ativa" : ""}`}
            >
              <Icone size={13} strokeWidth={2.5} />
              {tab.rotulo}
            </button>
          );
        })}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="feed-pro-conteudo">
        {abaAtiva === "corridas" && (
          <section className="secao-solicitacoes">
            <p className="secao-titulo">Solicitações Abertas</p>
            <div className="lista-cards">
              <p className="mensagem-vazio">Nenhuma solicitação aberta no momento.</p>
            </div>
          </section>
        )}

        {abaAtiva === "ganhos" && (
          <section className="secao-ganhos">
            <div className="seletor-periodo">
              {["dia", "semana", "mes"].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPeriodoGanhos(p)}
                  className={`btn-periodo ${periodoGanhos === p ? "btn-periodo--ativo" : ""}`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="card-total-ganhos">
              <p className="total-rotulo">Total do período</p>
              <p className="total-valor">R$ 0,00</p>
              <div className="tendencia-alta">
                <TrendingUp size={14} /> <span>Aguardando dados de ganhos</span>
              </div>
            </div>

            <button className="btn-sacar">
              <Wallet size={20} /> Sacar Saldo <ArrowUpRight size={18} />
            </button>
          </section>
        )}
      </main>
    </div>
  );
}