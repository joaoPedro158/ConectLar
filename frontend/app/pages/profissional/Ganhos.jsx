import React from "react";
import "../../styles/pages/ProfessionalFeed.css";
import { TrendingUp, Wallet, ArrowUpRight, Car, Wrench } from "lucide-react";

export default function Ganhos({ usuario, earning, setEarningsPeriod, earningsPeriod }) {
  return (
    <section className="secao-conteudo">
      <div className="seletor-periodo">
        <button className={`btn-periodo${earningsPeriod === "dia" ? " btn-periodo--ativo bg-ciano txt-preto" : ""}`} onClick={() => setEarningsPeriod("dia")}>Hoje</button>
        <button className={`btn-periodo${earningsPeriod === "semana" ? " btn-periodo--ativo bg-ciano txt-preto" : ""}`} onClick={() => setEarningsPeriod("semana")}>Semana</button>
        <button className={`btn-periodo${earningsPeriod === "mes" ? " btn-periodo--ativo bg-ciano txt-preto" : ""}`} onClick={() => setEarningsPeriod("mes")}>Mês</button>
      </div>
      <div className="card-total-ganhos bg-preto">
        <p className="total-rotulo txt-cinza">Total do período</p>
        <p className="total-valor txt-ciano">{earning.total}</p>
        <div className="tendencia-alta txt-lima">
          <TrendingUp size={14} /> <span>--% vs. período anterior</span>
        </div>
      </div>
      <div className="card-detalhamento">
        <div className="card-detalhamento__header"><span className="txt-branco">Detalhamento</span></div>
        <div className="lista-detalhes">
          {/* Só mostra Corridas para motorista/mototaxi */}
          {usuario?.categoria && ["motorista", "mototaxi"].includes(usuario.categoria.toLowerCase()) && (
            <div className="item-detalhe">
              <div className="icone-caixa bg-ciano"><Car size={15} strokeWidth={2.5} /></div>
              <div className="info-detalhe">
                <p className="titulo-detalhe">Corridas ConectaRide</p>
                <p className="sub-detalhe">{earning.rides} corridas</p>
              </div>
              <p className="valor-detalhe">R$ {earning.corridas}</p>
            </div>
          )}
          <div className="item-detalhe">
            <div className="icone-caixa bg-amarelo"><Wrench size={15} strokeWidth={2.5} /></div>
            <div className="info-detalhe">
              <p className="titulo-detalhe">Serviços Domésticos</p>
              <p className="sub-detalhe">{earning.jobs} serviços</p>
            </div>
            <p className="valor-detalhe">R$ {earning.servicos}</p>
          </div>
        </div>
      </div>
      <button className="btn-sacar bg-amarelo txt-preto">
        <Wallet size={20} strokeWidth={2.5} />Sacar {earning.total} <ArrowUpRight size={18} strokeWidth={3} />
      </button>
    </section>
  );
}
