import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicao, authService } from '../services/api';
import { HeaderCliente } from '../components/HeaderCliente';
import { BarraBusca } from '../components/BarraBusca';
import { SecaoCategorias } from '../components/SecaoCategorias';
import { ListaPedidos } from '../components/ListaPedidos';
import { ModalNovoPedido } from '../components/ModalNovoPedido';
import '../css/pages/PainelCliente.css';

export default function PainelCliente() {
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuario, setUsuario] = useState(null);

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

      let usuarioAtual = null;
      if (info?.id) {
        const listaUsuarios = await requisicao('/usuario/list', 'GET');
        if (Array.isArray(listaUsuarios)) {
          usuarioAtual = listaUsuarios.find(u => u.id === info.id) || null;
        }
      }

      if (usuarioAtual) {
        const ajustado = {
          ...usuarioAtual,
          fotoPerfil: resolverSrcFoto(usuarioAtual.fotoPerfil),
        };

        setUsuario(ajustado);

        if (usuarioAtual.nome) {
          localStorage.setItem('usuario_nome', usuarioAtual.nome);
        }
        if (usuarioAtual.fotoPerfil) {
          localStorage.setItem('usuario_foto', usuarioAtual.fotoPerfil);
        }
      } else {
        setUsuario({ nome: info?.email || 'Cliente' });
      }
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

  const normalizarValorMoeda = (valor) => {
    if (!valor) return 0;
    const digitos = valor.toString().replace(/\D/g, '');
    if (!digitos) return 0;
    return parseFloat(digitos) / 100;
  };

  const handleCriarPedido = async (formData) => {
    try {
      const { arquivo, ...dadosCampos } = formData;

      const dadosTrabalho = {
        problema: dadosCampos.problema,
        descricao: dadosCampos.descricao,
        categoria: dadosCampos.categoria,
        pagamento: normalizarValorMoeda(dadosCampos.pagamento),
        status: 'ABERTO',
        localizacao: {
          cep: dadosCampos.cep,
          cidade: dadosCampos.cidade,
          estado: dadosCampos.estado,
          bairro: dadosCampos.bairro,
          rua: dadosCampos.rua,
          numero: dadosCampos.numero,
          complemento: dadosCampos.complemento || ''
        }
      };

      const payload = new FormData();
      payload.append('dados', new Blob([JSON.stringify(dadosTrabalho)], { type: 'application/json' }));

      if (arquivo) {
        payload.append('imagen', arquivo);
      }

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

  const handleVerDetalhes = (pedido) => {
    navigate(`/detalhes-trabalho?id=${pedido.id}`);
  };

  return (
    <>
      <HeaderCliente historicoCont={pedidos.length} />

      <main className="container-principal">
        <section className="painel-conteudo">
          <div className="painel-usuario-header">
            <img
              src={usuario?.fotoPerfil || '/assets/avatar-padrao.png'}
              alt="Foto do usuário"
              className="painel-usuario-foto"
            />
            <div className="painel-usuario-nome">
              Olá, <span>{usuario?.nome || 'Cliente'}</span>
            </div>
          </div>

          <BarraBusca />
          <SecaoCategorias />
          <hr className="divisor" />
          <ListaPedidos
            pedidos={pedidos}
            loading={loading}
            onCancelar={cancelarPedido}
            onVerDetalhes={handleVerDetalhes}
          />

          <button className="fab-botao" onClick={() => setModalAberto(true)}>+</button>
        </section>
      </main>

      {modalAberto && <ModalNovoPedido aoFechar={() => setModalAberto(false)} aoEnviar={handleCriarPedido} />}
    </>
  );
}
