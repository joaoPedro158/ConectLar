import React, { useState, useEffect } from 'react';
import { X, Wrench, MapPin, DollarSign, FileText, LocateFixed } from 'lucide-react';
import { criarTrabalho, getToken, getMe } from '../services/api';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/TelaNovaProposta.css';
import IndicadorCarregamento from '../components/IndicadorCarregamento';

const TelaNovaProposta = () => {
  const [clienteId, definirClienteId] = useState('');
  const [carregandoUsuario, definirCarregandoUsuario] = useState(true);
  
  const [formulario, definirFormulario] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    localizacao: '',
    valorEstimado: ''
  });
  
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState('');
  const [imagemProblema, definirImagemProblema] = useState(null);
  const [imagemProblemaPreview, definirImagemProblemaPreview] = useState('');
  const [localizando, definirLocalizando] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    return () => {
      if (imagemProblemaPreview) URL.revokeObjectURL(imagemProblemaPreview);
    };
  }, [imagemProblemaPreview]);

  useEffect(() => {
    const buscarUsuario = async () => {
      try {
        const token = getToken();
        if (!token) throw new Error('No token');
        const me = await getMe(token);
        const usuario = me?.usuario || null;
        if (!usuario) throw new Error('No user');
        definirClienteId(usuario.$id || usuario.id || usuario.$id);
      } catch (err) {
        navegar('/login');
      } finally {
        definirCarregandoUsuario(false);
      }
    };

    buscarUsuario();
  }, [navegar]);

  const lidarComSubmit = async (e) => {
    e.preventDefault();
    
    if (!clienteId) {
      definirErro('Erro de autenticação. Tente fazer login novamente.');
      return;
    }

    if (!formulario.categoria) {
      definirErro('Selecione uma categoria de serviço.');
      return;
    }

    definirCarregando(true);
    definirErro('');

    try {
      const token = getToken();
      const payload = {
        problema: formulario.titulo,
        descricao: formulario.descricao,
        categoria: formulario.categoria,
        localizacao: formulario.localizacao,
        pagamento: formulario.valorEstimado ? Number(formulario.valorEstimado) : null,
        status: 'ABERTO',
      };

      await criarTrabalho({ token, ...payload }, imagemProblema);
      
      navegar('/feed-cliente');
      
    } catch (err) {
      definirErro('Erro ao publicar o pedido. Tente novamente.');
    } finally {
      definirCarregando(false);
    }
  };

  const lidarComImagem = (arquivo) => {
    if (!arquivo) {
      definirImagemProblema(null);
      if (imagemProblemaPreview) URL.revokeObjectURL(imagemProblemaPreview);
      definirImagemProblemaPreview('');
      return;
    }

    definirImagemProblema(arquivo);
    if (imagemProblemaPreview) URL.revokeObjectURL(imagemProblemaPreview);
    const url = URL.createObjectURL(arquivo);
    definirImagemProblemaPreview(url);
  };

  const preencherLocalizacaoAtual = async () => {
    if (!('geolocation' in navigator)) {
      definirErro('Geolocalização não é suportada neste dispositivo.');
      return;
    }

    definirErro('');
    definirLocalizando(true);

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const { latitude, longitude } = posicao.coords;
        try {
          const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&zoom=16&addressdetails=1`;
          const resp = await fetch(url, {
            headers: {
              'Accept': 'application/json',
              'Accept-Language': 'pt-BR'
            }
          });

          if (!resp.ok) throw new Error('Reverse geocode falhou');

          const dados = await resp.json();
          const endereco = dados?.address || {};
          const bairro = endereco.suburb || endereco.neighbourhood || endereco.quarter || '';
          const cidade = endereco.city || endereco.town || endereco.village || endereco.municipality || '';

          const texto = [bairro, cidade].filter(Boolean).join(', ');

          if (!texto) {
            definirErro('Não foi possível identificar bairro/cidade automaticamente.');
            return;
          }

          definirFormulario((anterior) => ({ ...anterior, localizacao: texto }));
        } catch (err) {
          definirErro('Não foi possível obter sua localização automaticamente.');
        } finally {
          definirLocalizando(false);
        }
      },
      (err) => {
        definirErro('Permissão de localização negada ou indisponível.');
        definirLocalizando(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  if (carregandoUsuario) {
    return (
      <div className="recipiente-carregamento-nova-proposta">
        <IndicadorCarregamento />
      </div>
    );
  }

  return (
    <div className="recipiente-nova-proposta animacao-esmaecer">
      <div className="cabecalho-nova-proposta">
        <div className="titulos-nova-proposta">
          <h1 className="titulo-principal-nova-proposta">Novo Pedido</h1>
          <p className="subtitulo-nova-proposta">Encontre o profissional ideal</p>
        </div>
        <button onClick={() => navegar('/feed-cliente')} className="botao-fechar-nova-proposta">
          <X size={24} />
        </button>
      </div>

      <div className="conteudo-nova-proposta">
        <form onSubmit={lidarComSubmit} className="formulario-nova-proposta">
          
          <div className="secao-formulario">
            <h3 className="titulo-secao-formulario">1. O que você precisa?</h3>
            <div className="cartao-secao-formulario">
              <div className="grupo-entrada-proposta">
                <div className="campo-com-icone">
                  <Wrench size={20} className="icone-campo" />
                  <input 
                    type="text" 
                    className="entrada-padrao" 
                    required 
                    placeholder="Ex: Conserto de vazamento"
                    value={formulario.titulo}
                    onChange={e => definirFormulario({...formulario, titulo: e.target.value})}
                  />
                </div>
              </div>

              <div className="grupo-entrada-proposta">
                <select 
                  className="entrada-padrao entrada-selecao"
                  required
                  value={formulario.categoria}
                  onChange={e => definirFormulario({...formulario, categoria: e.target.value})}
                >
                  <option value="" disabled>Selecione a categoria</option>
                  <option value="encanador">Encanador</option>
                  <option value="eletricista">Eletricista</option>
                  <option value="limpeza">Limpeza</option>
                  <option value="pintor">Pintor</option>
                  <option value="marceneiro">Marceneiro</option>
                  <option value="jardineiro">Jardineiro</option>
                  <option value="mecanico">Mecânico</option>
                  <option value="servicos gerais">Serviços Gerais</option>
                </select>
              </div>
            </div>
          </div>

          <div className="secao-formulario">
            <h3 className="titulo-secao-formulario">2. Detalhes do Serviço</h3>
            <div className="cartao-secao-formulario">
              <div className="grupo-entrada-proposta">
                <div className="campo-com-icone">
                  <FileText size={20} className="icone-campo icone-campo-texto" />
                  <textarea 
                    className="entrada-padrao entrada-area-texto" 
                    required 
                    rows="4"
                    placeholder="Descreva o problema detalhadamente..."
                    value={formulario.descricao}
                    onChange={e => definirFormulario({...formulario, descricao: e.target.value})}
                  />
                </div>
              </div>

              <div className="grupo-entrada-proposta">
                <label className="rotulo-campo-arquivo">
                  Foto do problema (opcional)
                </label>
                <div className="recipiente-arquivo-imagem">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="entrada-arquivo"
                    onChange={(e) => lidarComImagem(e.target.files?.[0])}
                  />
                  {imagemProblemaPreview ? (
                    <div className="recipiente-previa-imagem">
                      <img
                        className="imagem-previa"
                        src={imagemProblemaPreview}
                        alt="Prévia da imagem do problema"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="secao-formulario">
            <h3 className="titulo-secao-formulario">3. Local e Orçamento</h3>
            <div className="cartao-secao-formulario">
              <div className="grupo-entrada-proposta">
                <div className="campo-com-icone">
                  <MapPin size={20} className="icone-campo" />
                  <input 
                    type="text" 
                    className="entrada-padrao entrada-padrao-localizacao" 
                    required 
                    placeholder="Bairro, Cidade"
                    value={formulario.localizacao}
                    onChange={e => definirFormulario({...formulario, localizacao: e.target.value})}
                  />

                  <button
                    type="button"
                    className="botao-localizar-agora"
                    onClick={preencherLocalizacaoAtual}
                    disabled={localizando}
                    aria-label="Usar localização atual"
                    title="Usar localização atual"
                  >
                    {localizando ? (
                      <div className="spinner-localizacao-pequeno" />
                    ) : (
                      <LocateFixed size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="grupo-entrada-proposta">
                <div className="campo-com-icone">
                  <DollarSign size={20} className="icone-campo" />
                  <input 
                    type="number" 
                    className="entrada-padrao" 
                    required 
                    min="1"
                    step="0.01"
                    placeholder="Valor sugerido (R$)"
                    value={formulario.valorEstimado}
                    onChange={e => definirFormulario({...formulario, valorEstimado: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {erro && (
            <div className="alerta-erro-proposta">
              {erro}
            </div>
          )}

          <button 
            type="submit" 
            className="botao-publicar-proposta" 
            disabled={carregando}
          >
            {carregando ? 'Publicando...' : 'Publicar Pedido'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default TelaNovaProposta;