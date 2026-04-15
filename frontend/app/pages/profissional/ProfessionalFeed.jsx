import React, { useState, useEffect } from "react";
import {
    Bell, Star, MapPin, Clock, Bike, Car, Package, DollarSign,
    CheckCircle, MessageCircle, ChevronRight, Wrench, Zap, Sun, Moon,
    CalendarDays, TrendingUp, History, ArrowUpRight, Wallet, BarChart2,
    Sparkles // <-- Só faltava este carinha aqui!
} from "lucide-react";
import { useTemaEscuro } from "../../context/ContextoTemaEscuro.jsx";
import { useAuth } from "../../context/ContextoAutenticacao.jsx";
import "../../styles/pages/ProfessionalFeed.css";

function getAbas(usuario) {
    const abas = [
        { id: "servicos", rotulo: "Início", icone: Wrench },
        { id: "ganhos", rotulo: "Ganhos", icone: TrendingUp },
        { id: "agenda", rotulo: "Agenda", icone: CalendarDays },
        { id: "historico", rotulo: "Histórico", icone: History },
    ];
    if (usuario?.categoria && ["motorista", "mototaxi"].includes(usuario.categoria.toLowerCase())) {
        abas.splice(2, 0, { id: "corridas", rotulo: "Corridas", icone: Car });
    }
    return abas;
}

const configuracaoStatus = {
  new: { label: "Nova Corrida", borderClass: "borda-ciano", tagClass: "tag-ciano" },
  negotiating: { label: "Em Negociação", borderClass: "borda-amarelo", tagClass: "tag-amarelo" },
  accepted: { label: "Aceita", borderClass: "borda-lima", tagClass: "tag-lima" },
  waiting: { label: "Com Espera", borderClass: "borda-laranja", tagClass: "tag-laranja" },
};

const serviceIcons = { eletrica: Zap, hidraulica: Package, reparos: Wrench, limpeza: Sparkles };
const serviceIconColors = { eletrica: "bg-amarelo", hidraulica: "bg-ciano", reparos: "bg-laranja", limpeza: "bg-fucsia" };

