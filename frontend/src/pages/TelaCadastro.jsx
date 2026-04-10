import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cadastrarUsuario, cadastrarProfissional, login, setToken } from '../services/api';
import '../styles/pages/TelaCadastro.css';

const TelaCadastro = () => {
  const [nome, definirNome] = useState('');
  const [email, definirEmail] = useState('');
  const [senha, definirSenha] = useState('');
  const [confirmacaoSenha, definirConfirmacaoSenha] = useState('');
  const [tipoPerfil, definirTipoPerfil] = useState('USUARIO');
  const [categoria, definirCategoria] = useState('');
  const [foto, definirFoto] = useState(null);
  const [mostrarSenha, definirMostrarSenha] = useState(false);
  const [mostrarConfirmacao, definirMostrarConfirmacao] = useState(false);
  const [erro, definirErro] = useState('');
  const [mensagem, definirMensagem] = useState('');
  const [carregando, definirCarregando] = useState(false);
  const navigate = useNavigate();
  const fotoPreviewUrl = useMemo(() => (foto ? URL.createObjectURL(foto) : ''), [foto]);

  useEffect(() => {
    return () => {
      if (fotoPreviewUrl) {
        URL.revokeObjectURL(fotoPreviewUrl);
      }
    };
  }, [fotoPreviewUrl]);

  const extrairAtributoDesconhecido = (mensagemErro) => {
    const texto = String(mensagemErro || '');
    const encontrado = texto.match(/Unknown attribute:\s*"([^"]+)"/i);
    return encontrado?.[1] || '';
  };

  
  const lidarComCadastro = async (e) => {
    e.preventDefault();
    definirErro('');
    definirMensagem('');

    if (senha.length < 8) {
      definirErro('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (senha !== confirmacaoSenha) {
      definirErro('As senhas não conferem.');
      return;
    }

    if (tipoPerfil === 'PROFISSIONAL' && !categoria) {
      definirErro('Selecione a categoria do profissional.');
      return;
    }

    definirCarregando(true);

    try {
      
      const dados = {
        nome: nome.trim(),
        email: email.trim(),
        senha,
        telefone: '',
        tipoPerfil,
        categoria: tipoPerfil === 'PROFISSIONAL' ? categoria : '',
        dataCriacao: new Date().toISOString(),
      };

      let criado;
      if (tipoPerfil === 'PROFISSIONAL') {
        criado = await cadastrarProfissional(dados, foto);
      } else {
        criado = await cadastrarUsuario(dados, foto);
      }

      
      const respLogin = await login({ login: email.trim(), senha });
      const nextToken = respLogin?.token;
      if (nextToken) setToken(nextToken);
      definirMensagem('Conta criada com sucesso.');
      setTimeout(() => navigate(tipoPerfil === 'PROFISSIONAL' ? '/feed-profissional' : '/feed-cliente'), 700);
    } catch (err) {
      const msg = String(err?.message || '');
      if (/already exists|already been taken|user_already_exists/i.test(msg)) {
        definirErro('Esse e-mail já está cadastrado.');
      } else {
        definirErro(msg || 'Não foi possível criar a conta.');
      }
    } finally {
      definirCarregando(false);
    }
  };

  return (
    <div className="recipiente-cadastro">
      <div className="cartao-cadastro">
        <div className="cabecalho-cadastro">
          <img src="/banner.png" alt="Banner ConectLar" style={{ width: '200px', height: 'auto' }} />
        </div>

        <form onSubmit={lidarComCadastro} className="formulario-cadastro">
          <div className="abas-tipo-conta">
            <button
              type="button"
              className={`aba-conta ${tipoPerfil === 'USUARIO' ? 'aba-conta-ativa' : ''}`}
              onClick={() => {
                definirTipoPerfil('USUARIO');
                definirCategoria('');
              }}
            >
              Sou cliente
            </button>
            <button
              type="button"
              className={`aba-conta ${tipoPerfil === 'PROFISSIONAL' ? 'aba-conta-ativa' : ''}`}
              onClick={() => definirTipoPerfil('PROFISSIONAL')}
            >
              Sou profissional
            </button>
          </div>

          <div className="grupo-entrada-cadastro">
            <User className="icone-entrada-cadastro" size={20} />
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => definirNome(e.target.value)}
              placeholder="Nome completo"
              className="entrada-cadastro"
            />
          </div>

          <div className="grupo-entrada-cadastro">
            <Mail className="icone-entrada-cadastro" size={20} />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => definirEmail(e.target.value)}
              placeholder="E-mail"
              className="entrada-cadastro"
            />
          </div>

          <div className="grupo-entrada-cadastro grupo-entrada-arquivo">
            <User className="icone-entrada-cadastro" size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => definirFoto(e.target.files?.[0] || null)}
              className="entrada-cadastro entrada-arquivo-cadastro"
            />
            <span className="dica-arquivo-cadastro">
              {foto ? `Foto selecionada: ${foto.name}` : 'Escolha uma foto de perfil'}
            </span>
          </div>

          {foto ? (
            <div className="previa-foto-cadastro">
              <img src={fotoPreviewUrl} alt="Prévia da foto" className="imagem-previa-cadastro" />
            </div>
          ) : null}

          {tipoPerfil === 'PROFISSIONAL' && (
            <div className="grupo-entrada-cadastro">
              <Briefcase className="icone-entrada-cadastro" size={20} />
              <select
                required
                value={categoria}
                onChange={(e) => definirCategoria(e.target.value)}
                className="entrada-cadastro selecao-cadastro"
              >
                <option value="">Selecione a categoria</option>
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
          )}

          <div className="grupo-entrada-cadastro">
            <Lock className="icone-entrada-cadastro" size={20} />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={senha}
              onChange={(e) => definirSenha(e.target.value)}
              placeholder="Senha"
              className="entrada-cadastro entrada-com-alternancia"
            />
            <button
              type="button"
              onClick={() => definirMostrarSenha(!mostrarSenha)}
              className="alternar-senha-cadastro"
              aria-label="Alternar visibilidade da senha"
            >
              {mostrarSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="grupo-entrada-cadastro">
            <Lock className="icone-entrada-cadastro" size={20} />
            <input
              type={mostrarConfirmacao ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmacaoSenha}
              onChange={(e) => definirConfirmacaoSenha(e.target.value)}
              placeholder="Confirmar senha"
              className="entrada-cadastro entrada-com-alternancia"
            />
            <button
              type="button"
              onClick={() => definirMostrarConfirmacao(!mostrarConfirmacao)}
              className="alternar-senha-cadastro"
              aria-label="Alternar visibilidade da confirmação de senha"
            >
              {mostrarConfirmacao ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {erro && <p className="erro-cadastro">{erro}</p>}
          {!erro && mensagem && <p className="sucesso-cadastro">{mensagem}</p>}

          <button
            type="submit"
            disabled={carregando || !nome.trim() || !email.trim() || !senha || !confirmacaoSenha || (tipoPerfil === 'PROFISSIONAL' && !categoria)}
            className="botao-cadastro"
          >
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <div className="rodape-cadastro">
          Já tem conta? <a href="/login" className="link-cadastro">Entrar</a>
        </div>
      </div>
    </div>
  );
};

export default TelaCadastro;