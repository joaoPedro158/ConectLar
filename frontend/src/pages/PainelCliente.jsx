import { useState, useEffect } from 'react';
import { requisicao } from '../services/api';
import { HeaderCliente } from '../components/HeaderCliente';
import { BarraBusca } from '../components/BarraBusca';
import { SecaoCategorias } from '../components/SecaoCategorias';
import { ListaPedidos } from '../components/ListaPedidos';
import { ModalNovoPedido } from '../components/ModalNovoPedido';
import '../css/pages/PainelCliente.css';

export default function PainelCliente() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dadosUsuario = await requisicao('/usuario/meusdados', 'GET');
      setUsuario(dadosUsuario);
      carregarPedidos();
    } catch (error) {
      console.error(error);
    }
  };

  const carregarPedidos = async () => {
    try {
      setLoading(true);
      const dados = await requisicao('/usuario/historico', 'GET');
      const ativos = dados ? dados.filter(p => p.status !== 'CONCLUIDO' && p.status !== 'CANCELADO') : [];
      setPedidos(ativos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCriarPedido = async (formData) => {
    try {
      const dadosTrabalho = {
        problema: formData.problema,
        descricao: formData.descricao,
        categoria: formData.categoria,
        pagamento: parseFloat(formData.pagamento) || 0,
        status: 'ABERTO',
        localizacao: {
          cep: formData.cep,
          cidade: formData.cidade,
          estado: formData.estado,
          bairro: formData.bairro,
          rua: formData.rua,
          numero: formData.numero,
          complemento: formData.complemento || ''
        }
      };

      const payload = new FormData();
      payload.append('dados', new Blob([JSON.stringify(dadosTrabalho)], { type: 'application/json' }));

      await requisicao('/trabalho/cadastrar', 'POST', payload, true);

      alert('Pedido criado com sucesso!');
      setModalAberto(false);
      carregarPedidos();
    } catch (e) {
      alert('Erro ao criar pedido: ' + e.message);
    }
  };

  const cancelarPedido = async (id) => {
    if (!window.confirm('Cancelar pedido?')) return;
    try {
      await requisicao(`/trabalho/${id}/cancelar`, 'POST');
      carregarPedidos();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <HeaderCliente historicoCont={pedidos.length} />

      <main className="container-principal">
        <section className="painel-conteudo">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img
              src={usuario?.fotoPerfil || '/assets/avatar-padrao.png'}
              alt="Foto do usuário"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #00e0ff' }}
            />
            <div style={{ fontWeight: '700' }}>
              Olá, <span>{usuario?.nome || 'Cliente'}</span>
            </div>
          </div>

          <BarraBusca />
          <SecaoCategorias />
          <hr className="divisor" />
          <ListaPedidos pedidos={pedidos} loading={loading} onCancelar={cancelarPedido} />

          <button className="fab-botao" onClick={() => setModalAberto(true)}>+</button>
        </section>
      </main>

      {modalAberto && <ModalNovoPedido aoFechar={() => setModalAberto(false)} aoEnviar={handleCriarPedido} />}
    </>
  );
}
