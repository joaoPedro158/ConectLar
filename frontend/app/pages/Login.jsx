import React, { useState } from "react";
import { Briefcase, Smartphone, Globe, Zap, LogIn } from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/Login.css";

export function Login() {
  const { temaEscuro } = useTemaEscuro();
  const [modoTela, setModoTela] = useState("login"); // "login" | "cadastro" | "esqueci"

  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");

  const [nomeCadastro, setNomeCadastro] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [telefoneCadastro, setTelefoneCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");

  const [emailRecuperacao, setEmailRecuperacao] = useState("");

  const confirmarLogin = (e) => {
    e.preventDefault();
    console.log("A iniciar sessão com:", identificador, senha);
  };

  const confirmarCadastro = (e) => {
    e.preventDefault();
    console.log("A registar:", { nomeCadastro, emailCadastro, telefoneCadastro, senhaCadastro });
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
              <p className="bento-texto">Tudo na App</p>
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