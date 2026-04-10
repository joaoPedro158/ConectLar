import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, History, Star, Search } from 'lucide-react';
import { bancoDeDados, ID_DO_BANCO, ID_COLECAO_PROPOSTAS, conta, ID_COLECAO_USUARIOS } from '../services/appwrite';
import ModalCriarProposta from '../components/ModalCriarProposta';
import CardProposta from '../components/CardProposta';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import BarraNavegacao from '../components/BarraNavegacao';
import HeaderPerfil from '../components/HeaderPerfil';
import IndicadorCarregamento from '../components/IndicadorCarregamento';
import PullToRefresh from 'react-simple-pull-to-refresh';
import '../styles/pages/TelaFeedCliente.css';

const TelaFeedCliente = () => {
  const [propostas, definirPropostas] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [usuarioAtual, definirUsuarioAtual] = useState(null);
  const [perfilUsuario, definirPerfilUsuario] = useState(null);
  const [modalAberto, definirModalAberto] = useState(false);
  const [profissionaisDestaque, definirProfissionaisDestaque] = useState([]);
  const [carregandoDestaque, definirCarregandoDestaque] = useState(false);
  const navegar = useNavigate();

  const audioNotificacaoRef = useRef(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (usuarioAtual) {
      carregarPropostas();
    }
  }, [usuarioAtual]);

  useEffect(() => {
    audioNotificacaoRef.current = new Audio('/ringtone/NOTIFICACAO.mp3');
    audioNotificacaoRef.current.preload = 'auto';
    audioNotificacaoRef.current.loop = true;
    return () => {
      if (audioNotificacaoRef.current) {
        audioNotificacaoRef.current.pause();
        audioNotificacaoRef.current.currentTime = 0;
      }
    };
  }, []);

  const carregarUsuario = async () => {
    try {
      const usuario = await conta.get();
      definirUsuarioAtual(usuario);
      const perfil = await bancoDeDados.getDocument(ID_DO_BANCO, ID_COLECAO_USUARIOS, usuario.$id);
      if (perfil.tipoPerfil !== 'USUARIO') {
        navegar('/feed-profissional');
        return;
      }
      definirPerfilUsuario(perfil);
      carregarProfissionaisDestaque();
    } catch (erro) {
      navegar('/login');
    }
  };

  const carregarProfissionaisDestaque = async () => {
    try {
      definirCarregandoDestaque(true);
      const resposta = await bancoDeDados.listDocuments(
        ID_DO_BANCO,
        ID_COLECAO_USUARIOS,
        [
          Query.equal('tipoPerfil', 'PROFISSIONAL'),
          Query.orderDesc('mediaAvaliacoes'),
          Query.limit(10)
        ]
      );
      definirProfissionaisDestaque(resposta.documents || []);
    } catch (erro) {
      definirProfissionaisDestaque([]);
    } finally {
      definirCarregandoDestaque(false);
    }
  };

  const carregarPropostas = async ({ mostrarLoading = true } = {}) => {
    try {
      if (mostrarLoading) definirCarregando(true);
      const consultas = [
        Query.orderDesc('$createdAt'),
        Query.equal('clienteId', usuarioAtual.$id)
      ];
      const resposta = await bancoDeDados.listDocuments(ID_DO_BANCO, ID_COLECAO_PROPOSTAS, consultas);
      const filtrados = resposta.documents.filter(p => p.status !== 'CONCLUIDO' && p.status !== 'CANCELADO');
      definirPropostas(filtrados);

      // Toca áudio se houver propostas abertas
      if (audioNotificacaoRef.current && filtrados.length > 0) {
        audioNotificacaoRef.current.currentTime = 0;
        audioNotificacaoRef.current.loop = true;
        audioNotificacaoRef.current.play().catch(() => {});
      }
      // Para áudio se não houver propostas
      if (audioNotificacaoRef.current && filtrados.length === 0) {
        audioNotificacaoRef.current.pause();
        audioNotificacaoRef.current.currentTime = 0;
      }
    } catch (erro) {
      console.error(erro);
    } finally {
      if (mostrarLoading) definirCarregando(false);
    }
  };

  const lidarComPropostaCriada = () => {
    definirModalAberto(false);
    carregarPropostas();
  };

  const sair = async () => {
    if (audioNotificacaoRef.current) {
      audioNotificacaoRef.current.pause();
      audioNotificacaoRef.current.currentTime = 0;
    }
    await conta.deleteSession('current');
    navegar('/login');
  };

  if (!usuarioAtual || !perfilUsuario) {
    return (
      <div className="recipiente-carregamento-feed-cliente">
        <IndicadorCarregamento />
      </div>
    );
  }

  return (
    <div className="recipiente-feed-cliente animacao-entrada">
      <HeaderPerfil nome={usuarioAtual.name} foto={perfilUsuario?.foto} onLogout={sair} />

      <div className="barra-pesquisa-falsa" onClick={() => definirModalAberto(true)}>
        <Search size={20} className="icone-pesquisa" />
        <span>Solicitar um novo serviço...</span>
      </div>

      <div className="conteudo-rolagem-cliente">
        <PullToRefresh
          onRefresh={() => carregarPropostas({ mostrarLoading: false })}
          pullingContent={<div className="refresh-ptr"><IndicadorCarregamento tamanho={24} /></div>}
          refreshingContent={<div className="refresh-ptr"><IndicadorCarregamento tamanho={24} /></div>}
        >
          <div className="secao-uber-style">
            <div className="titulo-secao-cliente">
              <h2>Profissionais Recomendados</h2>
              <span>Ver todos</span>
            </div>

            {carregandoDestaque ? (
              <div className="loader-horizontal"><IndicadorCarregamento tamanho={24} /></div>
            ) : (
              <div className="carrossel-profissionais">
                {profissionaisDestaque.map((prof) => (
                  <div key={prof.$id} className="item-carrossel" onClick={() => navegar(`/perfil?uid=${prof.$id}`)}>
                    <div className="avatar-carrossel">
                      {prof.foto ? <img src={prof.foto} alt={prof.nome} /> : <User size={32} />}
                      <div className="nota-badge">
                        <Star size={10} fill="currentColor" />
                        {Number(prof.mediaAvaliacoes || 0).toFixed(1)}
                      </div>
                    </div>
                    <span className="nome-carrossel">{prof.nome.split(' ')[0]}</span>
                    <span className="cat-carrossel">{prof.categoria}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="secao-pedidos-ativos">
            <div className="titulo-secao-cliente">
              <h2>Seus Pedidos Ativos</h2>
            </div>

            {carregando ? (
              <div className="loader-lista"><IndicadorCarregamento tamanho={32} /></div>
            ) : propostas.length === 0 ? (
              <div className="cartao-feed-vazio-cliente">
                <AlertCircle size={40} />
                <p>Você ainda não tem pedidos em aberto.</p>
                <button onClick={() => definirModalAberto(true)}>Começar agora</button>
              </div>
            ) : (
              <div className="lista-pedidos-uber">
                {propostas.map((p) => (
                  <CardProposta
                    key={p.$id}
                    proposta={p}
                    usuarioAtual={usuarioAtual}
                    perfilUsuario={perfilUsuario}
                    aoAtualizar={carregarPropostas}
                  />
                ))}
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>

      <button className="fab-novo-pedido" onClick={() => definirModalAberto(true)}>
        <Plus size={28} />
      </button>

      {modalAberto && (
        <ModalCriarProposta
          aoFechar={() => definirModalAberto(false)}
          aoCriar={lidarComPropostaCriada}
          clienteId={usuarioAtual.$id}
        />
      )}

      <BarraNavegacao tipoPerfil="USUARIO" />
    </div>
  );
};

export default TelaFeedCliente;