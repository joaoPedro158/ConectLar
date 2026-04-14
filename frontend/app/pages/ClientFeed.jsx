import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Bell, Star, ChevronRight, Car, Sun, Moon,
  Clock, Tag, Compass, Home, MapPin, CheckCircle, RotateCcw, RefreshCw,
  Zap, Droplets, Sparkles, PaintBucket, Leaf, Heart, Gift, Copy
} from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/ClientFeed.css";

// ----------------------------------------------------------------------
// DADOS MOCKADOS (Somente Frontend)
// ----------------------------------------------------------------------
const categorias = [
  { id: "eletrica", rotulo: "Elétrica", icone: Zap, corHex: "#facc15" },
  { id: "hidraulica", rotulo: "Hidráulica", icone: Droplets, corHex: "#22d3ee" },
  { id: "limpeza", rotulo: "Limpeza", icone: Sparkles, corHex: "#e879f9" },
  { id: "pintura", rotulo: "Pintura", icone: PaintBucket, corHex: "#fb923c" },
  { id: "jardim", rotulo: "Jardim", icone: Leaf, corHex: "#a3e635" },
];

const todasCategorias = [
  { id: "cat1", label: "Serviços Gerais", icon: Sparkles, color: "bg-fuchsia-400", subs: ["Faxina Padrão", "Limpeza Pós-Obra", "Passadeira"] },
  { id: "cat2", label: "Manutenção", icon: Zap, color: "bg-yellow-400", subs: ["Elétrica", "Encanador", "Montagem de Móveis"] },
  { id: "cat3", label: "Reformas", icon: PaintBucket, color: "bg-orange-400", subs: ["Pintura", "Alvenaria", "Gesso"] },
];

const profissionais = [
  {
    id: 1, nome: "João Eletricista", especialidade: "Elétrica",
    avatar: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=400",
    role: "Eletricista", corTag: "#facc15", avaliacaoMedia: "4,8",
    totalAvaliacoes: 32, valorBase: "R$ 80,00+", distancia: "1,2 km", disponivel: true,
  },
  {
    id: 2, nome: "Maria Rita", especialidade: "Limpeza",
    avatar: "https://cdn.pixabay.com/photo/2024/04/05/16/12/ai-generated-8677656_960_720.jpg",
    role: "Faxina", corTag: "#e879f9", avaliacaoMedia: "4,9",
    totalAvaliacoes: 18, valorBase: "R$ 100,00+", distancia: "2,4 km", disponivel: true,
  },
];

const favoritosMock = [
  {
    id: 1, name: "Carlos Encanador", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    role: "Hidráulica", tagColor: "#22d3ee", rating: "5,0", lastHired: "10 Mar", available: true
  }
];

const servicosHistorico = [
  { id: 1, titulo: "Instalação de tomada", profissional: "João Eletricista", data: "Ontem · 14:30", status: "Concluído", valor: "R$ 80,00", avaliado: false, estrelas: 0 },
  { id: 2, titulo: "Faxina pós-obra", profissional: "Maria Rita", data: "Seg · 09:00", status: "Concluído", valor: "R$ 150,00", avaliado: true, estrelas: 5 },
  { id: 3, titulo: "Reparo hidráulico", profissional: "Carlos Encanador", data: "Semana passada", status: "Cancelado", valor: "R$ 120,00", avaliado: false, estrelas: 0 },
];

const cuponsMock = [
  { id: 1, title: "Primeira Limpeza", description: "15% off na sua primeira faxina pelo app", code: "LIMPA15", icon: Sparkles, colorClass: "bg-fuchsia-400" },
  { id: 2, title: "Reparo Rápido", description: "R$ 20 de desconto em serviços elétricos", code: "ELETRO20", icon: Zap, colorClass: "bg-yellow-400" }
];

const usuarioLogado = { 
  nome: "Eduardo", 
  foto: "https://images.unsplash.com/photo-1660700508065-879917d364dd?w=200", 
  notificacoes: 2 
};

const ABAS_NAVEGACAO = [
  { id: "inicio", rotulo: "Início", Icone: Home },
  { id: "explorar", rotulo: "Explorar", Icone: Compass },
  { id: "favoritos", rotulo: "Favoritos", Icone: Heart },
  { id: "historico", rotulo: "Histórico", Icone: Clock },
  { id: "promocoes", rotulo: "Promoções", Icone: Tag },
];

