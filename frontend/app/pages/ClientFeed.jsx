import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Star, ChevronRight, Car, Sun, Moon,
  Clock, Tag, Compass, Home, MapPin, CheckCircle, RotateCcw, RefreshCw,
  // Ícones de categorias
  Zap, Droplets, Sparkles, PaintBucket, Leaf
} from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/ClientFeed.css";

// ----------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------------------------
export function ClientFeed() {
  const navigate = useNavigate();
  const { isDark, toggle } = useDarkMode();
  
  // Estados da interface
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);

  // Dados estáticos de exemplo (somente frontend, sem API)
  const categorias = [
    { id: "eletrica", rotulo: "Elétrica", icone: Zap, cor: "eletrica" },
    { id: "hidraulica", rotulo: "Hidráulica", icone: Droplets, cor: "hidraulica" },
    { id: "limpeza", rotulo: "Limpeza", icone: Sparkles, cor: "limpeza" },
    { id: "pintura", rotulo: "Pintura", icone: PaintBucket, cor: "pintura" },
    { id: "jardim", rotulo: "Jardim", icone: Leaf, cor: "jardim" },
  ];

  const profissionais = [
    {
      id: 1,
      nome: "João Eletricista",
      especialidade: "Elétrica residencial",
      avatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
      role: "Eletricista",
      tipo: "eletrica",
      avaliacaoMedia: "4,8",
      totalAvaliacoes: 32,
      valorBase: "R$ 80,00+",
      distancia: "1,2 km",
      disponivel: true,
    },
    {
      id: 2,
      nome: "Maria Faxina",
      especialidade: "Limpeza pesada",
      avatar: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400",
      role: "Faxina",
      tipo: "limpeza",
      avaliacaoMedia: "4,9",
      totalAvaliacoes: 18,
      valorBase: "R$ 100,00+",
      distancia: "2,4 km",
      disponivel: true,
    },
  ];

  const servicosHistorico = [
    {
      id: 1,
      titulo: "Instalação de tomada",
      profissional: "João Eletricista",
      data: "Ontem · 14:30",
      status: "Concluído",
      valor: "R$ 80,00",
      avaliado: false,
      estrelas: 0,
    },
    {
      id: 2,
      titulo: "Faxina pós-obra",
      profissional: "Maria Faxina",
      data: "Seg · 09:00",
      status: "Concluído",
      valor: "R$ 150,00",
      avaliado: true,
      estrelas: 5,
    },
    {
      id: 3,
      titulo: "Reparo hidráulico",
      profissional: "Carlos Encanador",
      data: "Semana passada",
      status: "Cancelado",
      valor: "R$ 120,00",
      avaliado: false,
      estrelas: 0,
    },
  ];

  const promocoes = [];

  // O usuário logado idealmente viria do seu AuthContext
  const usuarioLogado = { 
    nome: "Usuário", 
    foto: "https://images.unsplash.com/photo-1660700508065-879917d364dd?w=200", 
    notificacoes: 0 
  };

  const ABAS_NAVEGACAO = [
    { id: "inicio", rotulo: "Início", Icone: Home },
    { id: "explorar", rotulo: "Explorar", Icone: Compass },
    { id: "historico", rotulo: "Histórico", Icone: Clock },
    { id: "promocoes", rotulo: "Promoções", Icone: Tag },
  ];

  return (
    <div className={`feed-cliente ${isDark ? "feed-cliente--escuro" : ""}`}>
      
      {/* CABEÇALHO */}
      <header className="feed-cabecalho">
        <div className="feed-cabecalho__topo">
          <div className="feed-cabecalho__saudacao">
            <span className="feed-cabecalho__boas-vindas">Bom dia,</span>
            <h1 className="feed-cabecalho__nome">{usuarioLogado.nome} 👋</h1>
          </div>
          
          <div className="feed-cabecalho__acoes">
            <button onClick={toggle} className="btn-icone btn-icone--tema" aria-label="Alternar tema">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-icone btn-icone--notificacao" aria-label="Notificações">
              <Bell size={20} />
              {usuarioLogado.notificacoes > 0 && (
                <span className="badge-notificacao">{usuarioLogado.notificacoes}</span>
              )}
            </button>
            <div className="feed-cabecalho__perfil">
              <img src={usuarioLogado.foto} alt="Perfil" className="avatar-usuario" />
              <span className="status-online" aria-hidden="true"></span>
            </div>
          </div>
        </div>

        {/* BUSCA */}
        <div className="barra-busca">
          <Search size={18} className="barra-busca__icone" />
          <input
            type="text"
            placeholder="Buscar serviço ou profissional..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="barra-busca__input"
          />
        </div>
      </header>

      {/* ABAS DE NAVEGAÇÃO */}
      <nav className="abas-navegacao" aria-label="Navegação principal">
        {ABAS_NAVEGACAO.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            onClick={() => setAbaAtiva(id)}
            className={`aba-item ${abaAtiva === id ? "aba-item--ativa" : ""}`}
            aria-current={abaAtiva === id ? "page" : undefined}
          >
            <Icone size={14} className="aba-item__icone" />
            {rotulo}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="feed-conteudo">
        
        {/* === ABA: INÍCIO === */}
        {abaAtiva === "inicio" && (
          <section className="secao-inicio">
            
            <button 
              onClick={() => navigate("/conectaride")}
              className="card-ride"
              aria-label="Acessar ConectaRide"
            >
              <div className="card-ride__info">
                <div className="card-ride__tag"><Car size={16} /> NOVO</div>
                <h2 className="card-ride__titulo">ConectaRide</h2>
                <p className="card-ride__subtitulo">Moto-táxi · Táxi · Negociação</p>
              </div>
              <div className="card-ride__acao">
                <span>Chamar</span> <ChevronRight size={16} />
              </div>
            </button>

            {/* Categorias */}
            {categorias && categorias.length > 0 && (
              <section className="bloco-categorias">
                <div className="bloco-categorias__topo">
                  <h2 className="bloco-categorias__titulo">Categorias</h2>
                  <button
                    type="button"
                    onClick={() => setAbaAtiva("explorar")}
                    className="bloco-categorias__ver-todos"
                  >
                    Ver todas
                  </button>
                </div>
                <div className="carrossel-categorias">
                  {categorias.map((cat) => {
                    const Icone = cat.icone;
                    const ativa = categoriaAtiva === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoriaAtiva(ativa ? null : cat.id)}
                        className={`card-categoria card-categoria--${cat.cor} ${ativa ? "card-categoria--ativa" : ""}`}
                      >
                        <span
                          className={`card-categoria__icone card-categoria__icone--${cat.cor} ${ativa ? "card-categoria__icone--ativa" : ""}`}
                        >
                          <Icone size={18} strokeWidth={2} />
                        </span>
                        <span className="card-categoria__rotulo">{cat.rotulo}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
            {/* Serviços Domésticos / Profissionais Recomendados */}
            <section className="bloco-servicos">
              <div className="bloco-servicos__topo">
                <h2 className="bloco-servicos__titulo">Serviços Domésticos</h2>
                <button type="button" className="bloco-servicos__ver-todos">Ver todos</button>
              </div>
              <p className="bloco-servicos__subtitulo">Profissionais recomendados para você</p>

              <div className="carrossel-servicos">
                {profissionais && profissionais.length > 0 ? (
                  profissionais.map((pro) => (
                    <button
                      key={pro.id}
                      type="button"
                      className={`card-servico ${isDark ? "card-servico--escuro" : ""}`}
                    >
                      <div className="card-servico__imagem-wrapper">
                        <img src={pro.avatar} alt={pro.nome} className="card-servico__imagem" />
                        <span className={`card-servico__tag card-servico__tag--${pro.tipo}`}>
                          {pro.role}
                        </span>
                        {pro.disponivel && <span className="card-servico__online" />}
                      </div>
                      <div className="card-servico__conteudo">
                        <p className="card-servico__nome">{pro.nome}</p>
                        <div className="card-servico__avaliacao">
                          <Star size={11} className="card-servico__estrela" />
                          <span className="card-servico__rating">{pro.avaliacaoMedia}</span>
                          <span className="card-servico__reviews">({pro.totalAvaliacoes})</span>
                        </div>
                      </div>
                      <div className="card-servico__detalhes">
                        <span className="card-servico__preco">{pro.valorBase}</span>
                        <div className="card-servico__distancia">
                          <MapPin size={11} />
                          <span>{pro.distancia}</span>
                        </div>
                      </div>
                      <div className="card-servico__cta">Solicitar</div>
                    </button>
                  ))
                ) : (
                  <p className="mensagem-vazio">Nenhum profissional encontrado no momento.</p>
                )}
              </div>
            </section>
          </section>
        )}

        {/* === ABA: HISTÓRICO === */}
        {abaAtiva === "historico" && (
          <section className="secao-historico">
            <div className="secao-historico__topo">
              <h2 className="secao-historico__titulo">Histórico de Serviços</h2>
              <span className="secao-historico__contagem">{servicosHistorico.length} registros</span>
            </div>

            {servicosHistorico && servicosHistorico.length > 0 ? (
              servicosHistorico.map((s, index) => (
                <div key={s.id} className="item-historico">
                  {index < servicosHistorico.length - 1 && (
                    <div className="item-historico__linha" />
                  )}

                  <div
                    className={`item-historico__status ${
                      s.status === "Cancelado"
                        ? "item-historico__status--cancelado"
                        : "item-historico__status--concluido"
                    }`}
                  >
                    {s.status === "Cancelado" ? (
                      <RotateCcw size={14} strokeWidth={2.5} />
                    ) : (
                      <CheckCircle size={14} strokeWidth={2.5} />
                    )}
                  </div>

                  <div className="item-historico__cartao">
                    <div className="item-historico__cabecalho">
                      <p className="item-historico__label">{s.titulo}</p>
                      <span
                        className={`item-historico__badge item-historico__badge--${
                          s.status === "Cancelado" ? "cancelado" : "concluido"
                        }`}
                      >
                        {s.status}
                      </span>
                    </div>
                    <p className="item-historico__meta">
                      com {s.profissional} · {s.data}
                    </p>
                    <p className="item-historico__valor">{s.valor}</p>

                    {s.status !== "Cancelado" && (
                      <div className="item-historico__acoes">
                        {!s.avaliado ? (
                          <button type="button" className="item-historico__btn-avaliar">
                            <Star size={11} strokeWidth={2.5} /> Avaliar
                          </button>
                        ) : (
                          <div className="item-historico__estrelas-wrapper">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={11}
                                className={
                                  i < s.estrelas
                                    ? "item-historico__estrela item-historico__estrela--ativa"
                                    : "item-historico__estrela"
                                }
                              />
                            ))}
                            <span className="item-historico__avaliado-texto">Avaliado</span>
                          </div>
                        )}

                        <button type="button" className="item-historico__btn-repetir">
                          <RefreshCw size={11} strokeWidth={2.5} /> Repetir
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="mensagem-vazio">Você ainda não possui serviços no histórico.</p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}