import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicao } from '../services/api';
import { HeaderProfissional } from '../components/HeaderProfissional';
import { EstatisticasCard } from '../components/EstatisticasCard';
import { CardPedido } from '../components/CardPedido';
import '../css/pages/HistoricoProfissional.css';

export default function HistoricoProfissional() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const dados = await requisicao('/usuario/historico', 'GET');
      setServicos(dados || []);
      calcularEstatisticas(dados || []);
    } catch (error) {
      console.error(error);
    }
  };

  const calcularEstatisticas = (servicos) => {
    const total = servicos.length;
    const concluidos = servicos.filter(s => s.status === 'CONCLUIDO').length;
    const lucroTotal = servicos
      .filter(s => s.status === 'CONCLUIDO')
      .reduce((acc, s) => acc + (s.pagamento || 0), 0);
    
    const avaliacoes = servicos.filter(s => s.avaliacao).map(s => s.avaliacao);
    const mediaAvaliacao = avaliacoes.length > 0
      ? (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1)
      : '0.0';

    setStats({
      totalLabel: 'Total de Serviços',
      total,
      concluidosLabel: 'Serviços Concluídos',
      concluidos,
      valorLabel: 'Lucro Total',
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lucroTotal),
      avaliacao: mediaAvaliacao
    });
  };

  return (
    <>
      <HeaderProfissional historicoCont={servicos.length} />

      <main className="container-principal">
        <section className="painel-conteudo">
          <h1 className="titulo-principal">Meu Histórico de Serviços</h1>

          <div className="layout-historico">
            <EstatisticasCard stats={stats} />

            <section className="area-historico">
              {servicos.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h2>Nenhum serviço no histórico</h2>
                  <p>Seus serviços aceitos aparecerão aqui.</p>
                </div>
              ) : (
                <div className="lista-pedidos">
                  {servicos.map(s => (
                    <CardPedido
                      key={s.id}
                      pedido={s}
                      onVerDetalhes={() => navigate(`/detalhes-trabalho?id=${s.id}`)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
