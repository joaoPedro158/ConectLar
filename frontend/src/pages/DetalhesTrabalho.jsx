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

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR', {
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
              <p className="valor-destaque">{formatarValor(trabalho.pagamento)}</p>
            </div>
            <div className="info-box">
              <h3>Data de Abertura</h3>
              <p>{formatarData(trabalho.dataCriacao)}</p>
            </div>
          </div>

          <div className="info-box">
            <h3>Descrição do Problema</h3>
            <div className="descricao-box">
              <p className="descricao-texto">{trabalho.descricao}</p>
            </div>
          </div>

          {trabalho.localizacao && (
            <div className="endereco-box">
              <h3 className="subtitulo-secao">Localização do Serviço</h3>
              <div className="endereco-formatado">
                <p>{trabalho.localizacao.rua}, {trabalho.localizacao.numero}</p>
                {trabalho.localizacao.complemento && (
                  <p>Complemento: {trabalho.localizacao.complemento}</p>
                )}
                <p>{trabalho.localizacao.bairro}</p>
                <p>{trabalho.localizacao.cidade} - {trabalho.localizacao.estado}</p>
                <p>CEP: {trabalho.localizacao.cep}</p>
              </div>
            </div>
          )}

          {trabalho.imagens && trabalho.imagens.length > 0 && (
            <div className="info-box">
              <h3>Imagens Anexadas</h3>
              <div className="galeria">
                {trabalho.imagens.map((img, idx) => (
                  <img key={idx} src={img} alt={`Imagem ${idx + 1}`} className="imagem-galeria" />
                ))}
              </div>
            </div>
          )}

          <button onClick={() => window.history.back()} className="btn-voltar">
            ← Voltar
          </button>
        </section>
      </main>
    </>
  );
}
