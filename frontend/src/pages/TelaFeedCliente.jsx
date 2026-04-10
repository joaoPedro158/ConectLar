import React, { useState, useEffect, useRef } from 'react';
import { Plus, AlertCircle, History, Star, Search, User } from 'lucide-react';
import { getToken, getMe, listTrabalhos, listProfissionais, clearToken } from '../services/api';
import ModalCriarProposta from '../components/ModalCriarProposta';
import CardProposta from '../components/CardProposta';
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
      const token = getToken();
      if (!token) throw new Error('No token');
      const me = await getMe(token);
      const tipo = me?.tipoPerfil;
      const usuario = me?.usuario || null;
      if (!usuario) throw new Error('No user');
      // normalize id field
      if (!usuario.$id && usuario.id) usuario.$id = usuario.id;
      definirUsuarioAtual(usuario);
      if (tipo !== 'USUARIO') {
        navegar('/feed-profissional');
        return;
      }
      definirPerfilUsuario(usuario);
      carregarProfissionaisDestaque();
    } catch (erro) {
      navegar('/login');
    }
  };

  const carregarProfissionaisDestaque = async () => {
    try {
      definirCarregandoDestaque(true);
      const resp = await listProfissionais();
      const lista = Array.isArray(resp) ? resp : (resp?.documents || resp || []);
      const top = lista.slice(0, 10).map((p) => ({
        ...p,
        $id: p.id || p.$id,
        nome: p.nome || p.nome,
        foto: p.fotoPerfil || p.foto || p.fotoPerfil,
        mediaAvaliacoes: p.mediaAvaliacoes ?? null,
      }));
      definirProfissionaisDestaque(top);
    } catch (erro) {
      definirProfissionaisDestaque([]);
    } finally {
      definirCarregandoDestaque(false);
    }
  };

  const carregarPropostas = async ({ mostrarLoading = true } = {}) => {
    try {
      if (mostrarLoading) definirCarregando(true);
      const resp = await listTrabalhos();
      const lista = Array.isArray(resp) ? resp : (resp?.documents || resp || []);
      const mapped = (lista || []).map((t) => ({
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
      }));
      const filtrados = mapped.filter(p => String(p.clienteId) === String(usuarioAtual.$id) && p.status !== 'CONCLUIDO' && p.status !== 'CANCELADO');
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
    clearToken();
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