export function ProfessionalFeed() {
    const { temaEscuro, alternarTema } = useTemaEscuro();
    const { usuario } = useAuth();

    // Sempre começa na aba 'servicos' (Início)
    const [abaAtiva, setAbaAtiva] = useState("servicos");

    // Garante que ao logar ou reload, a aba 'servicos' seja selecionada
    useEffect(() => {
        setAbaAtiva("servicos");
    }, [usuario]);
  const [earningsPeriod, setEarningsPeriod] = useState("semana");
  const [isOnline, setIsOnline] = useState(false); // Uber-style toggle

  // TODO: Replace with real state management/fetching
  const [rides, setRides] = useState([]);
  const [serviceProposals, setServiceProposals] = useState([]);
  const [agendaItems, setAgendaItems] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [earning, setEarning] = useState({ total: "R$ 0,00", corridas: "R$ 0", servicos: "R$ 0", rides: 0, jobs: 0 });

  const handleAcceptRide = (id) => {
      // API Call to accept ride
      console.log("Ride Accepted", id);
  };

  const handleCounterOffer = (id, value) => {
       // API Call to send counter offer
       console.log("Counter Offer Sent", id, value);
  };

  return (
    <div className={`feed-pro ${temaEscuro ? "feed-pro--escuro" : ""}`}>
      {/* CABEÇALHO */}
      <header className="feed-pro-header">
        <div className="feed-pro-header__topo">
          <div className="perfil-resumo">
            <div className="perfil-resumo__avatar-wrapper">
              <img src={usuario?.foto || "https://images.unsplash.com/photo-1636491628091-0a0dd357f46b?w=200"} alt="Avatar" className="perfil-resumo__avatar" />
              <span className={`perfil-resumo__status ${isOnline ? "bg-lima" : "bg-cinza"}`} />
            </div>
            <div className="perfil-resumo__info">
              <p className="perfil-resumo__modo">Modo Profissional</p>
              <p className="perfil-resumo__nome">{usuario?.nome || "Motorista"}</p>
                            {usuario?.categoria && (
                                <span style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: '#fff',
                                    background: '#22d3ee',
                                    borderRadius: 8,
                                    padding: '2px 10px',
                                    alignSelf: 'flex-start',
                                    margin: '2px 0 2px 0',
                                    letterSpacing: 0.2,
                                    boxShadow: '0 1px 4px #22d3ee33',
                                }}>
                                    {usuario.categoria.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            )}
                                                        <div className="perfil-resumo__nota">
                                                                <Star size={11} className="icone-estrela" />
                                                                <span>
                                                                    <span className="txt-amarelo">--</span>
                                                                    {/* Só mostra corridas para motorista/mototaxi */}
                                                                    {usuario?.categoria && ["motorista", "mototaxi"].includes(usuario.categoria.toLowerCase()) && (
                                                                        <> · -- corridas</>
                                                                    )}
                                                                </span>
                                                        </div>
            </div>
          </div>
          <div className="feed-pro-header__acoes">
             <button onClick={() => setIsOnline(!isOnline)} className={`btn-status-toggle ${isOnline ? "online" : "offline"}`}>
                <div className="bolinha" />
                {isOnline ? "Online" : "Offline"}
            </button>
            <button onClick={alternarTema} className="btn-circulo">
              {temaEscuro ? <Sun size={18} strokeWidth={2.5}/> : <Moon size={18} strokeWidth={2.5}/>}
            </button>
            <button className="btn-circulo btn-circulo--notificacao">
              <Bell size={20} strokeWidth={2.5}/>
              {/* <span className="badge-contagem">0</span> */}
            </button>
          </div>
        </div>

                <div className="grade-estatisticas">
                    {[
                        { label: "Hoje", value: "R$ --" },
                        // Só mostra Corridas se for motorista/mototaxi
                        ...(usuario?.categoria && ["motorista", "mototaxi"].includes(usuario.categoria.toLowerCase())
                            ? [{ label: "Corridas", value: "--" }]
                            : []),
                        { label: "Avaliação", value: "-- ★" },
                        { label: "Pendentes", value: "--" }
                    ].map((stat) => (
                        <div key={stat.label} className="estatistica-item">
                            <p className="estatistica-item__valor txt-ciano">{stat.value}</p>
                            <p className="estatistica-item__rotulo">{stat.label}</p>
                        </div>
                    ))}
                </div>
      </header>

      {/* BARRA DE ABAS */}
            <nav className="barra-abas">
                {getAbas(usuario).map((tab) => {
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

        {!isOnline && abaAtiva !== "inicio" && abaAtiva !== "historico" && abaAtiva !== "ganhos" ? (
             <div className="estado-vazio">
                <Zap size={40} className="txt-opaco mb-2" />
                <p>Fique Online para receber solicitações na sua área.</p>
             </div>
        ) : (
            <>
                {/* === ABA: GANHOS (INÍCIO) === */}
                                {abaAtiva === "ganhos" && (
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
                                )}

                {/* === ABA: CORRIDAS (UBER STYLE) === */}
                {abaAtiva === "corridas" && usuario?.categoria && ["motorista", "mototaxi"].includes(usuario.categoria.toLowerCase()) && (
                <section className="secao-conteudo">
                    <div className="titulo-bloco">
                        <h2>Corridas no Radar</h2>
                        {rides.length > 0 && <span className="ponto-pulsante" />}
                    </div>

                    {rides.length === 0 ? (
                        <div className="estado-vazio">
                            <Car size={40} className="txt-opaco mb-2" />
                            <p>Buscando corridas na sua área...</p>
                        </div>
                    ) : (
                    <div className="lista-cards">
                    {rides.map((ride) => {
                        const status = configuracaoStatus[ride.status];
                        const VehicleIcon = ride.type === "mototaxi" ? Bike : Car;

                        return (
                        <div key={ride.id} className={`card-pro ${status.borderClass}`}>
                            <div className="card-pro__topo-corrida">
                            <div className="passageiro-info">
                                <div className="icone-veiculo"><VehicleIcon size={14} strokeWidth={2.5} /></div>
                                <span className="nome-pass">{ride.passengerName}</span>
                            </div>
                            <div className="status-grupo">
                                <span className={`badge-status ${status.tagClass}`}>{status.label}</span>
                                <span className="tempo-status">{ride.time}</span>
                            </div>
                            </div>

                            <div className="rota-corrida">
                            <div className="linha-rota">
                                <div className="ponto-rota bg-lima" />
                                <p>{ride.origin}</p>
                            </div>
                            <div className="linha-conector" />
                            <div className="linha-rota">
                                <div className="ponto-rota bg-fucsia" />
                                <p>{ride.destination}</p>
                            </div>
                            </div>

                            <div className="meta-corrida">
                            <span className="badge-meta"><MapPin size={9} />{ride.distance}</span>
                            {ride.waitMinutes && <span className="badge-meta bg-laranja-claro txt-laranja"><Clock size={9}/>Espera {ride.waitMinutes}min</span>}
                            {ride.withPackage && <span className="badge-meta bg-lima-claro txt-lima-escuro"><Package size={9}/>Com encomenda</span>}
                            {ride.tarifa00 && <span className="badge-meta bg-amarelo-claro txt-amarelo-escuro"><Zap size={9}/>Tarifa 00</span>}
                            </div>

                            <div className="card-pro__rodape">
                            {ride.status === "negotiating" ? (
                                <div className="caixa-negociacao">
                                <div className="valores-negociacao">
                                    <div>
                                    <p className="rotulo-menor">Passageiro oferece</p>
                                    <p className="valor-maior txt-preto">R$ {ride.offeredValue?.toFixed(2)}</p>
                                    </div>
                                    <div className="texto-direita">
                                    <p className="rotulo-menor">Sugestão do app</p>
                                    <p className="valor-medio txt-cinza">R$ {ride.suggestedValue?.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="botoes-negociacao">
                                    <button onClick={() => handleAcceptRide(ride.id)} className="btn-aceitar-negociacao bg-lima">
                                    Aceitar R$ {ride.offeredValue?.toFixed(2)}
                                    </button>
                                    <div className="input-contraproposta">
                                    <span>R$</span>
                                    <input 
                                        type="number" 
                                        placeholder={`${ride.suggestedValue}`} 
                                        onChange={(e) => handleCounterOffer(ride.id, e.target.value)} 
                                    />
                                    <button onClick={() => handleCounterOffer(ride.id, "valor")}>OK</button>
                                    </div>
                                </div>
                                </div>
                            ) : (
                                <div className="caixa-fixo">
                                <div>
                                    <p className="rotulo-menor">Valor fixo</p>
                                    <p className="valor-maior">R$ {ride.offeredValue?.toFixed(2)}</p>
                                </div>
                                <div className="botoes-acao">
                                    <button className="btn-icone-acao bg-branco"><MessageCircle size={16} strokeWidth={2.5}/></button>
                                    <button onClick={() => handleAcceptRide(ride.id)} className="btn-aceitar-acao bg-ciano"><CheckCircle size={15} strokeWidth={3}/>Aceitar</button>
                                </div>
                                </div>
                            )}
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    )}
                </section>
                )}

                {/* === ABA: SERVIÇOS (WORKANA STYLE) === */}
                {abaAtiva === "servicos" && (
                <section className="secao-conteudo">
                    <div className="titulo-bloco">
                        <h2>Mural de Projetos</h2>
                    </div>

                    {serviceProposals.length === 0 ? (
                         <div className="estado-vazio">
                            <Wrench size={40} className="txt-opaco mb-2" />
                            <p>Nenhum serviço postado na sua região.</p>
                        </div>
                    ) : (
                    <div className="lista-cards">
                    {serviceProposals.map((proposal) => {
                        const Icon = serviceIcons[proposal.iconType] || Wrench;
                        const iconColor = serviceIconColors[proposal.iconType] || "bg-cinza";
                        const isNew = proposal.status === "new";

                        return (
                        <div key={proposal.id} className={`card-pro ${isNew ? "borda-ciano" : "borda-amarelo"}`}>
                            <div className="card-pro__topo-servico">
                            <div className={`icone-caixa ${iconColor}`}><Icon size={18} strokeWidth={2.5} /></div>
                            <div className="info-servico">
                                <div className="linha-titulo">
                                <p className="titulo-servico">{proposal.service}</p>
                                <span className={`badge-status ${isNew ? "tag-ciano" : "tag-amarelo"}`}>{isNew ? "Aberto" : "Aguardando"}</span>
                                </div>
                                <p className="desc-servico">{proposal.description}</p>
                            </div>
                            </div>
                            
                            <div className="card-pro__meio-servico">
                            <div className="meta-servico">
                                <span><MapPin size={11} />{proposal.address}</span>
                                <span><Clock size={11} />{proposal.time}</span>
                            </div>
                            <div className="rodape-servico">
                                <div>
                                <p className="cliente-servico">Orçamento Sugerido</p>
                                <p className="valor-servico">{proposal.budget}</p>
                                </div>
                                <button className="btn-ver-proposta bg-preto txt-branco">Candidatar-se<ChevronRight size={13} strokeWidth={3} /></button>
                            </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    )}
                </section>
                )}

                {/* === ABA: AGENDA === */}
                {abaAtiva === "agenda" && (
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
                )}

                {/* === ABA: HISTÓRICO === */}
                {abaAtiva === "historico" && (
                <section className="secao-conteudo">
                    <div className="linha-titulo-secao">
                    <h2>Histórico Completo</h2>
                    </div>

                    <div className="filtros-historico">
                    {["Todos", "Corridas", "Serviços"].map((f) => (
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
                )}
            </>
        )}
      </main>
    </div>
  );
}