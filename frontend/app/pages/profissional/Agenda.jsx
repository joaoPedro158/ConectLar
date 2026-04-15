import React from "react";
import "../../styles/pages/ProfessionalFeed.css";
import { CalendarDays, MapPin } from "lucide-react";

export default function Agenda({ agendaItems }) {
  return (
    <section className="secao-conteudo">
      <div className="linha-titulo-secao">
        <h2>Próximos Trabalhos</h2>
      </div>
      {agendaItems.length === 0 ? (
        <div className="estado-vazio">
          <CalendarDays size={40} className="txt-opaco mb-2" />
          <p>Sua agenda está livre.</p>
        </div>
      ) : (
        ["Hoje", "Amanhã", "Sáb, 19 Abr"].map((day) => {
          const items = agendaItems.filter((a) => a.date === day);
          if (!items.length) return null;
          return (
            <div key={day} className="bloco-dia">
              <div className="divisor-dia">
                <span className="txt-ciano">{day}</span>
                <div className="linha-horizontal" />
              </div>
              <div className="lista-compromissos">
                {items.map((item) => (
                  <div key={item.id} className="card-agenda">
                    <div className={`faixa-lateral ${item.color}`}>
                      <span className="hora">{item.time}</span>
                      <span className="dia-rotulo">hoje</span>
                    </div>
                    <div className="conteudo-agenda">
                      <p className="cliente-agenda">{item.client}</p>
                      <p className="servico-agenda">{item.service}</p>
                      <div className="rodape-agenda">
                        <span><MapPin size={9} />{item.address}</span>
                        <span className="valor-agenda txt-ciano">{item.value}</span>
                      </div>
                    </div>
                    <div className="status-agenda">
                      <span className={`badge-status ${item.status === "confirmed" ? "tag-lima" : "tag-amarelo"}`}>
                        {item.status === "confirmed" ? "Confirmado" : "Pendente"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
      <button className="btn-adicionar-agenda"><CalendarDays size={14} strokeWidth={2} />+ Adicionar compromisso manual</button>
    </section>
  );
}
