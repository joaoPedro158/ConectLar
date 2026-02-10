import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicao, authService } from '../services/api';
import { HeaderProfissional } from '../components/HeaderProfissional';
import { SecaoCategorias } from '../components/SecaoCategorias';
import { CardTrabalho } from '../components/CardTrabalho';
import { BarraBusca } from '../components/BarraBusca';
import '../css/pages/FeedTrabalhador.css';

export default function FeedTrabalhador() {
  const navigate = useNavigate();
  const [trabalhos, setTrabalhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [notificacoes, setNotificacoes] = useState({ pendentes: 0, aceitas: 0 });
  const [busca, setBusca] = useState('');
  const [historicoCont, setHistoricoCont] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const resolverSrcFoto = (foto) => {
    if (!foto) return '/assets/avatar-padrao.png';
    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) return foto;
    return `/upload/${foto}`;
  };

  const carregarDados = async () => {
    try {
      const info = authService.getUserInfo();

      // busca dados completos do profissional a partir do id do token
      let profissionalAtual = null;
      if (info?.id) {
        const listaProf = await requisicao('/profissional/list', 'GET');
        if (Array.isArray(listaProf)) {
          profissionalAtual = listaProf.find(p => p.id === info.id) || null;
        }
      }

      if (profissionalAtual) {
        setUsuario({
          ...profissionalAtual,
          fotoPerfil: resolverSrcFoto(profissionalAtual.fotoPerfil),
        });

        if (profissionalAtual.nome) {
          localStorage.setItem('usuario_nome', profissionalAtual.nome);
        }
        if (profissionalAtual.fotoPerfil) {
          localStorage.setItem('usuario_foto', profissionalAtual.fotoPerfil);
        }
      } else {
        setUsuario({ nome: info?.email || 'Profissional' });
      }

      const historico = await requisicao('/profissional/historico', 'GET');
      const lista = Array.isArray(historico) ? historico : [];
      setHistoricoCont(lista.length || 0);

      const pendentes = lista.filter(t => t && t.status === 'EM_ESPERA').length;
      const aceitas = lista.filter(t => t && t.status === 'EM_ANDAMENTO').length;
      setNotificacoes({ pendentes, aceitas });

      carregarTrabalhos();
    } catch (error) {
      console.error(error);
    }
  };

  const candidatar = async (trabalhoId) => {
    try {
      await requisicao(`/trabalho/${trabalhoId}/candidatar`, 'POST');
      alert('Candidatura enviada com sucesso!');
      carregarTrabalhos();
    } catch (error) {
      alert('Erro ao se candidatar: ' + error.message);
    }
  };

  const carregarTrabalhos = async () => {
    try {
      setLoading(true);
      const dados = await requisicao('/trabalho/list', 'GET');
      const disponiveis = dados ? dados.filter(t => t.status === 'ABERTO') : [];
      setTrabalhos(disponiveis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buscarVagas = async () => {
    try {
      setLoading(true);
      const dados = await requisicao(`/trabalho/busca?termo=${encodeURIComponent(busca)}`, 'GET');
      const disponiveis = dados ? dados.filter(t => t.status === 'ABERTO') : [];
      setTrabalhos(disponiveis);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalhes = (trabalho) => {
    navigate(`/detalhes-trabalho?id=${trabalho.id}`);
  };

  return (
    <>
      <HeaderProfissional historicoCont={historicoCont} />

      <main className="container-principal">
        <section className="painel-conteudo">
          <div className="saudacao-usuario">
            <img
              src={usuario?.fotoPerfil || '/assets/avatar-padrao.png'}
              alt="Foto do usuário"
              className="foto-usuario"
            />
            <div className="texto-saudacao">
              Olá, <span>{usuario?.nome || 'Profissional'}</span>
            </div>
          </div>

          <div className="caixa-notificacoes">
            <div className="notif-card">
              <div className="notif-titulo">Notificações</div>
              <div className="notif-badges">
                <span className="badge-notif">Pendentes: {notificacoes.pendentes}</span>
                <span className="badge-notif">Aceitas: {notificacoes.aceitas}</span>
              </div>
            </div>
          </div>

          <SecaoCategorias />

          <BarraBusca 
            valor={busca} 
            aoMudar={setBusca} 
            aoBuscar={buscarVagas} 
            placeholder="O que você está procurando hoje?" 
          />

          <div className="secao-feed">
            <h1 className="titulo-sessao">Oportunidades Disponíveis</h1>

            {loading ? (
              <div className="empty-state">
                <div className="empty-icon">🔎</div>
                <h2>Buscando as melhores vagas...</h2>
                <p>Aguarde um momento enquanto carregamos novos serviços para você.</p>
              </div>
            ) : trabalhos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h2>Nenhuma vaga disponível</h2>
                <p>Não há oportunidades no momento. Volte mais tarde!</p>
              </div>
            ) : (
              <div className="lista-trabalhos">
                {trabalhos.map(t => (
                  <CardTrabalho
                    key={t.id}
                    trabalho={t}
                    onVerDetalhes={handleVerDetalhes}
                    onCandidatar={() => candidatar(t.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}