export function ClientFeed() {
  const navigate = useNavigate();
  const { temaEscuro, alternarTema } = useTemaEscuro();
  
  const [abaAtiva, setAbaAtiva] = useState("inicio");
  const [termoBusca, setTermoBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  
  // Estados para as novas abas
  const [expandedCat, setExpandedCat] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className={`feed-cliente ${temaEscuro ? "feed-cliente--escuro" : ""}`}>
      
      {/* CABEÇALHO */}
      <header className="feed-cabecalho">
        <div className="feed-cabecalho__topo">
          <div className="feed-cabecalho__saudacao">
            <span className="feed-cabecalho__boas-vindas">Bom dia,</span>
            <h1 className="feed-cabecalho__nome">{usuarioLogado.nome} 👋</h1>
          </div>
          
          <div className="feed-cabecalho__acoes">
            <button onClick={alternarTema} className="btn-icone btn-icone--tema" aria-label="Alternar tema">
              {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn-icone btn-icone--notificacao" aria-label="Notificações">
              <Bell size={20} />
              {usuarioLogado.notificacoes > 0 && (
                <span className="badge-notificacao">{usuarioLogado.notificacoes}</span>
              )}
            </button>
            <div className="feed-cabecalho__perfil">
              <img src={usuarioLogado.foto} alt="Perfil" className="avatar-usuario" />
              <span className="status-online" aria-hidden="true" />
            </div>
          </div>
        </div>

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

      {/* ABAS NAVEGAÇÃO SUPERIOR */}
      <nav className="abas-navegacao" aria-label="Navegação principal">
        {ABAS_NAVEGACAO.map(({ id, rotulo, Icone }) => (
          <button
            key={id}
            onClick={() => setAbaAtiva(id)}
            className={`aba-item ${abaAtiva === id ? "aba-item--ativa" : ""}`}
          >
            <Icone size={14} className="aba-item__icone" />
            {rotulo}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="feed-conteudo">
        
        {/* =========================================
            ABA: INÍCIO 
        ========================================= */}
        {abaAtiva === "inicio" && (
          <section className="secao-inicio">
            
            {/* Banner ConectaRide */}
            <button onClick={() => navigate("/conectaride")} className="banner-ride">
              <div className="banner-ride__info">
                <div className="banner-ride__tag">
                  <Car size={20} strokeWidth={2.5} /><span>Novo!</span>
                </div>
                <h2 className="banner-ride__titulo">ConectaRide</h2>
                <p className="banner-ride__subtitulo">Moto-táxi · Táxi · Negociação</p>
              </div>
              <div className="banner-ride__acao">
                <span>Chamar</span> <ChevronRight size={16} strokeWidth={3} />
              </div>
            </button>

            {/* Categorias em Carrossel */}
            <section className="bloco-categorias">
              <div className="bloco-cabecalho">
                <h2 className="bloco-titulo">Categorias</h2>
                <button onClick={() => setAbaAtiva("explorar")} className="btn-ver-todas">Ver todas</button>
              </div>
              <div className="carrossel-categorias">
                {categorias.map((cat) => {
                  const Icone = cat.icone;
                  const ativa = categoriaAtiva === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategoriaAtiva(ativa ? null : cat.id)}
                      className={`card-categoria ${ativa ? "card-categoria--ativa" : ""}`}
                      style={{ "--cor-tema": cat.corHex }}
                    >
                      <span className="card-categoria__icone-wrapper">
                        <Icone size={18} strokeWidth={2} className="card-categoria__icone" />
                      </span>
                      <span className="card-categoria__rotulo">{cat.rotulo}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Serviços Domésticos Recomendados */}
            <section className="bloco-profissionais">
              <div className="bloco-cabecalho">
                <h2 className="bloco-titulo">Serviços Domésticos</h2>
                <button className="btn-ver-todas">Ver todos</button>
              </div>
              <p className="bloco-subtitulo">Profissionais recomendados para você</p>
              
              <div className="carrossel-profissionais">
                {profissionais.map((pro) => (
                  <article key={pro.id} className="card-pro-recomendado">
                    <div className="card-pro-recomendado__imagem-wrapper">
                      <img src={pro.avatar} alt={pro.nome} className="card-pro-recomendado__imagem" />
                      <span className="card-pro-recomendado__tag" style={{ backgroundColor: pro.corTag }}>
                        {pro.role}
                      </span>
                      {pro.disponivel && <span className="card-pro-recomendado__online" />}
                    </div>
                    <div className="card-pro-recomendado__dados">
                      <h3 className="card-pro-recomendado__nome">{pro.nome}</h3>
                      <div className="card-pro-recomendado__avaliacao">
                        <Star size={11} className="icone-estrela" />
                        <span className="nota">{pro.avaliacaoMedia}</span>
                        <span className="total">({pro.totalAvaliacoes})</span>
                      </div>
                      <div className="card-pro-recomendado__detalhes">
                        <span className="preco">{pro.valorBase}</span>
                        <div className="distancia"><MapPin size={11} /> {pro.distancia}</div>
                      </div>
                      <button className="btn-solicitar">Solicitar</button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        )}

        {/* =========================================
            ABA: EXPLORAR 
        ========================================= */}
        {abaAtiva === "explorar" && (
          <section className="secao-explorar">
            <div className="bloco-cabecalho">
              <h2 className="bloco-titulo">Todos os Serviços</h2>
              <span className="bloco-subtitulo">{todasCategorias.length} categorias</span>
            </div>
            
            <div className="lista-sanfona">
              {todasCategorias.map((cat) => {
                const Icone = cat.icon;
                const isExpanded = expandedCat === cat.id;
                return (
                  <div key={cat.id} className="card-sanfona">
                    <button
                      onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                      className={`card-sanfona__botao ${isExpanded ? cat.color : ""}`}
                    >
                      <div className={`card-sanfona__icone-box ${isExpanded ? "bg-preto text-branco" : cat.color}`}>
                        <Icone size={16} strokeWidth={2.5} className={isExpanded ? "icone-branco" : "icone-preto"} />
                      </div>
                      <div className="card-sanfona__textos">
                        <p className={`card-sanfona__titulo ${isExpanded ? "texto-preto" : ""}`}>{cat.label}</p>
                        <p className={`card-sanfona__sub ${isExpanded ? "texto-preto-opaco" : ""}`}>
                          {cat.subs.length} sub-serviços
                        </p>
                      </div>
                      <ChevronRight
                        size={16} strokeWidth={2.5}
                        className={`card-sanfona__seta ${isExpanded ? "rotate-90 texto-preto" : ""}`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="card-sanfona__conteudo">
                        {cat.subs.map((sub) => (
                          <button key={sub} className="btn-sub-servico">
                            <span className={`ponto-cor ${cat.color}`} />
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* =========================================
            ABA: FAVORITOS 
        ========================================= */}
        {abaAtiva === "favoritos" && (
          <section className="secao-favoritos">
            <div className="bloco-cabecalho">
              <h2 className="bloco-titulo">Meus Favoritos</h2>
              <span className="bloco-subtitulo">{favoritosMock.length} salvos</span>
            </div>
            
            <div className="lista-favoritos">
              {favoritosMock.map((fav) => (
                <div key={fav.id} className="card-favorito">
                  <div className="card-favorito__topo">
                    <div className="card-favorito__avatar-box">
                      <img src={fav.avatar} alt={fav.name} className="card-favorito__img" />
                      {fav.available && <span className="status-online-fav" />}
                    </div>
                    <div className="card-favorito__info">
                      <div className="linha-titulo">
                        <p className="nome-fav">{fav.name}</p>
                        <span className="badge-especialidade" style={{backgroundColor: fav.tagColor}}>{fav.role}</span>
                      </div>
                      <div className="linha-meta">
                        <Star size={10} className="icone-estrela" />
                        <span className="nota-fav">{fav.rating}</span>
                        <span className="data-fav">· Contratado em {fav.lastHired}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-favorito__acoes">
                    <button className="btn-acao-secundario">Mensagem</button>
                    <button className="btn-acao-primario">Contratar</button>
                    <button className="btn-acao-icone"><Heart size={14} className="icone-coracao" /></button>
                  </div>
                </div>
              ))}
              <button className="btn-descobrir-mais">+ Descobrir mais profissionais</button>
            </div>
          </section>
        )}

        {/* =========================================
            ABA: HISTÓRICO 
        ========================================= */}
        {abaAtiva === "historico" && (
          <section className="secao-historico">
            <div className="bloco-cabecalho">
              <h2 className="bloco-titulo">Histórico de Serviços</h2>
              <span className="bloco-subtitulo">{servicosHistorico.length} registros</span>
            </div>

            <div className="lista-historico">
              {servicosHistorico.map((s, index) => (
                <div key={s.id} className="historico-timeline">
                  {index < servicosHistorico.length - 1 && <div className="historico-timeline__linha" />}
                  <div className={`historico-timeline__icone ${s.status === "Cancelado" ? "erro" : "sucesso"}`}>
                    {s.status === "Cancelado" ? <RotateCcw size={14} strokeWidth={2.5} /> : <CheckCircle size={14} strokeWidth={2.5} />}
                  </div>
                  <div className="card-historico">
                    <div className="card-historico__topo">
                      <p className="card-historico__titulo">{s.titulo}</p>
                      <span className={`badge-status ${s.status === "Cancelado" ? "erro" : "sucesso"}`}>{s.status}</span>
                    </div>
                    <p className="card-historico__meta">com {s.profissional} · {s.data}</p>
                    <p className="card-historico__valor">{s.valor}</p>

                    {s.status !== "Cancelado" && (
                      <div className="card-historico__acoes">
                        {!s.avaliado ? (
                          <button className="btn-avaliar"><Star size={11} strokeWidth={2.5} /> Avaliar</button>
                        ) : (
                          <div className="estrelas-avaliadas">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className={i < s.estrelas ? "icone-estrela" : "icone-estrela--inativa"} />
                            ))}
                            <span>Avaliado</span>
                          </div>
                        )}
                        <button className="btn-repetir"><RefreshCw size={11} strokeWidth={2.5} /> Repetir</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================
            ABA: PROMOÇÕES 
        ========================================= */}
        {abaAtiva === "promocoes" && (
          <section className="secao-promocoes">
            
            {/* Banner Ofertas */}
            <div className="banner-ofertas">
              <div className="banner-ofertas__tag">
                <Gift size={18} className="icone-amarelo" strokeWidth={2.5} />
                <span>Ofertas Especiais</span>
              </div>
              <p className="banner-ofertas__titulo">Economize em cada serviço contratado!</p>
              <p className="banner-ofertas__sub">Cupons e promoções exclusivos para você</p>
            </div>

            <h2 className="bloco-titulo mb-2">Cupons Disponíveis</h2>
            
            {/* Lista de Cupons */}
            <div className="lista-cupons">
              {cuponsMock.map((p) => {
                const Icone = p.icon;
                const isCopied = copiedCode === p.code;
                return (
                  <div key={p.id} className="card-cupom">
                    <div className={`card-cupom__cabecalho ${p.colorClass}`}>
                      <div className="card-cupom__icone"><Icone size={16} strokeWidth={2.5} /></div>
                      <div>
                        <p className="card-cupom__titulo">{p.title}</p>
                        <p className="card-cupom__desc">{p.description}</p>
                      </div>
                    </div>
                    <div className="card-cupom__corpo">
                      <div className="codigo-box">
                        <span>Código do cupom</span>
                        <p>{p.code}</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(p.code)}
                        className={`btn-copiar ${isCopied ? "copiado" : ""}`}
                      >
                        {isCopied ? <CheckCircle size={13} strokeWidth={2.5}/> : <Copy size={13} strokeWidth={2.5}/>}
                        {isCopied ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Card Indicação */}
            <div className="card-indicacao">
              <div className="card-indicacao__topo">
                <div className="card-indicacao__icone"><Gift size={16} strokeWidth={2.5} /></div>
                <div>
                  <p className="card-indicacao__titulo">Programa Indica Aí</p>
                  <p className="card-indicacao__sub">Ganhe R$ 15 por indicação</p>
                </div>
              </div>
              <div className="card-indicacao__link-box">
                <div>
                  <span>Seu link único</span>
                  <p>conectalar.app/ref/EDU15</p>
                </div>
                <button className="btn-link-copy"><Copy size={13} strokeWidth={2.5}/></button>
              </div>
              <div className="card-indicacao__stats">
                <div className="stat-box"><p className="valor">3</p><p className="rotulo">Indicados</p></div>
                <div className="stat-box"><p className="valor">1</p><p className="rotulo">Pendentes</p></div>
                <div className="stat-box"><p className="valor">R$ 30</p><p className="rotulo">Ganhos</p></div>
              </div>
            </div>
          </section>
        )}

      </main>
    </div>
  );
}