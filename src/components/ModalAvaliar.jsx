import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { bancoDeDados, ID, ID_DO_BANCO, ID_COLECAO_AVALIACOES, ID_COLECAO_USUARIOS } from '../services/appwrite';
import PainelInferior from './PainelInferior';
import '../styles/components/ModalAvaliar.css';

const ModalAvaliar = ({
  aoFechar,
  aoAvaliar,
  propostaId,
  avaliadorId,
  avaliadoId,
  clienteId,
  profissionalId,
  mediaAtual,
  titulo = 'Avaliar'
}) => {
  const [nota, definirNota] = useState(0);
  const [hover, definirHover] = useState(0);
  const [comentario, definirComentario] = useState('');
  const [carregando, definirCarregando] = useState(false);
  const [erro, definirErro] = useState('');

  const idAvaliador = avaliadorId ?? clienteId;
  const idAvaliado = avaliadoId ?? profissionalId;

  const lidarComSubmit = async (e) => {
    e.preventDefault();
    if (nota === 0) {
      definirErro('Por favor, selecione uma nota.');
      return;
    }

    definirCarregando(true);
    definirErro('');

    try {
      await bancoDeDados.createDocument(
        ID_DO_BANCO,
        ID_COLECAO_AVALIACOES,
        ID.unique(),
        {
          propostaId,
          clienteId: idAvaliador,
          profissionalId: idAvaliado,
          nota,
          comentario,
          dataAvaliacao: new Date().toISOString()
        }
      );

      const novaMedia = mediaAtual === 0 ? nota : (mediaAtual + nota) / 2;

      await bancoDeDados.updateDocument(
        ID_DO_BANCO,
        ID_COLECAO_USUARIOS,
        idAvaliado,
        {
          mediaAvaliacoes: parseFloat(novaMedia.toFixed(1))
        }
      );

      aoAvaliar();
    } catch (err) {
      definirErro('Erro ao registrar avaliação.');
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <PainelInferior aoFechar={aoFechar} ariaLabel={titulo}>
      <div className="cabecalho-modal-avaliar">
        <h2 className="titulo-modal-avaliar">{titulo}</h2>
        <button onClick={aoFechar} className="botao-fechar-modal">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={lidarComSubmit} className="formulario-avaliar">
        <div className="container-estrelas">
          {[1, 2, 3, 4, 5].map((estrela) => (
            <button
              type="button"
              key={estrela}
              onClick={() => definirNota(estrela)}
              onMouseEnter={() => definirHover(estrela)}
              onMouseLeave={() => definirHover(nota)}
              className="botao-estrela"
            >
              <Star
                size={36}
                fill={estrela <= (hover || nota) ? 'var(--cor-texto-principal)' : 'transparent'}
                color={estrela <= (hover || nota) ? 'var(--cor-texto-principal)' : 'var(--cor-texto-secundario)'}
              />
            </button>
          ))}
        </div>

        <div className="grupo-input-avaliar">
          <label className="label-avaliar">Comentário (Opcional)</label>
          <textarea
            className="input-area-avaliar"
            rows="3"
            placeholder="Como foi o serviço?"
            value={comentario}
            onChange={e => definirComentario(e.target.value)}
          />
        </div>

        {erro && <p className="texto-erro-avaliar">{erro}</p>}

        <button
          type="submit"
          className="botao-primario-avaliar"
          disabled={carregando}
        >
          {carregando ? 'Enviando...' : 'Confirmar Avaliação'}
        </button>
      </form>
    </PainelInferior>
  );
};

export default ModalAvaliar;