import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, MapPin, Star, CheckCircle, XCircle, 
  Clock, Wrench, ShieldCheck, MessageCircle 
} from "lucide-react";
import { useTemaEscuro } from "../../context/ContextoTemaEscuro.jsx";
import "../../styles/pages/GerenciarProposta.css";

// MOCK DATA: Detalhes do serviço que o cliente pediu
const propostaAtual = {
  id: 101,
  titulo: "Conserto de Vazamento na Pia",
  categoria: "Hidráulica",
  dataPublicacao: "Hoje, 09:30",
  valorProposto: "R$ 150,00",
  status: "Em Espera",
  descricao: "O cano debaixo da pia da cozinha estourou e está vazando muita água. Preciso de alguém para trocar o sifão e vedar."
};

// MOCK DATA: Profissionais que se candidataram para este serviço
const candidatosMock = [
  {
    id: 1,
    nome: "Carlos Encanador",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    nota: "4.9",
    avaliacoes: 124,
    distancia: "1.2 km",
    selo: "Verificado",
    mensagem: "Olá! Tenho a peça no meu carro, posso chegar em 20 minutos."
  },
  {
    id: 2,
    nome: "Roberto Manutenção",
    avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200",
    nota: "4.7",
    avaliacoes: 89,
    distancia: "3.5 km",
    selo: null,
    mensagem: "Posso fazer o serviço hoje à tarde. Dou garantia de 3 meses."
  }
];

export default function GerenciarProposta() {
  const navigate = useNavigate();
  const { temaEscuro } = useTemaEscuro();
  
  const [candidatos, setCandidatos] = useState(candidatosMock);

  const aceitarProfissional = (nome) => {
    alert(`Você aceitou ${nome}! O serviço agora está EM ANDAMENTO.`);
    // Aqui iria a lógica de API para mudar o status da proposta
    navigate("/");
  };

  const recusarProfissional = (id) => {
    // Remove o candidato da lista visualmente
    setCandidatos(candidatos.filter(c => c.id !== id));
  };

  return (
    <div className={`gerenciar-proposta ${temaEscuro ? "gerenciar-proposta--escuro" : ""}`}>
      {/* CABEÇALHO */}
      <header className="gerenciar-header">
        <button onClick={() => navigate(-1)} className="btn-voltar">
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div>
          <h1 className="gerenciar-header__titulo">Candidatos</h1>
          <p className="gerenciar-header__sub">Escolha o profissional ideal</p>
        </div>
      </header>

      <main className="gerenciar-main">
        {/* RESUMO DA PROPOSTA DO CLIENTE */}
        <div className="card-resumo-proposta">
          <div className="card-resumo-proposta__topo">
            <span className="tag-categoria bg-ciano">{propostaAtual.categoria}</span>
            <span className="tag-status bg-amarelo">{propostaAtual.status}</span>
          </div>
          <h2 className="titulo-proposta">{propostaAtual.titulo}</h2>
          <p className="desc-proposta">{propostaAtual.descricao}</p>
          <div className="rodape-proposta">
            <div className="meta-info">
              <Clock size={14} /> {propostaAtual.dataPublicacao}
            </div>
            <p className="valor-proposta">{propostaAtual.valorProposto}</p>
          </div>
        </div>

        {/* LISTA DE CANDIDATOS */}
        <div className="secao-candidatos">
          <h3 className="titulo-secao">
            {candidatos.length} {candidatos.length === 1 ? "Candidato" : "Candidatos"} encontrados
          </h3>

          {candidatos.length === 0 ? (
            <div className="estado-vazio">
              <Wrench size={40} className="txt-opaco" />
              <p>Nenhum candidato restante.</p>
              <button onClick={() => navigate("/")} className="btn-voltar-feed">Voltar ao Início</button>
            </div>
          ) : (
            <div className="lista-candidatos">
              {candidatos.map((cand) => (
                <div key={cand.id} className="card-candidato">
                  <div className="card-candidato__perfil">
                    <img src={cand.avatar} alt={cand.nome} className="avatar-candidato" />
                    <div className="info-candidato">
                      <div className="linha-nome">
                        <h4>{cand.nome}</h4>
                        {cand.selo && (
                          <span className="selo-verificado" title="Profissional Verificado">
                            <ShieldCheck size={12} />
                          </span>
                        )}
                      </div>
                      <div className="linha-meta">
                        <span className="nota">
                          <Star size={12} className="icone-estrela" /> {cand.nota}
                        </span>
                        <span className="separador">•</span>
                        <span className="distancia">
                          <MapPin size={12} /> {cand.distancia}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mensagem do Profissional */}
                  <div className="mensagem-candidato">
                    <MessageCircle size={14} className="icone-msg" />
                    <p>"{cand.mensagem}"</p>
                  </div>

                  {/* Botões de Ação Neo-Brutalistas */}
                  <div className="botoes-decisao">
                    <button 
                      onClick={() => recusarProfissional(cand.id)} 
                      className="btn-decisao btn-decisao--recusar"
                    >
                      <XCircle size={18} strokeWidth={2.5} /> Recusar
                    </button>
                    <button 
                      onClick={() => aceitarProfissional(cand.nome)} 
                      className="btn-decisao btn-decisao--aceitar"
                    >
                      <CheckCircle size={18} strokeWidth={2.5} /> Aceitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}