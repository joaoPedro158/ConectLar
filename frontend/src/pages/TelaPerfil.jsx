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
import React, { useRef, useState, useEffect } from 'react';
import { User, Phone, MapPin, LogOut, Star, CheckCircle, ImagePlus, Trash2 } from 'lucide-react';
import { getToken, getMe, atualizarPerfil, apiRequest } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BarraNavegacao from '../components/NavBar';
import IndicadorCarregamento from '../components/IndicadorCarregamento';
import '../styles/pages/TelaPerfil.css';
import { usarAutenticacao } from '../context/AuthContext';

const TelaPerfil = () => {
  const { sair } = usarAutenticacao();
  const [usuarioAtual, definirUsuarioAtual] = useState(null);
  const [perfilUsuario, definirPerfilUsuario] = useState(null);
  const [perfilVisualizado, definirPerfilVisualizado] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [salvando, definirSalvando] = useState(false);
  const [mensagem, definirMensagem] = useState('');
  const [enviandoFoto, definirEnviandoFoto] = useState(false);
  const inputFotoRef = useRef(null);
  const inputPortfolioRef = useRef(null);
  const [enviandoPortfolio, definirEnviandoPortfolio] = useState(false);
  const [portfolioFileIds, definirPortfolioFileIds] = useState([]);
  
  const [formulario, definirFormulario] = useState({
    nome: '',
    email: '',
    telefone: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  const [parametrosBusca] = useSearchParams();
  const navegar = useNavigate();

  const uid = parametrosBusca.get('uid');

  const extrairAtributoDesconhecido = (mensagemErro) => {
    const texto = String(mensagemErro || '');
    const encontrado = texto.match(/Unknown attribute:\s*"([^"]+)"/i);
    return encontrado?.[1] || '';
  };

  const atualizarPerfilComRetry = async ({ dataBase, maxTentativas = 3 }) => {
    const data = { ...dataBase };
    const token = getToken();
    const tipo = perfilUsuario?.tipoPerfil === 'PROFISSIONAL' ? 'PROFISSIONAL' : 'USUARIO';
    for (let tentativa = 1; tentativa <= maxTentativas; tentativa += 1) {
      try {
        return await atualizarPerfil({ tipoPerfil: tipo, token, patch: data }, null);
      } catch (err) {
        const atributo = extrairAtributoDesconhecido(err?.message);
        if (atributo && Object.prototype.hasOwnProperty.call(data, atributo)) {
          delete data[atributo];
          continue;
        }
        throw err;
      }
    }
    throw new Error('Não foi possível atualizar o perfil.');
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      definirCarregando(true);
      const token = getToken();
      let usuarioLogado = null;
      if (token) {
        const me = await getMe(token);
        usuarioLogado = me?.usuario || null;
      }
      definirUsuarioAtual(usuarioLogado);

      const idPerfil = uid || usuarioLogado?.$id || usuarioLogado?.id;
      let perfil = null;
      if (!uid || (usuarioLogado && String(idPerfil) === String(usuarioLogado.$id || usuarioLogado.id))) {
        perfil = usuarioLogado;
      } else {
        const lista = await apiRequest('/usuario/list', { method: 'GET' });
        const docs = Array.isArray(lista) ? lista : (lista?.documents || lista || []);
        perfil = docs.find((d) => String(d.$id || d.id) === String(idPerfil)) || null;
      }

      definirPerfilUsuario(perfil);
      definirPerfilVisualizado(perfil);

      try {
        const bruto = perfil?.portfolioFileIds;
        const arrayIds = bruto ? JSON.parse(bruto) : [];
        definirPortfolioFileIds(Array.isArray(arrayIds) ? arrayIds.filter(Boolean) : []);
      } catch {
        definirPortfolioFileIds([]);
      }

      definirFormulario({
        nome: perfil?.nome || usuarioLogado?.name || '',
        email: perfil?.email || usuarioLogado?.email || '',
        telefone: perfil?.telefone || '',
        logradouro: perfil?.logradouro || '',
        numero: perfil?.numero || '',
        bairro: perfil?.bairro || '',
        cidade: perfil?.cidade || '',
        estado: perfil?.estado || '',
        cep: perfil?.cep || '',
      });
    } catch (err) {
      navegar('/login');
    } finally {
      definirCarregando(false);
    }
  };

  const modoLeitura = !!uid && uid !== usuarioAtual?.$id;

  const lidarComSubmit = async (e) => {
    e.preventDefault();
    if (modoLeitura) return;
    definirSalvando(true);
    definirMensagem('');

    try {
      await atualizarPerfilComRetry({
        dataBase: {
          nome: formulario.nome,
          email: formulario.email,
          telefone: formulario.telefone,
          logradouro: formulario.logradouro,
          numero: formulario.numero,
          bairro: formulario.bairro,
          cidade: formulario.cidade,
          estado: formulario.estado,
          cep: formulario.cep,
        }
      });
      definirMensagem('Perfil atualizado com sucesso!');
      setTimeout(() => definirMensagem(''), 3000);
    } catch (err) {
      definirMensagem('Erro ao atualizar. Tente novamente.');
    } finally {
      definirSalvando(false);
    }
  };

  const sairDaConta = async () => {
    try {
      await sair();
      navegar('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const lidarComTrocaFoto = async (arquivo) => {
    if (!arquivo || !usuarioAtual || !perfilUsuario) return;
    if (modoLeitura) return;

    definirEnviandoFoto(true);
    definirMensagem('');

    try {
      const token = getToken();
      const tipo = perfilUsuario?.tipoPerfil === 'PROFISSIONAL' ? 'PROFISSIONAL' : 'USUARIO';
      const atualizado = await atualizarPerfil({ tipoPerfil: tipo, token, patch: {} }, arquivo);

      if (atualizado) {
        definirPerfilUsuario(atualizado);
        definirPerfilVisualizado(atualizado);
        definirMensagem('Foto atualizada com sucesso!');
        setTimeout(() => definirMensagem(''), 2500);
      } else {
        definirMensagem('Erro ao salvar foto no banco de dados.');
      }
    } catch (err) {
      definirMensagem('Erro ao atualizar foto. Tente novamente.');
    } finally {
      definirEnviandoFoto(false);
      if (inputFotoRef.current) inputFotoRef.current.value = '';
    }
  };

  const obterUrlPortfolio = (fileId) => {
    try {
      return `/upload/${fileId}`;
    } catch {
      return '';
    }
  };

  const salvarPortfolioNoPerfil = async (ids) => {
    await atualizarPerfilComRetry({
      dataBase: {
        portfolioFileIds: JSON.stringify(ids)
      }
    });
    definirPerfilVisualizado((prev) => ({ ...prev, portfolioFileIds: JSON.stringify(ids) }));
  };

  const lidarComUploadPortfolio = async (arquivos) => {
    // Portfolio upload requires a dedicated backend endpoint to accept
    // multiple files and return stored identifiers. The current REST API
    // supports profile photo upload via `atualizarPerfil`, but does not
    // provide a public upload endpoint for arbitrary portfolio files.
    // To proceed we need an endpoint like POST /upload that returns file ids.
    definirMensagem('Upload de portfólio não suportado sem endpoint de upload no servidor.');
  };

  const lidarComRemoverPortfolio = async (fileId) => {
    if (modoLeitura) return;
    if (!fileId || !perfilUsuario) return;

    definirEnviandoPortfolio(true);
    definirMensagem('');
    try {
      const atualizado = portfolioFileIds.filter((id) => id !== fileId);
      definirPortfolioFileIds(atualizado);
      await salvarPortfolioNoPerfil(atualizado);
    } catch (err) {
      definirMensagem('Erro ao remover foto do portfólio.');
    } finally {
      definirEnviandoPortfolio(false);
    }
  };

  if (carregando || !usuarioAtual || !perfilUsuario || !perfilVisualizado) {
    return (
      <div className="recipiente-carregamento-perfil">
        <IndicadorCarregamento />
      </div>
    );
  }

  return (
    <div className="recipiente-tela-perfil animacao-esmaecer">
      
      <div className="cabecalho-tela-perfil">
        <h1 className="titulo-tela-perfil">{modoLeitura ? 'Perfil do Usuário' : 'Meu Perfil'}</h1>
      </div>

      <div className="cartao-perfil-destaque">
        <div
          className={`avatar-perfil-container ${!modoLeitura && !enviandoFoto ? 'avatar-perfil-clicavel' : 'avatar-perfil-desabilitado'} ${enviandoFoto ? 'avatar-perfil-carregando' : ''}`}
          role="button"
          tabIndex={0}
          title="Trocar foto"
          onClick={() => {
            if (!modoLeitura) inputFotoRef.current?.click();
          }}
          onKeyDown={(e) => {
            if (!modoLeitura && (e.key === 'Enter' || e.key === ' ')) inputFotoRef.current?.click();
          }}
        >
          {perfilVisualizado.foto ? (
            <img src={perfilVisualizado.foto} alt="Foto de perfil" className="imagem-avatar-perfil" />
          ) : (
            <User size={48} className="icone-avatar-padrao" />
          )}

          {!modoLeitura ? (
            <input
              ref={inputFotoRef}
              type="file"
              accept="image/*"
              className="entrada-arquivo-oculta"
              disabled={enviandoFoto}
              onChange={(e) => lidarComTrocaFoto(e.target.files?.[0])}
            />
          ) : null}
        </div>
        
        <div className="informacoes-principais-perfil">
          <div className="linha-nome-email">
            <h2 className="texto-nome-perfil">{modoLeitura ? (perfilVisualizado.nome || 'Usuário') : usuarioAtual.name}</h2>
            <span className="texto-email-perfil">{modoLeitura ? (perfilVisualizado.email || '') : usuarioAtual.email}</span>
          </div>
          
          <div className="detalhes-contato-perfil">
            <div className="item-contato-perfil">
              <Phone size={16} className="icone-contato-perfil" />
              <span>{perfilVisualizado.telefone || 'Não informado'}</span>
            </div>
            <div className="item-contato-perfil">
              <MapPin size={16} className="icone-contato-perfil" />
              <span>{perfilVisualizado.localizacao || 'Não informado'}</span>
            </div>
          </div>

          {perfilVisualizado.tipoPerfil === 'PROFISSIONAL' && (
            <div className="selo-profissional-perfil">
              <span className="categoria-profissional-perfil" title="Profissão não pode ser alterada">
                {perfilVisualizado.categoria || 'Profissão não definida'}
              </span>
              <div className="nota-profissional-perfil">
                <Star size={16} fill="currentColor" />
                {(() => {
                  const avaliacoes = Array.isArray(perfilVisualizado.avaliacoes) ? perfilVisualizado.avaliacoes : [];
                  if (!avaliacoes.length) return '0.0';
                  const soma = avaliacoes.reduce((acc, a) => acc + (a.nota || 0), 0);
                  const media = soma / avaliacoes.length;
                  return media.toFixed(1);
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {perfilVisualizado.tipoPerfil === 'PROFISSIONAL' ? (
        <div className="secao-cartao-perfil">
          <div className="cabecalho-secao-perfil">
            <h3 className="titulo-secao-perfil">Trabalhos Anteriores</h3>

            {!modoLeitura ? (
              <button
                type="button"
                className="botao-adicionar-portfolio"
                onClick={() => inputPortfolioRef.current?.click()}
                disabled={enviandoPortfolio}
                aria-label="Adicionar fotos ao portfólio"
                title="Adicionar fotos ao portfólio"
              >
                {enviandoPortfolio ? (
                  <IndicadorCarregamento tamanho={20} />
                ) : (
                  <ImagePlus size={20} />
                )}
              </button>
            ) : null}
          </div>

          {!modoLeitura ? (
            <input
              ref={inputPortfolioRef}
              type="file"
              accept="image/*"
              multiple
              className="entrada-arquivo-oculta"
              disabled={enviandoPortfolio}
              onChange={(e) => lidarComUploadPortfolio(e.target.files)}
            />
          ) : null}

          {portfolioFileIds.length === 0 ? (
            <div className="estado-vazio-portfolio">
              {modoLeitura
                ? 'Este profissional ainda não adicionou fotos no portfólio.'
                : 'Adicione fotos de trabalhos anteriores para passar mais confiança aos clientes.'}
            </div>
          ) : (
            <div className="grade-portfolio">
              {portfolioFileIds.map((fileId) => {
                const url = obterUrlPortfolio(fileId);
                return (
                  <div key={fileId} className="item-portfolio">
                    {url ? (
                      <img src={url} alt="Trabalho anterior" className="imagem-portfolio" />
                    ) : (
                      <div className="marcador-imagem-portfolio">Imagem</div>
                    )}

                    {!modoLeitura ? (
                      <button
                        type="button"
                        className="botao-remover-portfolio"
                        onClick={() => lidarComRemoverPortfolio(fileId)}
                        disabled={enviandoPortfolio}
                        aria-label="Remover foto"
                        title="Remover foto"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {!modoLeitura ? (
        <div className="secao-cartao-perfil">
          <h3 className="titulo-secao-perfil titulo-secao-espacado">Dados Pessoais</h3>

          <form onSubmit={lidarComSubmit} className="formulario-dados-perfil">
            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Nome</label>
              <div className="campo-com-icone-perfil">
                <User size={20} className="icone-campo-perfil" />
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="Nome completo"
                  value={formulario.nome}
                  onChange={e => definirFormulario({ ...formulario, nome: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">E-mail</label>
              <div className="campo-com-icone-perfil">
                <User size={20} className="icone-campo-perfil" />
                <input
                  type="email"
                  className="entrada-texto-perfil"
                  placeholder="E-mail"
                  value={formulario.email}
                  onChange={e => definirFormulario({ ...formulario, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Telefone / WhatsApp</label>
              <div className="campo-com-icone-perfil">
                <Phone size={20} className="icone-campo-perfil" />
                <input 
                  type="tel" 
                  className="entrada-texto-perfil" 
                  placeholder="(00) 00000-0000"
                  value={mascaraTelefone(formulario.telefone)}
                  onChange={e => definirFormulario({ ...formulario, telefone: e.target.value })}
                  maxLength={15}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Logradouro</label>
              <div className="campo-com-icone-perfil">
                <MapPin size={20} className="icone-campo-perfil" />
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="Rua, Avenida, etc."
                  value={formulario.logradouro}
                  onChange={e => definirFormulario({ ...formulario, logradouro: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Número</label>
              <div className="campo-com-icone-perfil">
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="Número"
                  value={formulario.numero}
                  onChange={e => definirFormulario({ ...formulario, numero: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Bairro</label>
              <div className="campo-com-icone-perfil">
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="Bairro"
                  value={formulario.bairro}
                  onChange={e => definirFormulario({ ...formulario, bairro: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Cidade</label>
              <div className="campo-com-icone-perfil">
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="Cidade"
                  value={formulario.cidade}
                  onChange={e => definirFormulario({ ...formulario, cidade: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Estado</label>
              <div className="campo-com-icone-perfil">
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="Estado"
                  value={formulario.estado}
                  onChange={e => definirFormulario({ ...formulario, estado: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">CEP</label>
              <div className="campo-com-icone-perfil">
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="CEP"
                  value={formulario.cep}
                  onChange={e => definirFormulario({ ...formulario, cep: e.target.value })}
                />
              </div>
            </div>

            <div className="grupo-entrada-perfil">
              <label className="rotulo-entrada-perfil">Valor (R$)</label>
              <div className="campo-com-icone-perfil">
                <input
                  type="text"
                  className="entrada-texto-perfil"
                  placeholder="0,00"
                  value={mascaraMoeda(formulario.valor || '')}
                  onChange={e => definirFormulario({ ...formulario, valor: e.target.value })}
                  inputMode="decimal"
                />
              </div>
            </div>

            {/* Campo profissão/categoria não editável */}
            {perfilUsuario?.tipoPerfil === 'PROFISSIONAL' && (
              <div className="grupo-entrada-perfil">
                <label className="rotulo-entrada-perfil">Profissão</label>
                <div className="campo-com-icone-perfil">
                  <User size={20} className="icone-campo-perfil" />
                  <input
                    type="text"
                    className="entrada-texto-perfil"
                    value={perfilUsuario.categoria || 'Profissão não definida'}
                    disabled
                    readOnly
                  />
                </div>
                <span className="aviso-campo-nao-editavel">Este campo não pode ser alterado.</span>
              </div>
            )}

            {mensagem && (
              <div className={`mensagem-alerta-perfil ${mensagem.includes('Erro') ? 'mensagem-erro-perfil' : 'mensagem-sucesso-perfil'}`}>
                {!mensagem.includes('Erro') && <CheckCircle size={18} />}
                {mensagem}
              </div>
            )}

            <button 
              type="submit" 
              className="botao-salvar-perfil"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>
        </div>
      ) : null}

      {!modoLeitura ? (
        <button 
          className="botao-sair-conta-perfil"
          onClick={sairDaConta}
        >
          <LogOut size={20} />
          Sair da Conta
        </button>
      ) : null}

      <BarraNavegacao tipoPerfil={perfilUsuario?.tipoPerfil} />
    </div>
  );
};

export default TelaPerfil;