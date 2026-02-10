import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicao } from '../services/api';
import { HeaderCliente } from '../components/HeaderCliente';
import { EstatisticasCard } from '../components/EstatisticasCard';
import { CardPedido } from '../components/CardPedido';
import { ModalAvaliacao } from '../components/ModalAvaliacao';
import '../css/pages/HistoricoCliente.css';

export default function HistoricoCliente() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [stats, setStats] = useState({});
  const [modalAvaliacao, setModalAvaliacao] = useState(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const dados = await requisicao('/usuario/historico', 'GET');
      setPedidos(dados || []);
      calcularEstatisticas(dados || []);
    } catch (error) {
      console.error(error);
    }
  };

  const calcularEstatisticas = (pedidos) => {
    const total = pedidos.length;
    const concluidos = pedidos.filter(p => p.status === 'CONCLUIDO').length;
    const gastoTotal = pedidos
      .filter(p => p.status === 'CONCLUIDO')
      .reduce((acc, p) => acc + (p.pagamento || 0), 0);

    setStats({
      totalLabel: 'Total de Pedidos',
      total,
      concluidosLabel: 'Pedidos Concluídos',
      concluidos,
      valorLabel: 'Gasto Total',
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastoTotal),
      avaliacao: '-' // igual ao legado, que não calcula média aqui
    });
  };

  const concluirServico = async (idServico) => {
    if (!window.confirm('Confirmar que o serviço foi finalizado pelo profissional?')) return;
    try {
      await requisicao(`/trabalho/${idServico}/concluir`, 'POST');
      alert('Serviço concluído com sucesso!');
      carregarHistorico();
      setModalAvaliacao(idServico);
    } catch (error) {
      alert('Não foi possível concluir o serviço.');
    }
  };

  const cancelarTrabalho = async (idTrabalho) => {
    if (!window.confirm('Deseja realmente cancelar este pedido?')) return;
    try {
      await requisicao(`/trabalho/${idTrabalho}/cancelar`, 'POST');
      alert('Pedido cancelado.');
      carregarHistorico();
    } catch (error) {
      alert('Erro ao cancelar pedido.');
    }
  };

  const handleAvaliar = (pedidoId) => {
    setModalAvaliacao(pedidoId);
  };

  const enviarAvaliacao = async ({ estrelas, comentario }) => {
    try {
      await requisicao(`/avaliacao/avaliar/${modalAvaliacao}`, 'POST', {
        nota: estrelas,
        comentario
      });
      alert('Avaliação enviada com sucesso!');
      setModalAvaliacao(null);
      carregarHistorico();
    } catch (error) {
      alert('Erro ao enviar avaliação: ' + error.message);
    }
  };

  return (
    <>
      <HeaderCliente historicoCont={pedidos.length} />

      <main className="container-principal">
        <h1 className="titulo-principal">Meu Histórico de Pedidos</h1>

        <div className="layout-historico">
          <EstatisticasCard stats={stats} />

          <section className="area-historico">
            {pedidos.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h2>Nenhum pedido no histórico</h2>
                <p>Seus pedidos aparecerão aqui após serem criados.</p>
              </div>
            ) : (
              <div className="lista-pedidos">
                {pedidos.map(p => (
                  <CardPedido
                    key={p.id}
                    pedido={p}
                    onConcluir={concluirServico}
                    onCancelar={cancelarTrabalho}
                    mostrarAvaliar={p.status === 'CONCLUIDO' && !p.avaliado}
                    onAvaliar={handleAvaliar}
                    onVerDetalhes={() => navigate(`/detalhes-trabalho?id=${p.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {modalAvaliacao && (
        <ModalAvaliacao
          aoFechar={() => setModalAvaliacao(null)}
          aoEnviar={enviarAvaliacao}
        />
      )}
    </>
  );
}
