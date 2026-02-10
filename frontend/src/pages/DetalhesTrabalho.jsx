import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { requisicao } from '../services/api';
import { HeaderCliente } from '../components/HeaderCliente';
import '../css/pages/DetalhesTrabalho.css';

export default function DetalhesTrabalho() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [trabalho, setTrabalho] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDetalhes();
  }, [id]);

  const carregarDetalhes = async () => {
    try {
      setLoading(true);
      const dados = await requisicao(`/trabalho/${id}`, 'GET');
      setTrabalho(dados);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar detalhes do trabalho');
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (trabalho) => {
    const dataCrua =
      trabalho.dataHoraAberta ||
      trabalho.dataHoraAbertura ||
      trabalho.dataCriacao ||
      trabalho.data;

    if (!dataCrua) {
      return 'Data não informada';
    }

    const dataObj = new Date(dataCrua);

    if (isNaN(dataObj.getTime())) {
      return 'Data inválida';
    }

    return dataObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const mapearStatus = (status) => {
    const mapa = {
      ABERTO: 'Aberto',
      EM_ANDAMENTO: 'Em Andamento',
      CONCLUIDO: 'Concluído',
      CANCELADO: 'Cancelado'
    };
    return mapa[status] || status;
  };

  const valorOrcamento = trabalho?.pagamento
    ? formatarValor(trabalho.pagamento)
    : 'A Combinar';

  const localizacao = trabalho?.localizacao || {};
  const itensEndereco = [
    localizacao.rua ? `Rua: ${localizacao.rua}` : null,
    localizacao.numero ? `Nº: ${localizacao.numero}` : null,
    localizacao.bairro ? `Bairro: ${localizacao.bairro}` : null,
    localizacao.cidade ? `Cidade: ${localizacao.cidade}` : null,
    localizacao.estado ? `UF: ${localizacao.estado}` : null,
    localizacao.cep ? `CEP: ${localizacao.cep}` : null,
    localizacao.complemento ? `Ref: ${localizacao.complemento}` : null
  ].filter(Boolean);

  let listaImagens = [];
  if (Array.isArray(trabalho?.imagens)) {
    listaImagens = trabalho.imagens;
  } else if (trabalho?.caminhoImagem) {
    listaImagens = [trabalho.caminhoImagem];
  } else if (trabalho?.imagem) {
    listaImagens = [trabalho.imagem];
  } else if (trabalho?.foto) {
    listaImagens = [trabalho.foto];
  }

  if (loading) {
    return (
      <>
        <HeaderCliente />
        <main className="container-principal">
          <section className="painel-conteudo">
            <div className="loading">Carregando detalhes...</div>
          </section>
        </main>
      </>
    );
  }

  if (!trabalho) {
    return (
      <>
        <HeaderCliente />
        <main className="container-principal">
          <section className="painel-conteudo">
            <div className="erro">Trabalho não encontrado</div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderCliente />
      <main className="container-principal">
        <section className="painel-conteudo">
          <div className="header-detalhes">
            <div>
              <h1 className="titulo-problema">{trabalho.problema}</h1>
              <span className="categoria-badge">{trabalho.categoria}</span>
            </div>
            <div className={`status-badge status-${trabalho.status.toLowerCase()}`}>
              {mapearStatus(trabalho.status)}
            </div>
          </div>

          <div className="grid-info">
            <div className="info-box">
              <h3>Valor do Orçamento</h3>
              <p className="valor-destaque">{valorOrcamento}</p>
            </div>
            <div className="info-box">
              <h3>Data de Abertura</h3>
              <p>{formatarData(trabalho)}</p>
            </div>
          </div>

          <div className="info-box">
            <h3>Descrição do Problema</h3>
            <div className="descricao-box">
              <p className="descricao-texto">{trabalho.descricao}</p>
            </div>
          </div>

          <div className="endereco-box">
            <h3 className="subtitulo-secao">Localização do Serviço</h3>
            <div className="endereco-formatado">
              {itensEndereco.length > 0 ? (
                itensEndereco.map((item, idx) => (
                  <div key={idx} className="item-end">{item}</div>
                ))
              ) : (
                <span className="sem-endereco">Endereço não informado.</span>
              )}
            </div>
          </div>

          <div className="info-box">
            <h3>Imagens Anexadas</h3>
            {listaImagens.length > 0 ? (
              <div className="galeria">
                {listaImagens.map((img, idx) => {
                  if (!img) return null;
                  const src =
                    img.startsWith('http') || img.startsWith('/')
                      ? img
                      : `/upload/${img}`;
                  const handleClick = () => window.open(src, '_blank');
                  return (
                    <img
                      key={idx}
                      src={src}
                      alt={`Imagem ${idx + 1}`}
                      className="img-detalhe"
                      onClick={handleClick}
                      title="Clique para ampliar"
                    />
                  );
                })}
              </div>
            ) : (
              <span className="sem-imagem">Nenhuma imagem anexada.</span>
            )}
          </div>

          <button onClick={() => window.history.back()} className="btn-voltar">
            ← Voltar
          </button>
        </section>
      </main>
    </>
  );
}
