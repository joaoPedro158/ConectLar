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
    
    const avaliacoes = pedidos.filter(p => p.avaliacao).map(p => p.avaliacao);
    const mediaAvaliacao = avaliacoes.length > 0
      ? (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1)
      : '0.0';

    setStats({
      totalLabel: 'Total de Pedidos',
      total,
      concluidosLabel: 'Pedidos Concluídos',
      concluidos,
      valorLabel: 'Gasto Total',
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gastoTotal),
      avaliacao: mediaAvaliacao
    });
  };

  const handleAvaliar = (pedidoId) => {
    setModalAvaliacao(pedidoId);
  };

  const enviarAvaliacao = async ({ estrelas, comentario }) => {
    try {
      await requisicao(`/trabalho/${modalAvaliacao}/avaliar`, 'POST', {
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
                    mostrarAvaliar={p.status === 'CONCLUIDO' && !p.avaliacao}
                    onAvaliar={() => handleAvaliar(p.id)}
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
