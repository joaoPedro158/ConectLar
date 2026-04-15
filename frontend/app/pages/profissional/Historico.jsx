import React from "react";
import "../../styles/pages/ProfessionalFeed.css";
import { History } from "lucide-react";
export default function Historico({ historyItems }) {
  return (
    <section className="secao-conteudo">
      <div className="linha-titulo-secao">
        <h2>Histórico Completo</h2>
      </div>
      <div className="filtros-historico">
        {["Todos", "Corridas", "Histórico"].map((f) => (
          <button key={f} className={`badge-filtro ${f === "Todos" ? "bg-preto txt-branco" : ""}`}>{f}</button>
        ))}
      </div>
      {historyItems.length === 0 ? (
        <div className="estado-vazio">
          <History size={40} className="txt-opaco mb-2" />
          <p>Nenhum histórico registrado.</p>
        </div>
      ) : (
        <div className="lista-cards">
          {historyItems.map((item) => (
            <div key={item.id} className="card-historico">
              <div className={`icone-caixa ${item.color}`}><item.icon size={15} strokeWidth={2.5} /></div>
              <div className="info-historico">
                <p className="titulo-hist">{item.label}</p>
                <p className="sub-hist">{item.sub}</p>
                <p className="data-hist">{item.date}</p>
              </div>
              <div className="valores-historico">
                <p className="valor-hist txt-ciano">{item.value}</p>
                <span className="badge-pago bg-lima-claro txt-lima-escuro">Pago</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
