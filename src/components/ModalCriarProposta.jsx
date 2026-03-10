// Função para aplicar máscara de telefone
function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, '');
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length > 10) {
    return `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
  } else if (valor.length > 6) {
    return `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6, 10)}`;
  } else if (valor.length > 2) {
    return `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else {
    return valor;
  }
}

// Função para formatar moeda real
function mascaraMoeda(valor) {
  valor = valor.replace(/\D/g, '');
  valor = (Number(valor) / 100).toFixed(2);
  return valor.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}
import React, { useEffect, useState } from 'react';
import { X, Wrench, FileText, MapPin, DollarSign, LocateFixed, MapPinned, Phone, Plus, Trash2, ListChecks } from 'lucide-react';
import { bancoDeDados, storage, ID, ID_DO_BANCO, ID_COLECAO_PROPOSTAS, ID_BUCKET_IMAGENS_PROBLEMA } from '../services/appwrite';
import PainelInferior from './PainelInferior';
import '../styles/components/ModalCriarProposta.css';

const ModalCriarProposta = ({ aoFechar, aoCriar, clienteId }) => {
  const [formulario, definirFormulario] = useState({
    titulo: '',
    descricao: '',
    categoria: 'encanador',
    localizacao: '',
    enderecoCompleto: '',
    telefoneContato: '',
    valorEstimado: ''
  });
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState('');
  const [imagemProblema, definirImagemProblema] = useState(null);
  const [imagemProblemaPreview, definirImagemProblemaPreview] = useState('');
  const [localizando, definirLocalizando] = useState(false);
  const [novoItem, definirNovoItem] = useState('');
  const [itens, definirItens] = useState([]);

  const extrairAtributoDesconhecido = (mensagem) => {
    const texto = String(mensagem || '');
    const m = texto.match(/Unknown attribute:\s*"([^"]+)"/i);
    return m?.[1] || '';
  };

  const criarPropostaComRetry = async ({ dataBase, maxTentativas = 3 }) => {
    const data = { ...dataBase };
    for (let tentativa = 1; tentativa <= maxTentativas; tentativa += 1) {
      try {
        return await bancoDeDados.createDocument(ID_DO_BANCO, ID_COLECAO_PROPOSTAS, ID.unique(), data);
      } catch (err) {
        const atributo = extrairAtributoDesconhecido(err?.message);
        if (atributo && Object.prototype.hasOwnProperty.call(data, atributo)) {
          delete data[atributo];
          continue;
        }
        throw err;
      }
    }
    throw new Error('Erro ao criar proposta.');
  };

  useEffect(() => {
    return () => {
      if (imagemProblemaPreview) URL.revokeObjectURL(imagemProblemaPreview);
    };
  }, [imagemProblemaPreview]);

  const lidarComImagem = (arquivo) => {
    if (!arquivo) {
      definirImagemProblema(null);
      if (imagemProblemaPreview) URL.revokeObjectURL(imagemProblemaPreview);
      definirImagemProblemaPreview('');
      return;
    }

    definirImagemProblema(arquivo);
    if (imagemProblemaPreview) URL.revokeObjectURL(imagemProblemaPreview);
    definirImagemProblemaPreview(URL.createObjectURL(arquivo));
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
          console.error(err);
          definirErro('Não foi possível obter sua localização automaticamente.');
        } finally {
          definirLocalizando(false);
        }
      },
      (err) => {
        console.error(err);
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

  const lidarComSubmit = async (e) => {
    e.preventDefault();
    definirCarregando(true);
    definirErro('');

    try {
      let imagemProblemaUrl = '';
      let imagemProblemaFileId = '';
      if (imagemProblema) {
        try {
          const upload = await storage.createFile(ID_BUCKET_IMAGENS_PROBLEMA, ID.unique(), imagemProblema);
          imagemProblemaFileId = upload.$id;
          const viewUrl = storage.getFileView(ID_BUCKET_IMAGENS_PROBLEMA, upload.$id);
          imagemProblemaUrl = typeof viewUrl === 'string' ? viewUrl : viewUrl?.toString?.() || '';
        } catch (uploadErr) {
          console.error('Erro ao enviar imagem do problema', uploadErr);
        }
      }

      await criarPropostaComRetry({
        dataBase: {
          ...formulario,
          clienteId,
          status: 'ABERTO',
          valorEstimado: parseFloat(formulario.valorEstimado),
          dataCriacao: new Date().toISOString(),
          ...(itens.length > 0 ? { itensLista: itens.join('\n') } : {}),
          ...(imagemProblemaUrl ? { imagemProblemaUrl, imagemProblemaFileId } : {}),
          ...(formulario.enderecoCompleto ? { enderecoCompleto: formulario.enderecoCompleto } : {}),
          ...(formulario.telefoneContato ? { telefoneContato: formulario.telefoneContato } : {})
        }
      });
      aoCriar();
    } catch (err) {
      definirErro('Erro ao criar proposta. Tente novamente.');
      console.error(err);
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <PainelInferior aoFechar={aoFechar} ariaLabel="Nova Proposta">
      <div className="cabecalho-criar-proposta">
        <h2 className="titulo-criar-proposta">Nova Proposta</h2>
        <button onClick={aoFechar} className="botao-fechar-proposta">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={lidarComSubmit} className="formulario-criar-proposta">
        <div className="grupo-input-proposta">
          <label className="label-proposta">O que você precisa?</label>
          <div className="campo-icone-proposta">
            <Wrench size={20} className="icone-proposta" />
            <input
              type="text"
              className="input-proposta"
              required
              placeholder="Ex: Conserto de vazamento na pia"
              value={formulario.titulo}
              onChange={e => definingFormulario({ ...formulario, titulo: e.target.value })}
            />
          </div>
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Categoria</label>
          <select
            className="select-proposta"
            required
            value={formulario.categoria}
            onChange={e => definingFormulario({ ...formulario, categoria: e.target.value })}
          >
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

        <div className="grupo-input-proposta">
          <label className="label-proposta">Descrição detalhada</label>
          <div className="campo-icone-proposta">
            <FileText size={20} className="icone-proposta icone-proposta-texto" />
            <textarea
              className="textarea-proposta"
              required
              rows="4"
              placeholder="Descreva o problema com o máximo de detalhes..."
              value={formulario.descricao}
              onChange={e => definingFormulario({ ...formulario, descricao: e.target.value })}
            />
          </div>
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Lista de itens (opcional)</label>
          <div className="linha-adicionar-item">
            <div className="campo-icone-proposta campo-item">
              <ListChecks size={20} className="icone-proposta" />
              <input
                type="text"
                className="input-proposta"
                placeholder="Ex: Trocar torneira"
                value={novoItem}
                onChange={(e) => definingNovoItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const texto = novoItem.trim();
                    if (!texto) return;
                    definirItens((ant) => [...ant, texto]);
                    definirNovoItem('');
                  }
                }}
              />
            </div>
            <button
              type="button"
              className="botao-adicionar-proposta"
              onClick={() => {
                const texto = novoItem.trim();
                if (!texto) return;
                definirItens((ant) => [...ant, texto]);
                definirNovoItem('');
              }}
              aria-label="Adicionar item"
              title="Adicionar item"
            >
              <Plus size={20} />
            </button>
          </div>

          {itens.length > 0 ? (
            <div className="lista-itens-proposta">
              {itens.map((texto, idx) => (
                <div key={`${texto}-${idx}`} className="item-lista-proposta">
                  <span className="texto-item-proposta">{idx + 1}. {texto}</span>
                  <button
                    type="button"
                    className="botao-remover-item"
                    onClick={() => definirItens((ant) => ant.filter((_, i) => i !== idx))}
                    aria-label="Remover item"
                    title="Remover item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Foto do problema (opcional)</label>
          <div className="container-upload-proposta">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="input-arquivo-proposta"
              onChange={(e) => lidarComImagem(e.target.files?.[0])}
            />
            {imagemProblemaPreview ? (
              <div className="preview-imagem-proposta">
                <img
                  className="imagem-renderizada-proposta"
                  src={imagemProblemaPreview}
                  alt="Prévia da imagem do problema"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Bairro / Cidade</label>
          <div className="campo-icone-proposta">
            <MapPin size={20} className="icone-proposta" />
            <input
              type="text"
              className="input-proposta input-proposta-localizacao"
              required
              placeholder="Bairro, Cidade"
              value={formulario.localizacao}
              onChange={e => definingFormulario({ ...formulario, localizacao: e.target.value })}
            />
            <button
              type="button"
              className="botao-obter-localizacao"
              onClick={preencherLocalizacaoAtual}
              disabled={localizando}
              aria-label="Usar localização atual"
              title="Usar localização atual"
            >
              {localizando ? (
                <div className="spinner-localizacao" />
              ) : (
                <LocateFixed size={20} />
              )}
            </button>
          </div>
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Endereço completo (Rua, nº, complemento)</label>
          <div className="campo-icone-proposta">
            <MapPinned size={20} className="icone-proposta" />
            <input
              type="text"
              className="input-proposta"
              placeholder="Ex: Rua das Flores, 123 - Apto 202"
              value={formulario.enderecoCompleto}
              onChange={e => definingFormulario({ ...formulario, enderecoCompleto: e.target.value })}
            />
          </div>
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Telefone para contato</label>
          <div className="campo-icone-proposta">
            <Phone size={20} className="icone-proposta" />
            <input
              type="tel"
              className="input-proposta"
              placeholder="(DD) 9xxxx-xxxx"
              value={mascaraTelefone(formulario.telefoneContato)}
              onChange={e => definingFormulario({ ...formulario, telefoneContato: e.target.value })}
              inputMode="tel"
              autoComplete="tel"
              maxLength={15}
            />
          </div>
        </div>

        <div className="grupo-input-proposta">
          <label className="label-proposta">Valor que pretende pagar (R$)</label>
          <div className="campo-icone-proposta">
            <DollarSign size={20} className="icone-proposta" />
            <input
              type="text"
              className="input-proposta"
              required
              placeholder="0,00"
              value={mascaraMoeda(formulario.valorEstimado || '')}
              onChange={e => definingFormulario({ ...formulario, valorEstimado: e.target.value })}
              inputMode="decimal"
            />
          </div>
        </div>

        {erro && <p className="texto-erro-proposta">{erro}</p>}

        <button
          type="submit"
          className="botao-submit-proposta"
          disabled={carregando}
        >
          {carregando ? 'Publicando...' : 'Publicar Proposta'}
        </button>
      </form>
    </PainelInferior>
  );
};

export default ModalCriarProposta;