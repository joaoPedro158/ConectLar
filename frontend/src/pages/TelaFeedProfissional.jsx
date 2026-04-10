import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, History, Sparkles } from 'lucide-react';
import { getToken, getMe, listTrabalhos, clearToken } from '../services/api';
import CardProposta from '../components/CardProposta';
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

  // Realtime subscriptions were provided by Appwrite. Using REST API,
  // we fall back to polling on refresh and when component mounts.
  useEffect(() => {
    // noop – realtime removed. proposals are reloaded via pull-to-refresh
    return () => {};
  }, [usuarioAtual, perfilUsuario, filtroCategoria]);

  const carregarUsuario = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token');
      const me = await getMe(token);
      const tipo = me?.tipoPerfil;
      const user = me?.usuario || null;
      if (!user) throw new Error('No user');
      if (!user.$id && user.id) user.$id = user.id;
      definirUsuarioAtual(user);
      if (tipo !== 'PROFISSIONAL') {
        navigate('/feed-cliente');
        return;
      }
      definirPerfilUsuario(user);
    } catch (err) {
      navigate('/login');
    }
  };

  const carregarPropostas = async ({ mostrarLoading = true } = {}) => {
    try {
      if (mostrarLoading) definirCarregando(true);
      const resp = await listTrabalhos();
      const lista = Array.isArray(resp) ? resp : (resp?.documents || resp || []);
      const mapped = (lista || [])
        .map((t) => ({
          $id: t.id || t.$id,
          titulo: t.problema || t.titulo || '',
          descricao: t.descricao || '',
          valorEstimado: t.pagamento ?? t.valorEstimado ?? 0,
          categoria: t.categoria || null,
          localizacao: t.localizacao ? (typeof t.localizacao === 'string' ? t.localizacao : JSON.stringify(t.localizacao)) : (t.localizacao || ''),
          enderecoCompleto: t.enderecoCompleto || null,
          telefoneContato: t.telefoneContato || null,
          dataCriacao: t.dataHoraAberta || t.dataCriacao || new Date().toISOString(),
          imagemProblemaUrl: t.caminhoImagem ? `/upload/${t.caminhoImagem}` : (t.imagemProblemaUrl || null),
          clienteId: t.idUsuario || t.clienteId || t.idUsuario,
          profissionalAceitoId: t.idProfissional || t.profissionalAceitoId || t.idProfissional,
          status: t.status || 'ABERTO',
        }))
        .filter((item) => item.status === 'ABERTO');

      const filtrados = filtroCategoria ? mapped.filter((m) => String(m.categoria || '').toLowerCase() === String(filtroCategoria).toLowerCase()) : mapped;
      propostasConhecidasRef.current = new Set(filtrados.map((d) => d.$id));
      definirPropostas(filtrados);
      realtimeProntoRef.current = true;

      // Parar áudio se não houver propostas abertas
      if (audioNotificacaoRef.current && filtrados.length === 0) {
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
    clearToken();
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