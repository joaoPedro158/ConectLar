import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, History, Sparkles } from 'lucide-react';
import { bancoDeDados, cliente, ID_DO_BANCO, ID_COLECAO_PROPOSTAS, conta, ID_COLECAO_USUARIOS } from '../services/appwrite';
import CardProposta from '../components/CardProposta';
import { Query } from 'appwrite';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/TelaFeedProfissional.css';
import BarraNavegacao from '../components/NavBar';
import HeaderPerfil from '../components/HeaderPerfil';
import IndicadorCarregamento from '../components/IndicadorCarregamento';
import PullToRefresh from 'react-simple-pull-to-refresh';

const TelaFeedProfissional = () => {
  const [propostas, definirPropostas] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [usuarioAtual, definirUsuarioAtual] = useState(null);
  const [perfilUsuario, definirPerfilUsuario] = useState(null);
  const [filtroCategoria, definirFiltroCategoria] = useState('');
  const audioNotificacaoRef = useRef(null);
  const subscriptionRef = useRef(null);
  const propostasConhecidasRef = useRef(new Set());
  const realtimeProntoRef = useRef(false);
  const navigate = useNavigate();

  const categorias = [
    'encanador', 'eletricista', 'limpeza', 'pintor', 
    'marceneiro', 'jardineiro', 'mecanico', 'servicos gerais'
  ];

  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (usuarioAtual) {
      carregarPropostas();
    }
  }, [usuarioAtual, filtroCategoria]);

  useEffect(() => {
    audioNotificacaoRef.current = new Audio('/ringtone/NOTIFICACAO.mp3');
    audioNotificacaoRef.current.preload = 'auto';
    audioNotificacaoRef.current.loop = true;

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    return () => {
      if (audioNotificacaoRef.current) {
        audioNotificacaoRef.current.pause();
        audioNotificacaoRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!usuarioAtual || !perfilUsuario) return;

    const canal = `databases.${ID_DO_BANCO}.collections.${ID_COLECAO_PROPOSTAS}.documents`;

    subscriptionRef.current?.();
    subscriptionRef.current = cliente.subscribe(canal, (response) => {
      const documento = response?.payload;
      const eventos = response?.events || [];
      if (!documento?.$id) return;
      if (!eventos.some((evento) => evento.includes('.create'))) return;
      if (documento.status !== 'ABERTO') return;
      if (filtroCategoria && documento.categoria !== filtroCategoria) return;

      if (!realtimeProntoRef.current) return;
      if (propostasConhecidasRef.current.has(documento.$id)) return;

      propostasConhecidasRef.current.add(documento.$id);
      definirPropostas((anteriores) => [documento, ...anteriores.filter((item) => item.$id !== documento.$id)]);

      if (audioNotificacaoRef.current) {
        audioNotificacaoRef.current.currentTime = 0;
        audioNotificacaoRef.current.loop = true;
        audioNotificacaoRef.current.play().catch(() => {});
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Nova proposta disponível', {
          body: documento.titulo || 'Um cliente enviou uma nova proposta.',
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `proposta-${documento.$id}`,
        });
      }
    });

    return () => {
      subscriptionRef.current?.();
      subscriptionRef.current = null;
    };
  }, [usuarioAtual, perfilUsuario, filtroCategoria]);

  const carregarUsuario = async () => {
    try {
      const user = await conta.get();
      definirUsuarioAtual(user);
      const perfil = await bancoDeDados.getDocument(ID_DO_BANCO, ID_COLECAO_USUARIOS, user.$id);
      if (perfil.tipoPerfil !== 'PROFISSIONAL') {
        navigate('/feed-cliente');
        return;
      }
      definirPerfilUsuario(perfil);
    } catch (err) {
      navigate('/login');
    }
  };

  const carregarPropostas = async ({ mostrarLoading = true } = {}) => {
    try {
      if (mostrarLoading) definirCarregando(true);
      const consultas = [
        Query.orderDesc('$createdAt'),
        Query.equal('status', 'ABERTO')
      ];
      
      if (filtroCategoria) {
        consultas.push(Query.equal('categoria', filtroCategoria));
      }

      const resposta = await bancoDeDados.listDocuments(
        ID_DO_BANCO,
        ID_COLECAO_PROPOSTAS,
        consultas
      );
      propostasConhecidasRef.current = new Set(resposta.documents.map((documento) => documento.$id));
      definirPropostas(resposta.documents);
      realtimeProntoRef.current = true;

      // Parar áudio se não houver propostas abertas
      if (audioNotificacaoRef.current && resposta.documents.length === 0) {
        audioNotificacaoRef.current.pause();
        audioNotificacaoRef.current.currentTime = 0;
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (mostrarLoading) definirCarregando(false);
    }
  };

  const sair = async () => {
    if (audioNotificacaoRef.current) {
      audioNotificacaoRef.current.pause();
      audioNotificacaoRef.current.currentTime = 0;
    }
    await conta.deleteSession('current');
    navigate('/login');
  };

  if (!usuarioAtual || !perfilUsuario) {
    return (
      <div className="recipiente-carregamento-tela">
        <IndicadorCarregamento />
      </div>
    );
  }

  return (
    <div className="recipiente-feed-profissional">
      <HeaderPerfil nome={usuarioAtual.name} foto={perfilUsuario?.foto} onLogout={sair} />
      
      <div className="cabecalho-feed">
        <h1 className="titulo-feed">Vagas Disponíveis</h1>
        <button className="botao-historico-feed" onClick={() => navigate('/historico')}>
          <History size={24} />
        </button>
      </div>

      <div className="recipiente-filtros">
        <button 
          className={`botao-filtro ${filtroCategoria === '' ? 'botao-filtro-ativo' : ''}`}
          onClick={() => definirFiltroCategoria('')}
        >
          Todas
        </button>
        {categorias.map(cat => (
          <button 
            key={cat}
            className={`botao-filtro ${filtroCategoria === cat ? 'botao-filtro-ativo' : ''}`}
            onClick={() => definirFiltroCategoria(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="recipiente-lista-propostas">
        <PullToRefresh
          onRefresh={() => carregarPropostas({ mostrarLoading: false })}
          pullingContent={(
            <div className="indicador-atualizacao">
              <IndicadorCarregamento tamanho={24} />
            </div>
          )}
          refreshingContent={(
            <div className="indicador-atualizacao">
              <IndicadorCarregamento tamanho={24} />
            </div>
          )}
        >
          {carregando ? (
            <div className="recipiente-carregamento-lista">
              <IndicadorCarregamento tamanho={36} />
            </div>
          ) : propostas.length === 0 ? (
            <div className="recipiente-vazio">
              <div className="cartao-feed-vazio">
                <div className="cabecalho-cartao-vazio">
                  <Sparkles size={20} className="icone-destaque" />
                  <h2 className="titulo-cartao-vazio">Bem-vindo(a)!</h2>
                </div>
                <p className="texto-cartao-vazio">
                  Ainda não há vagas abertas para este filtro. Puxe para atualizar ou troque a categoria para encontrar novas oportunidades.
                </p>
              </div>

              <div className="indicador-lista-vazia">
                <AlertCircle size={48} className="icone-vazio" />
                <p>Nenhuma proposta aberta no momento.</p>
              </div>
            </div>
          ) : (
            <div className="lista-separada">
              {propostas.map((proposta, idx) => (
                <React.Fragment key={proposta.$id}>
                  <CardProposta
                    proposta={proposta}
                    usuarioAtual={usuarioAtual}
                    perfilUsuario={perfilUsuario}
                    aoAtualizar={carregarPropostas}
                  />
                  {idx < propostas.length - 1 ? <div className="separador-proposta" /> : null}
                </React.Fragment>
              ))}
            </div>
          )}
        </PullToRefresh>
      </div>

      <BarraNavegacao tipoPerfil="PROFISSIONAL" />
    </div>
  );
};

export default TelaFeedProfissional;