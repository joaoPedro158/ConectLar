import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, UserPlus, Star, X, CheckSquare, Tag, MessageCircle, MapPinned, Phone, BadgeDollarSign } from 'lucide-react';
import { bancoDeDados, ID, ID_DO_BANCO, ID_COLECAO_PROPOSTAS, ID_COLECAO_CANDIDATURAS, ID_COLECAO_USUARIOS, ID_COLECAO_AVALIACOES } from '../services/appwrite';
import { Query } from 'appwrite';
import ModalAvaliar from './ModalAvaliar';
import ModalContraproposta from './ModalContraproposta';
import { useNavigate } from 'react-router-dom';
import '../styles/components/CardProposta.css';

const CardProposta = ({ proposta, usuarioAtual, perfilUsuario, aoAtualizar, modoHistorico = false }) => {
  const navigate = useNavigate();
  const [candidaturas, definirCandidaturas] = useState([]);
  const [carregandoAcao, definirCarregandoAcao] = useState(false);
  const [jaCandidatou, definirJaCandidatou] = useState(false);
  const [avaliacoes, definirAvaliacoes] = useState([]);
  const [modalAvaliarAberto, definirModalAvaliarAberto] = useState(false);
  const [perfilProfissionalAceito, definirPerfilProfissionalAceito] = useState(null);
  const [perfilCliente, definirPerfilCliente] = useState(null);
  const [modalContrapropostaAberto, definirModalContrapropostaAberto] = useState(false);

  useEffect(() => {
    if (proposta.status === 'ABERTO' || proposta.status === 'EM_ESPERA') {
      carregarCandidaturas();
    }
    if (proposta.status === 'CONCLUIDO') {
      verificarAvaliacao();
    }
    if (proposta.profissionalAceitoId && !perfilProfissionalAceito) {
      carregarPerfilProfissionalAceito();
    }
    if (
      proposta.clienteId &&
      perfilUsuario.tipoPerfil === 'PROFISSIONAL' &&
      (proposta.status === 'CONCLUIDO' || proposta.status === 'EM_ANDAMENTO') &&
      !perfilCliente
    ) {
      carregarPerfilCliente();
    }
  }, [proposta]);

  const extrairAtributoDesconhecido = (mensagem) => {
    const texto = String(mensagem || '');
    const m = texto.match(/Unknown attribute:\s*"([^"]+)"/i);
    return m?.[1] || '';
  };

  const carregarCandidaturas = async () => {
    try {
      const resp = await bancoDeDados.listDocuments(
        ID_DO_BANCO,
        ID_COLECAO_CANDIDATURAS,
        [Query.equal('propostaId', proposta.$id)]
      );
      
      const candidaturasComPerfil = await Promise.all(resp.documents.map(async (cand) => {
        const perfilProfissional = await bancoDeDados.getDocument(ID_DO_BANCO, ID_COLECAO_USUARIOS, cand.profissionalId);
        return { ...cand, perfilProfissional };
      }));
      
      definirCandidaturas(candidaturasComPerfil);
      
      if (perfilUsuario.tipoPerfil === 'PROFISSIONAL') {
        const candidatou = resp.documents.some(c => c.profissionalId === usuarioAtual.$id);
        definirJaCandidatou(candidatou);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const carregarPerfilProfissionalAceito = async () => {
    try {
      const perfil = await bancoDeDados.getDocument(ID_DO_BANCO, ID_COLECAO_USUARIOS, proposta.profissionalAceitoId);
      definirPerfilProfissionalAceito(perfil);
    } catch (error) {
      console.error(error);
    }
  };

  const carregarPerfilCliente = async () => {
    try {
      const perfil = await bancoDeDados.getDocument(ID_DO_BANCO, ID_COLECAO_USUARIOS, proposta.clienteId);
      definirPerfilCliente(perfil);
    } catch (error) {
      console.error(error);
    }
  };

  const verificarAvaliacao = async () => {
    try {
      const resp = await bancoDeDados.listDocuments(
        ID_DO_BANCO,
        ID_COLECAO_AVALIACOES,
        [Query.equal('propostaId', proposta.$id)]
      );
      definirAvaliacoes(resp.documents);
    } catch (error) {
      console.error(error);
    }
  };

  const lidarComCandidatura = async (valorProposto = null) => {
    definirCarregandoAcao(true);
    try {
      const data = {
        propostaId: proposta.$id,
        profissionalId: usuarioAtual.$id,
        ...(Number.isFinite(Number(valorProposto)) ? { valorProposto: Number(valorProposto) } : {}),
        status: 'PENDENTE',
        dataCandidatura: new Date().toISOString()
      };

      try {
        await bancoDeDados.createDocument(ID_DO_BANCO, ID_COLECAO_CANDIDATURAS, ID.unique(), data);
      } catch (err) {
        const atributo = extrairAtributoDesconhecido(err?.message);
        if (atributo && Object.prototype.hasOwnProperty.call(data, atributo)) {
          delete data[atributo];
          await bancoDeDados.createDocument(ID_DO_BANCO, ID_COLECAO_CANDIDATURAS, ID.unique(), data);
        } else {
          throw err;
        }
      }
      
      if (proposta.status === 'ABERTO') {
        await bancoDeDados.updateDocument(ID_DO_BANCO, ID_COLECAO_PROPOSTAS, proposta.$id, {
          status: 'EM_ESPERA'
        });
      }
      aoAtualizar();
    } catch (error) {
      console.error(error);
    } finally {
      definirCarregandoAcao(false);
    }
  };

  const abrirContraproposta = () => {
    definirModalContrapropostaAberto(true);
  };

  const lidarComAceite = async (candidaturaId, profissionalId) => {
    definirCarregandoAcao(true);
    try {
      await bancoDeDados.updateDocument(ID_DO_BANCO, ID_COLECAO_CANDIDATURAS, candidaturaId, { status: 'ACEITO' });
      await bancoDeDados.updateDocument(ID_DO_BANCO, ID_COLECAO_PROPOSTAS, proposta.$id, {
        status: 'EM_ANDAMENTO',
        profissionalAceitoId: profissionalId
      });
      aoAtualizar();
    } catch (error) {
      console.error(error);
    } finally {
      definirCarregandoAcao(false);
    }
  };

  const lidarComCancelamento = async () => {
    definirCarregandoAcao(true);
    try {
      await bancoDeDados.updateDocument(ID_DO_BANCO, ID_COLECAO_PROPOSTAS, proposta.$id, { status: 'CANCELADO' });
      aoAtualizar();
    } catch (error) {
      console.error(error);
    } finally {
      definirCarregandoAcao(false);
    }
  };

  const lidarComConclusao = async () => {
    definirCarregandoAcao(true);
    try {
      await bancoDeDados.updateDocument(ID_DO_BANCO, ID_COLECAO_PROPOSTAS, proposta.$id, { status: 'CONCLUIDO' });
      aoAtualizar();
    } catch (error) {
      console.error(error);
    } finally {
      definirCarregandoAcao(false);
    }
  };

  const aoFinalizarAvaliacao = () => {
    definirModalAvaliarAberto(false);
    verificarAvaliacao();
    aoAtualizar();
  };

  const avaliacaoDoUsuario = avaliacoes.find((a) => a.clienteId === usuarioAtual.$id);
  const avaliacaoRecebida = avaliacoes.find((a) => a.profissionalId === usuarioAtual.$id);

  const renderStars = (nota) => (
    <div className="estrelas">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={16}
          fill={n <= nota ? 'var(--cor-texto)' : 'transparent'}
          color="var(--cor-texto)"
        />
      ))}
    </div>
  );

  const limparTelefone = (valor) => String(valor || '').replace(/\D/g, '');

  const montarLinkWhatsApp = ({ telefone, nomeDestino }) => {
    const numero = limparTelefone(telefone);
    if (!numero) return '';

    const numeroComPais = numero.startsWith('55') ? numero : `55${numero}`;
    const nomePrimeiro = String(nomeDestino || '').trim().split(' ')[0] || '';
    const nomeRemetente = usuarioAtual?.name || 'um usuário';
    const texto = encodeURIComponent(
      `Olá ${nomePrimeiro}, sou ${nomeRemetente} do ConectLar. Estou entrando em contato sobre o serviço: "${proposta.titulo}".`
    );

    return `https://wa.me/${numeroComPais}?text=${texto}`;
  };

  const linkWhatsApp =
    proposta.status === 'EM_ANDAMENTO'
      ? (perfilUsuario.tipoPerfil === 'USUARIO'
          ? montarLinkWhatsApp({ telefone: perfilProfissionalAceito?.telefone, nomeDestino: perfilProfissionalAceito?.nome })
          : montarLinkWhatsApp({ telefone: perfilCliente?.telefone, nomeDestino: perfilCliente?.nome }))
      : '';

  const mostrarCaixaContato =
    proposta.status === 'EM_ANDAMENTO' &&
    ((perfilUsuario.tipoPerfil === 'USUARIO' && !!perfilProfissionalAceito) ||
      (perfilUsuario.tipoPerfil === 'PROFISSIONAL' && !!perfilCliente));

  const podeVerDadosPrivados =
    proposta.status === 'EM_ANDAMENTO' &&
    (usuarioAtual?.$id === proposta.clienteId || usuarioAtual?.$id === proposta.profissionalAceitoId);

  const statusMap = {
    'ABERTO': { text: 'Aberto' },
    'EM_ESPERA': { text: 'Em Espera' },
    'EM_ANDAMENTO': { text: 'Em Andamento' },
    'CONCLUIDO': { text: 'Concluído' },
    'CANCELADO': { text: 'Cancelado' }
  };

  return (
    <div className="container">
      
      <div className="cabecalho">
        <h3 className="titulo">
          {proposta.titulo}
        </h3>
        <span className="badge-status">
          {statusMap[proposta.status]?.text || proposta.status}
        </span>
      </div>
      
      <p className="descricao">
        {proposta.descricao}
      </p>

      {proposta.itensLista ? (
        <div className="itens-box">
          <div className="itens-titulo">Itens do serviço</div>
          <div className="itens-lista">
            {String(proposta.itensLista)
              .split(/\r?\n/)
              .map((t) => t.trim())
              .filter(Boolean)
              .map((t, idx) => (
                <div key={`${t}-${idx}`} className="item-linha">
                  <span className="item-indice">{idx + 1}.</span>
                  <span className="item-texto">{t}</span>
                </div>
              ))}
          </div>
        </div>
      ) : null}
      
      <div className="metadados">
        {proposta.categoria && (
          <div className="metadado">
            <Tag size={16} />
            <span>{proposta.categoria}</span>
          </div>
        )}
        <div className="metadado">
          <MapPin size={16} />
          <span>{proposta.localizacao}</span>
        </div>

        {podeVerDadosPrivados && proposta.enderecoCompleto ? (
          <div className="metadado">
            <MapPinned size={16} />
            <span>{proposta.enderecoCompleto}</span>
          </div>
        ) : null}

        {podeVerDadosPrivados && proposta.telefoneContato ? (
          <div className="metadado">
            <Phone size={16} />
            <span>{proposta.telefoneContato}</span>
          </div>
        ) : null}
        <div className="metadado">
          <Clock size={16} />
          <span>{new Date(proposta.dataCriacao).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {proposta.imagemProblemaUrl ? (
        <div className="imagem-container">
          <img
            src={proposta.imagemProblemaUrl}
            alt="Problema relatado"
            className="imagem"
          />
        </div>
      ) : null}

      <div className="rodape">
        {mostrarCaixaContato ? (
          <div className="contato-box">
            {perfilUsuario.tipoPerfil === 'USUARIO' ? (
              <div className="contato-info">
                <span className="contato-label">Profissional</span>
                <span className="contato-nome">{perfilProfissionalAceito?.nome}</span>
                <div className="contato-nota">
                  <Star size={14} fill="var(--cor-texto)" />
                  {perfilProfissionalAceito?.mediaAvaliacoes || '5.0'}
                </div>
              </div>
            ) : (
              <div className="contato-info">
                <span className="contato-label">Cliente</span>
                <span className="contato-nome">{perfilCliente?.nome}</span>
              </div>
            )}

            {linkWhatsApp ? (
              <a className="botao-secundario botao-icone" href={linkWhatsApp} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                Chat
              </a>
            ) : null}
          </div>
        ) : null}
        
        <div className="orcamento">
          <span className="orcamento-label">Pagamento estimado</span>
          <div className="valor">
            R$ {Number(proposta.valorEstimado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {proposta.status === 'CONCLUIDO' && (avaliacaoDoUsuario || avaliacaoRecebida) && (
          <div className="avaliacoes-box">
            {avaliacaoDoUsuario && (
              <div className="avaliacao-linha">
                <span>Sua avaliação</span>
                {renderStars(avaliacaoDoUsuario.nota || 0)}
              </div>
            )}
            {avaliacaoRecebida && (
              <div className="avaliacao-linha">
                <span>Avaliação recebida</span>
                {renderStars(avaliacaoRecebida.nota || 0)}
              </div>
            )}
          </div>
        )}

        {perfilUsuario.tipoPerfil === 'USUARIO' && !modoHistorico && (proposta.status === 'ABERTO' || proposta.status === 'EM_ESPERA') && (
          <button className="botao-secundario" onClick={lidarComCancelamento} disabled={carregandoAcao}>
            <X size={20} />
            {carregandoAcao ? 'Aguarde...' : 'Cancelar'}
          </button>
        )}

        {perfilUsuario.tipoPerfil === 'USUARIO' && proposta.status === 'EM_ANDAMENTO' && (
          <button className="botao-primario" onClick={lidarComConclusao} disabled={carregandoAcao}>
            <CheckSquare size={20} />
            {carregandoAcao ? 'Aguarde...' : 'Concluir'}
          </button>
        )}

        {proposta.status === 'EM_ANDAMENTO' && linkWhatsApp && !mostrarCaixaContato ? (
          <a className="botao-secundario" href={linkWhatsApp} target="_blank" rel="noreferrer">
            <MessageCircle size={20} />
            Falar no WhatsApp
          </a>
        ) : null}

        {perfilUsuario.tipoPerfil === 'USUARIO' && proposta.status === 'CONCLUIDO' && !avaliacaoDoUsuario && perfilProfissionalAceito && (
          <button className="botao-primario" onClick={() => definirModalAvaliarAberto(true)}>
            <Star size={20} fill="var(--cor-fundo)" />
            Avaliar Profissional
          </button>
        )}

        {perfilUsuario.tipoPerfil === 'PROFISSIONAL' && proposta.status === 'ABERTO' && !jaCandidatou && (
          <button className="botao-primario" onClick={abrirContraproposta} disabled={carregandoAcao}>
            <UserPlus size={20} />
            {carregandoAcao ? 'Enviando...' : 'Candidatar-se'}
          </button>
        )}

        {perfilUsuario.tipoPerfil === 'PROFISSIONAL' && proposta.status === 'CONCLUIDO' && !avaliacaoDoUsuario && proposta.clienteId && (
          <button className="botao-primario" onClick={() => definirModalAvaliarAberto(true)}>
            <Star size={20} fill="var(--cor-fundo)" />
            Avaliar Cliente
          </button>
        )}
      </div>

      {perfilUsuario.tipoPerfil === 'USUARIO' && proposta.status === 'EM_ESPERA' && candidaturas.length > 0 && (
        <div className="candidaturas">
          <h4 className="candidaturas-titulo">Profissionais Interessados</h4>
          <div className="candidaturas-lista">
            {candidaturas.filter(c => c.status === 'PENDENTE').map(cand => (
              <div key={cand.$id} className="candidatura-item">
                <div className="candidatura-info">
                  <span className="candidatura-nome">{cand.perfilProfissional.nome}</span>
                  <div className="candidatura-nota">
                    <Star size={14} fill="var(--cor-texto)" />
                    <span>{cand.perfilProfissional.mediaAvaliacoes || 'Novo'}</span>
                  </div>
                  {Number.isFinite(Number(cand.valorProposto)) ? (
                    <div className="candidatura-valor">
                      <BadgeDollarSign size={16} />
                      <span>R$ {Number(cand.valorProposto).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  ) : null}
                  <button type="button" onClick={() => navigate(`/perfil?uid=${encodeURIComponent(cand.profissionalId)}`)} className="candidatura-link">
                    Ver perfil
                  </button>
                </div>
                <button className="botao-icone botao-sucesso" onClick={() => lidarComAceite(cand.$id, cand.profissionalId)} disabled={carregandoAcao}>
                  <CheckCircle size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalContrapropostaAberto && (
        <ModalContraproposta
          aoFechar={() => definirModalContrapropostaAberto(false)}
          valorEstimado={proposta.valorEstimado}
          aoConfirmar={async (valor) => {
            definirModalContrapropostaAberto(false);
            await lidarComCandidatura(valor);
          }}
        />
      )}

      {modalAvaliarAberto && (
        <ModalAvaliar 
          aoFechar={() => definirModalAvaliarAberto(false)}
          aoAvaliar={aoFinalizarAvaliacao}
          propostaId={proposta.$id}
          avaliadorId={usuarioAtual.$id}
          avaliadoId={perfilUsuario.tipoPerfil === 'USUARIO' ? proposta.profissionalAceitoId : proposta.clienteId}
          mediaAtual={
            perfilUsuario.tipoPerfil === 'USUARIO'
              ? (() => {
                  const avaliacoes = Array.isArray(perfilProfissionalAceito?.avaliacoes) ? perfilProfissionalAceito.avaliacoes : [];
                  if (!avaliacoes.length) return 0;
                  const soma = avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0);
                  return Number((soma / avaliacoes.length).toFixed(1));
                })()
              : (() => {
                  const avaliacoes = Array.isArray(perfilCliente?.avaliacoes) ? perfilCliente.avaliacoes : [];
                  if (!avaliacoes.length) return 0;
                  const soma = avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0);
                  return Number((soma / avaliacoes.length).toFixed(1));
                })()
          }
          titulo={perfilUsuario.tipoPerfil === 'USUARIO' ? 'Avaliar Profissional' : 'Avaliar Cliente'}
        />
      )}
    </div>
  );
};

export default CardProposta;