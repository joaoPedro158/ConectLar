import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requisicao, authService } from '../services/api';
import '../css/pages/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); 
  const [userType, setUserType] = useState('cliente'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    nome: '',
    telefone: '',
    rua: '',
    bairro: '',
    numero: '',
    cidade: '',
    cep: '',
    estado: '',
    complemento: '',
    categoria: 'GERAL',
    foto: null
  });

  const formatarTelefone = (valor) => {
    if (!valor) return '';
    const digitos = valor.replace(/\D/g, '').slice(0, 11);
    if (digitos.length <= 2) return digitos;
    if (digitos.length <= 6) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
    }
    if (digitos.length <= 10) {
      return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
    }
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'telefone') {
      const mascarado = formatarTelefone(value);
      setFormData(prev => ({ ...prev, [id]: mascarado }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, foto: e.target.files[0] }));
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'cadastro' : 'login');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const emailLimpo = (formData.email || '').trim();
      const data = await requisicao('/auth/login', 'POST', {
        login: emailLimpo,
        senha: formData.senha
      });

      if (data && data.token) {
        authService.setToken(data.token);
        // guarda também infos básicas decodificadas do token (igual legado)
        const info = authService.getUserInfo();
        if (info) {
          localStorage.setItem('usuario_email', info.email || emailLimpo);
          if (info.role) localStorage.setItem('usuario_role', info.role);
          if (info.id != null) localStorage.setItem('usuario_id', String(info.id));
        }

        const role = info?.role;
        if (role === 'PROFISSIONAL') {
          navigate('/feed-trabalhador');
        } else {
          navigate('/painel-cliente');
        }
      }
    } catch (err) {
      setError(err.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = userType === 'cliente' ? '/usuario/cadastrar' : '/profissional/cadastrar';

      const formDataToSend = new FormData();
      // Monta objeto de dados do usuário
      const dadosUsuario = {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        localizacao: null,
        role: userType === 'cliente' ? 'USUARIO' : 'PROFISSIONAL',
        categoria: userType === 'profissional' ? formData.categoria : undefined
      };
      formDataToSend.append('dados', new Blob([JSON.stringify(dadosUsuario)], { type: 'application/json' }));
      if (formData.foto) {
        formDataToSend.append('arquivo', formData.foto);
      }

      await requisicao(endpoint, 'POST', formDataToSend, true);

      alert('Cadastro realizado com sucesso! Faça login.');
      setMode('login');

    } catch (err) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="decoracao-fundo-1"></div>
      <div className="decoracao-fundo-2"></div>

      <div className="painel-acesso">
        <h2 className="titulo-login">ConectLar</h2>
        
        {mode === 'cadastro' && (
          <div className="secao-selecao-tipo">
            <button 
              type="button" 
              className={`botao-selecao ${userType === 'cliente' ? 'selecionado' : ''}`}
              onClick={() => setUserType('cliente')}
            >
              Sou Cliente
            </button>
            <button 
              type="button" 
              className={`botao-selecao ${userType === 'profissional' ? 'selecionado' : ''}`}
              onClick={() => setUserType('profissional')}
            >
              Sou Profissional
            </button>
          </div>
        )}

        <form onSubmit={mode === 'login' ? handleLogin : handleCadastro}>
          {error && <div className="erro">{error}</div>}

          {mode === 'cadastro' && (
            <>
              <input type="text" id="nome" placeholder="Nome Completo" className="input-dados" onChange={handleChange} required />
              <input type="text" id="telefone" placeholder="Telefone" className="input-dados" onChange={handleChange} />

              {userType === 'profissional' && (
                <select id="categoria" className="input-dados" onChange={handleChange}>
                  <option value="GERAL">Geral</option>
                  <option value="ENCANADOR">Encanador</option>
                  <option value="ELETRICISTA">Eletricista</option>
                  <option value="LIMPEZA">Limpeza</option>
                  <option value="PINTOR">Pintor</option>
                  <option value="MARCENEIRO">Marceneiro</option>
                  <option value="JARDINEIRO">Jardineiro</option>
                  <option value="MECANICO">Mecânico</option>
                </select>
              )}
              
              <div className="campo-upload-container">
                <label className="label-upload">Foto de Perfil</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="input-arquivo" />
              </div>
            </>
          )}

          <input 
            type="email" 
            id="email" 
            placeholder="E-mail" 
            className="input-dados" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            id="senha" 
            placeholder="Senha" 
            className="input-dados" 
            value={formData.senha} 
            onChange={handleChange} 
            required 
          />

          <button type="submit" className="botao-principal" disabled={loading}>
            {loading ? 'Carregando...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <p className="texto-alternar" onClick={toggleMode}>
          {mode === 'login' ? 'Não tem conta? Crie agora!' : 'Já tem conta? Faça login!'}
        </p>
      </div>
    </div>
  );
}
