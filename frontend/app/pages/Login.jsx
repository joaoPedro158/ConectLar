import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Smartphone, Globe, Zap, LogIn, Camera } from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import { useAuth } from "../context/ContextoAutenticacao";
import api from "../services/api";
import "../styles/pages/Login.css";
import { Abas, AbasLista, AbasGatilho } from "../components/ui/Abas";

export function Login() {
  const { temaEscuro } = useTemaEscuro();
  const { login, usuario } = useAuth();
  const navigate = useNavigate();
  const [modoTela, setModoTela] = useState("login"); // "login" | "cadastro" | "esqueci"
  const [mensagemCadastro, setMensagemCadastro] = useState("");

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [erroLogin, setErroLogin] = useState("");

  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [telefoneCadastro, setTelefoneCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [categoriaProfissional, setCategoriaProfissional] = useState("");
  const [tipoCadastro, setTipoCadastro] = useState("USUARIO");
  const [fotoArquivo, setFotoArquivo] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);

  // Enum de funções para profissionais
  const ENUM_FUNCOES_PROFISSIONAIS = [
    "Eletricista", "Encanador", "Pintor", "Diarista", "Faxineiro(a)", "Montador de Móveis", "Pedreiro", "Gesseiro", "Jardineiro", "Paisagista", "Chaveiro", "Vidraceiro", "Marceneiro", "Passadeira", "Zelador", "Bombeiro Hidráulico", "Cuidador de Animais", "Capinador", "Limpeza de Estofados", "Ajudante de Obras", "Montador de Estruturas", "Instalador de Antena", "Reparador de Eletrodomésticos", "Pintor Automotivo", "Lavador de Carros", "Serralheiro", "Técnico em Informática", "Babá", "Motorista", "Mototaxista", "Entregador"
  ];

  const lidarComFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoArquivo(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  const CATEGORIAS = [
    "Eletricista", "Encanador", "Pintor", "Diarista", "Faxineiro(a)", "Montador de Móveis", "Pedreiro", "Gesseiro", "Jardineiro", "Paisagista", "Chaveiro", "Vidraceiro", "Marceneiro", "Passadeira", "Zelador", "Bombeiro Hidráulico", "Cuidador de Animais", "Capinador", "Limpeza de Estofados", "Ajudante de Obras", "Montador de Estruturas", "Instalador de Antena", "Reparador de Eletrodomésticos", "Pintor Automotivo", "Lavador de Carros", "Serralheiro", "Técnico em Informática", "Babá", "Motorista", "Mototaxista", "Entregador"
  ];

  const CATEGORIA_ENUM_MAP = {
    "Eletricista": "ELETRICISTA",
    "Encanador": "ENCANADOR",
    "Pintor": "PINTOR",
    "Marceneiro": "MARCENEIRO",
    "Jardineiro": "JARDINEIRO",
    // Demais entram como categoria geral
  };

  const confirmarLogin = async (e) => {
    e.preventDefault();
    setErroLogin("");

    if (!identificador || !senha) {
      setErroLogin("Preencha todos os campos");
      return;
    }

    try {
      const resposta = await api.post("/auth/login", {
        login: identificador.trim(),
        senha,
      });

      const usuarioLogado = await login(resposta);
      // Redirecionamento imediato e garantido para profissional
      if (usuarioLogado?.role === "PROFISSIONAL" || usuarioLogado?.isProfissional) {
        navigate("/profissional", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      // Tenta extrair mensagem do backend ou status
      let mensagem = "Não foi possível entrar. Verifique e-mail e senha.";
      if (error?.response?.status === 403) {
        mensagem = "Usuário inexistente ou senha incorreta.";
      } else if (error?.response?.data?.message) {
        mensagem = error.response.data.message;
      }
      setErroLogin(mensagem);
    }
  };

  const confirmarCadastro = async (e) => {
    e.preventDefault();
    setMensagemCadastro("");
    console.log("A registar:", {
      nomeCadastro,
      emailCadastro,
      telefoneCadastro,
      senhaCadastro,
      tipoCadastro,
      categoriaProfissional,
    });

    if (!nomeCadastro || !emailCadastro || !senhaCadastro) {
      return;
    }

    try {
      const isProfissional = tipoCadastro === "PROFISSIONAL";
      const endpoint = isProfissional
        ? "/profissional/cadastrar"
        : "/usuario/cadastrar";

      const dadosUsuarioOuProfissional = {
        nome: nomeCadastro,
        email: emailCadastro,
        senha: senhaCadastro,
        telefone: telefoneCadastro,
        role: tipoCadastro,
        // por enquanto sem endereço detalhado
        localizacao: [],
      };

      if (isProfissional) {
        const categoriaEnum =
          CATEGORIA_ENUM_MAP[categoriaProfissional] || "GERAL";
        dadosUsuarioOuProfissional.categoria = categoriaEnum;
      }

      const formData = new FormData();
      formData.append(
        "dados",
        new Blob([JSON.stringify(dadosUsuarioOuProfissional)], {
          type: "application/json",
        })
      );

      if (fotoArquivo) {
        formData.append("arquivo", fotoArquivo);
      }

      await api.post(endpoint, formData);

      // Sempre volta para tela de login e mostra mensagem de sucesso
      setModoTela("login");
      setMensagemCadastro("Cadastro realizado com sucesso! Faça login para continuar.");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  const confirmarEsqueci = (e) => {
    e.preventDefault();
    console.log("Recuperar conta para:", emailRecuperacao);
  };

  return (
    <div className={`login-layout ${temaEscuro ? "login-layout--escuro" : ""}`}>
      <div className="login-fundo-textura" />

      <div className="login-container">
        
        {/* LADO ESQUERDO: Branding e Grid Bento Box */}
        <section className="login-hero">
          <div className="login-hero__topo">
            <div className="login-badge-raio">
              <Zap size={28} strokeWidth={3} />
            </div>
            <h1 className="login-titulo">ConectaLar</h1>
            <p className="login-subtitulo">
              A revolução dos serviços e mobilidade na sua cidade.
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-card bento-card--celular">
              <div className="bento-icone-caixa">
                <Smartphone size={28} strokeWidth={2.5} />
              </div>
              <p className="bento-texto">Tudo no
               App</p>
            </div>

            <div className="bento-card bento-card--trabalho">
              <div className="bento-icone-caixa">
                <Briefcase size={28} strokeWidth={2.5} />
              </div>
              <p className="bento-texto">Gerir Trabalhos</p>
            </div>

            <div className="bento-card bento-card--planeta">
              <div className="bento-icone-caixa">
                <Globe size={28} strokeWidth={2.5} />
              </div>
              <p className="bento-texto">Conexão Global</p>
            </div>
          </div>
        </section>

        {/* LADO DIREITO: Formulário de Acesso */}
        <section className="login-form-area">
          <div className="login-card">
            <div className="login-card__cabecalho">
              <span className="login-card__tag">
                {modoTela === "login" && "Área Restrita"}
                {modoTela === "cadastro" && "Novo por aqui?"}
                {modoTela === "esqueci" && "Recuperar acesso"}
              </span>
              <h2>
                {modoTela === "login" && "Entrar na conta"}
                {modoTela === "cadastro" && "Criar conta"}
                {modoTela === "esqueci" && "Esqueceu a palavra-passe?"}
              </h2>
              <p>
                {modoTela === "login" && "Insira os seus dados para aceder à plataforma."}
                {modoTela === "cadastro" && "Preencha os campos para começar a usar o ConectaLar."}
                {modoTela === "esqueci" && "Vamos enviar um link de recuperação para o seu e-mail."}
              </p>
            </div>

            {modoTela === "login" && (
              <form className="login-passo" onSubmit={confirmarLogin}>
                {mensagemCadastro && (
                  <div className="login-sucesso-msg">{mensagemCadastro}</div>
                )}
                <div className="login-grupo">
                  <label>E-mail ou Telefone</label>
                  <input
                    type="text"
                    placeholder="o-seu@email.com ou (00) 00000-0000"
                    value={identificador}
                    onChange={(e) => setIdentificador(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>

                <div className="login-grupo">
                  <div className="login-grupo-senha-header">
                    <label>Palavra-passe</label>
                    <button
                      type="button"
                      className="login-link-esqueceu"
                      onClick={() => setModoTela("esqueci")}
                    >
                      Esqueceu a palavra-passe?
                    </button>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>

                {erroLogin && <div className="login-erro-msg">{erroLogin}</div>}

                <button type="submit" className="login-btn login-btn--ciano">
                  Entrar <LogIn size={18} strokeWidth={3} />
                </button>

                <div className="login-rodape">
                  <p>Ainda não tem uma conta?</p>
                  <button
                    type="button"
                    className="login-btn-cadastrar"
                    onClick={() => setModoTela("cadastro")}
                  >
                    Registe-se agora
                  </button>
                </div>
              </form>
            )}

            {modoTela === "cadastro" && (
              <form className="login-passo" onSubmit={confirmarCadastro}>
                <div className="login-grupo">
                  <label>Tipo de conta</label>
                  <Abas value={tipoCadastro} onValueChange={setTipoCadastro} style={{ marginTop: 8 }}>
                    <AbasLista style={{ minWidth: 260, height: 48 }}>
                      <AbasGatilho value="USUARIO" style={{ fontSize: 18, padding: '0.5rem 2.5rem', height: 44 }}>Cliente</AbasGatilho>
                      <AbasGatilho value="PROFISSIONAL" style={{ fontSize: 18, padding: '0.5rem 2.5rem', height: 44 }}>Profissional</AbasGatilho>
                    </AbasLista>
                  </Abas>
                </div>
                {/* Campo de foto de perfil estilo WhatsApp */}
                <div className="login-grupo-foto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
                  <label htmlFor="upload-foto" style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}>
                    <span style={{
                      display: 'inline-block',
                      width: 88,
                      height: 88,
                      borderRadius: '50%',
                      background: '#e5e7eb',
                      border: '2.5px solid #22d3ee',
                      boxShadow: '2px 2px 0 #000',
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      {fotoPreview ? (
                        <img src={fotoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      ) : (
                        <Camera size={38} style={{ color: '#a3a3a3', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                      )}
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: '#22d3ee',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '1px 1px 0 #000',
                      }}>
                        <Camera size={18} style={{ color: '#000' }} />
                      </span>
                    </span>
                    <input
                      id="upload-foto"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={lidarComFoto}
                    />
                  </label>
                  <span className="foto-upload-texto" style={{ marginTop: 8, color: '#22d3ee', fontWeight: 600 }}>Adicionar foto</span>
                </div>
                <div className="login-grupo">
                  <label>Nome completo</label>
                  <input
                    type="text"
                    placeholder="O seu nome"
                    value={nomeCadastro}
                    onChange={(e) => setNomeCadastro(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
                <div className="login-grupo">
                  <label>E-mail</label>
                  <input
                    type="email"
                    placeholder="o-seu@email.com"
                    value={emailCadastro}
                    onChange={(e) => setEmailCadastro(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
                <div className="login-grupo">
                  <label>Telefone</label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={telefoneCadastro}
                    onChange={(e) => setTelefoneCadastro(e.target.value)}
                    className="login-input"
                  />
                </div>
                <div className="login-grupo">
                  <label>Defina uma palavra-passe</label>
                  <input
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={senhaCadastro}
                    onChange={(e) => setSenhaCadastro(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>
                {tipoCadastro === 'PROFISSIONAL' && (
                  <div className="login-grupo">
                    <label>Função Profissional</label>
                    <select
                      className="login-input"
                      value={categoriaProfissional}
                      onChange={e => setCategoriaProfissional(e.target.value)}
                      required
                    >
                      <option value="">Selecione...</option>
                      {ENUM_FUNCOES_PROFISSIONAIS.map(funcao => (
                        <option key={funcao} value={funcao}>{funcao}</option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="login-btn login-btn--ciano">
                  Criar conta
                </button>

                <div className="login-rodape">
                  <p>Já tem uma conta?</p>
                  <button
                    type="button"
                    className="login-btn-cadastrar"
                    onClick={() => setModoTela("login")}
                  >
                    Voltar para login
                  </button>
                </div>
              </form>
            )}

            {modoTela === "esqueci" && (
              <form className="login-passo" onSubmit={confirmarEsqueci}>
                <div className="login-grupo">
                  <label>E-mail de recuperação</label>
                  <input
                    type="email"
                    placeholder="Insira o e-mail da sua conta"
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    className="login-input"
                    required
                  />
                </div>

                <button type="submit" className="login-btn login-btn--ciano">
                  Enviar link de recuperação
                </button>

                <div className="login-rodape">
                  <p>Lembrou da palavra-passe?</p>
                  <button
                    type="button"
                    className="login-btn-cadastrar"
                    onClick={() => setModoTela("login")}
                  >
                    Voltar para login
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}