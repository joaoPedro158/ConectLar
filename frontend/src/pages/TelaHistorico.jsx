import React, { useState, useEffect } from 'react';
import { getToken, getMe, getHistorico, cancelarTrabalho } from '../services/api';
import CardProposta from '../components/CardProposta';
import { Activity, DollarSign, Star, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BarraNavegacao from '../components/NavBar';
import IndicadorCarregamento from '../components/IndicadorCarregamento';
import {
  SwipeableList,
  SwipeableListItem,
  TrailingActions,
  SwipeAction
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import '../styles/pages/TelaHistorico.css';

const TelaHistorico = () => {
  const [propostas, definirPropostas] = useState([]);
  const [historicoCompleto, definirHistoricoCompleto] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [usuarioAtual, definirUsuarioAtual] = useState(null);
  const [perfilUsuario, definirPerfilUsuario] = useState(null);
  const [totalFinancas, definirTotalFinancas] = useState(0);
  const [filtroStatus, definirFiltroStatus] = useState('CONCLUIDO');
  const navigate = useNavigate();

  const filtrosStatus = [
    { label: 'Todas', value: '' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Concluídos', value: 'CONCLUIDO' },
    { label: 'Cancelados', value: 'CANCELADO' }
  ];

  useEffect(() => {
    carregarUsuarioEHistorico();
  }, []);

  useEffect(() => {
    let propostasFiltradas = historicoCompleto;
    if (filtroStatus) {
      propostasFiltradas = historicoCompleto.filter((p) => p.status === filtroStatus);
    }
    definirPropostas(propostasFiltradas);
  }, [filtroStatus, historicoCompleto]);

  const carregarUsuarioEHistorico = async () => {
    try {
      definirCarregando(true);
      const token = getToken();
      if (!token) throw new Error('No token');
      const me = await getMe(token);
      const tipoPerfil = me?.tipoPerfil;
      const usuarioLogado = me?.usuario || null;
      if (!usuarioLogado) throw new Error('No user');
      if (!usuarioLogado.$id && usuarioLogado.id) usuarioLogado.$id = usuarioLogado.id;
      definirUsuarioAtual(usuarioLogado);
      definirPerfilUsuario(usuarioLogado);

      // fetch histórico do backend
      const historicoResp = await getHistorico({ tipoPerfil: tipoPerfil, token });
      const lista = Array.isArray(historicoResp) ? historicoResp : (historicoResp?.documents || historicoResp || []);
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

      definirHistoricoCompleto(mapped);

      const concluidas = mapped.filter(p => p.status === 'CONCLUIDO');
      const total = concluidas.reduce((acc, curr) => acc + (Number(curr.valorEstimado) || 0), 0);
      definirTotalFinancas(total);

    } catch (err) {
      console.error(err);
      navigate('/login');
    } finally {
      definirCarregando(false);
    }
  };

  const podeCancelarNoHistorico = (proposta) =>
    perfilUsuario?.tipoPerfil === 'USUARIO' && (proposta.status === 'ABERTO' || proposta.status === 'EM_ESPERA');

  const cancelarPropostaViaSwipe = async (propostaId) => {
    try {
      const token = getToken();
      await cancelarTrabalho({ token, idTrabalho: propostaId });
      definirHistoricoCompleto((anterior) =>
        anterior.map((p) => (p.$id === propostaId ? { ...p, status: 'CANCELADO' } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const acoesDeslizarCancelar = (propostaId) => (
    <TrailingActions>
      <SwipeAction destructive onClick={() => cancelarPropostaViaSwipe(propostaId)}>
        <div className="acao-deslizar-cancelar" aria-label="Cancelar">
          <Trash2 size={24} />
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  if (!usuarioAtual || !perfilUsuario) {
    return (
      <div className="recipiente-carregamento-historico">
        <IndicadorCarregamento />
      </div>
    );
  }

  const totalTrabalhosConcluidos = historicoCompleto.filter(p => p.status === 'CONCLUIDO').length;

  return (
    <div className="recipiente-tela-historico animacao-esmaecer">
      
      <div className="cabecalho-historico">
        <h1 className="titulo-historico">Meu Histórico</h1>
        <p className="subtitulo-historico">Acompanhe suas atividades</p>
      </div>

      <div className="grade-estatisticas">
        {perfilUsuario.tipoPerfil === 'USUARIO' ? (
          <>
            <div className="cartao-estatistica">
              <div className="rotulo-estatistica">Total Gasto</div>
              <div className="valor-estatistica valor-gasto">
                <DollarSign size={24} />
                <span className="texto-valor-estatistica">
                  {totalFinancas.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="cartao-estatistica">
              <div className="rotulo-estatistica">Serviços Contratados</div>
              <div className="valor-estatistica valor-neutro">
                <Activity size={24} />
                <span className="texto-valor-estatistica">
                  {totalTrabalhosConcluidos}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="cartao-estatistica">
              <div className="rotulo-estatistica">Total Ganho</div>
              <div className="valor-estatistica valor-ganho">
                <DollarSign size={24} />
                <span className="texto-valor-estatistica">
                  {totalFinancas.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="cartao-estatistica">
              <div className="rotulo-estatistica">Nota Média</div>
              <div className="valor-estatistica valor-neutro">
                <Star fill="currentColor" size={24} />
                <span className="texto-valor-estatistica">
                  {(() => {
                    const avaliacoes = Array.isArray(perfilUsuario.avaliacoes) ? perfilUsuario.avaliacoes : [];
                    if (!avaliacoes.length) return '0.0';
                    const soma = avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0);
                    const media = soma / avaliacoes.length;
                    return media.toFixed(1);
                  })()}
                </span>
              </div>
            </div>

            <div className="cartao-estatistica">
              <div className="rotulo-estatistica">Trabalhos Realizados</div>
              <div className="valor-estatistica valor-neutro">
                <Activity size={24} />
                <span className="texto-valor-estatistica">
                  {totalTrabalhosConcluidos}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="recipiente-filtros-historico">
        {filtrosStatus.map(filtro => (
          <button 
            key={filtro.value}
            className={`botao-filtro-historico ${filtroStatus === filtro.value ? 'botao-filtro-ativo' : ''}`}
            onClick={() => definirFiltroStatus(filtro.value)}
          >
            {filtro.label}
          </button>
        ))}
      </div>

      <div className="recipiente-lista-historico">
        <h2 className="titulo-resultados-historico">Resultados</h2>

        <div key={filtroStatus || 'todas'} className="animacao-esmaecer">
          {carregando ? (
            <div className="indicador-carregamento-lista">
              <IndicadorCarregamento tamanho={36} />
            </div>
          ) : propostas.length === 0 ? (
            <div className="lista-vazia-historico">
              <p>Nenhum registro encontrado no seu histórico para este filtro.</p>
            </div>
          ) : (
            <div className="lista-itens-historico">
              <SwipeableList>
                {propostas.map((proposta) => (
                  <SwipeableListItem
                    key={proposta.$id}
                    trailingActions={podeCancelarNoHistorico(proposta) ? acoesDeslizarCancelar(proposta.$id) : undefined}
                  >
                    <div className="envelope-proposta">
                      <CardProposta
                        proposta={proposta}
                        usuarioAtual={usuarioAtual}
                        perfilUsuario={perfilUsuario}
                        aoAtualizar={carregarUsuarioEHistorico}
                        modoHistorico
                      />
                    </div>
                  </SwipeableListItem>
                ))}
              </SwipeableList>
            </div>
          )}
        </div>
      </div>

      <BarraNavegacao tipoPerfil={perfilUsuario.tipoPerfil} />
      
    </div>
  );
};

export default TelaHistorico;