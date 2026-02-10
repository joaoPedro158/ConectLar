import { useState, useEffect } from 'react';
import { requisicao, authService } from '../services/api';
import { HeaderProfissional } from '../components/HeaderProfissional';
import '../css/pages/PerfilTrabalhador.css';

export default function PerfilTrabalhador() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    login: '',
    senha: '',
    cep: '',
    rua: '',
    bairro: '',
    numero: '',
    estado: '',
    cidade: '',
    complemento: ''
  });
  const [fotoPreview, setFotoPreview] = useState('/assets/avatar-padrao.png');
  const [fotoArquivo, setFotoArquivo] = useState(null);
  const [historicoCont, setHistoricoCont] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

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

  const formatarCep = (valor) => {
    if (!valor) return '';
    const digitos = valor.replace(/\D/g, '').slice(0, 8);
    if (digitos.length <= 5) return digitos;
    return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  };

  const buscarCep = async (cepLimpo) => {
    try {
      const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!resp.ok) return;
      const data = await resp.json();
      if (data.erro) return;
      setFormData((prev) => ({
        ...prev,
        cep: formatarCep(cepLimpo),
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
      }));
    } catch (e) {
      console.error('Erro ao buscar CEP via ViaCEP', e);
    }
  };

  const resolverSrcFoto = (foto) => {
    if (!foto) return '/assets/avatar-padrao.png';
    if (foto.startsWith('http://') || foto.startsWith('https://') || foto.startsWith('/')) return foto;
    return `/upload/${foto}`;
  };

  const carregarDados = async () => {
    try {
      const info = authService.getUserInfo();

      let profissionalAtual = null;
      if (info?.id) {
        const listaProf = await requisicao('/profissional/list', 'GET');
        if (Array.isArray(listaProf)) {
          profissionalAtual = listaProf.find((p) => p.id === info.id) || null;
        }
      }

      if (profissionalAtual) {
        const loc = profissionalAtual.localizacao || {};

        setFormData((prev) => ({
          ...prev,
          nome: profissionalAtual.nome || '',
          telefone: profissionalAtual.telefone || prev.telefone || '',
          login: profissionalAtual.email || info?.email || prev.login,
          cep: loc.cep ? formatarCep(loc.cep) : prev.cep || '',
          rua: loc.rua || prev.rua || '',
          bairro: loc.bairro || prev.bairro || '',
          numero: loc.numero || prev.numero || '',
          estado: loc.estado || prev.estado || '',
          cidade: loc.cidade || prev.cidade || '',
          complemento: loc.complemento || prev.complemento || ''
        }));

        if (profissionalAtual.fotoPerfil) {
          const srcFoto = resolverSrcFoto(profissionalAtual.fotoPerfil);
          setFotoPreview(srcFoto);
          localStorage.setItem('usuario_foto', profissionalAtual.fotoPerfil);
        }

        if (profissionalAtual.nome) {
          localStorage.setItem('usuario_nome', profissionalAtual.nome);
        }
      } else if (info) {
        setFormData((prev) => ({
          ...prev,
          login: info.email || prev.login
        }));
      }

      const histProf = await requisicao('/profissional/historico', 'GET');
      setHistoricoCont(histProf?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'telefone') {
      const mascarado = formatarTelefone(value);
      setFormData(prev => ({ ...prev, [name]: mascarado }));
    } else if (name === 'cep') {
      const mascarado = formatarCep(value);
      setFormData(prev => ({ ...prev, [name]: mascarado }));
      const digitos = value.replace(/\D/g, '');
      if (digitos.length === 8) {
        buscarCep(digitos);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setFotoArquivo(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosAtualizados = {
        nome: formData.nome,
        email: formData.login,
        telefone: formData.telefone,
        senha: formData.senha || null,
        localizacao: {
          rua: formData.rua || null,
          bairro: formData.bairro || null,
          numero: formData.numero || null,
          cidade: formData.cidade || null,
          cep: formData.cep || null,
          estado: formData.estado || null,
          complemento: formData.complemento || null
        },
        categoria: null,
        role: 'PROFISSIONAL'
      };

      const payload = new FormData();
      payload.append('dados', new Blob([JSON.stringify(dadosAtualizados)], { type: 'application/json' }));
      if (fotoArquivo) {
        payload.append('arquivo', fotoArquivo);
      }

      await requisicao('/profissional/update', 'PUT', payload, true);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil: ' + error.message);
    }
  };

  return (
    <>
      <HeaderProfissional historicoCont={historicoCont} />

      <main className="container-principal">
        <section className="painel-conteudo">
          <h1 className="titulo-sessao">Meu Perfil</h1>

          <form onSubmit={handleSubmit} className="form-perfil">
            <div className="perfil-topo">
              <div className="perfil-avatar-container">
                <div className="foto-perfil-wrapper">
                  <img src={fotoPreview} alt="Foto de Perfil" className="img-preview" />
                  <label className="btn-trocar-foto">
                    <img src="/assets/camera-padrao.png" alt="Ícone de Câmera" />
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                  </label>
                </div>
                <div className="badge-tipo">Profissional</div>
              </div>
            </div>

            <div className="grid-perfil">
              <div className="form-grupo">
                <label>Nome Completo</label>
                <input
                  type="text"
                  name="nome"
                  className="campinho-texto"
                  value={formData.nome}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-grupo">
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  className="campinho-texto"
                  value={formData.telefone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="form-grupo">
                <label>E-mail (Login)</label>
                <input
                  type="email"
                  name="login"
                  className="campinho-texto readonly"
                  value={formData.login}
                  readOnly
                />
              </div>

              <div className="form-grupo">
                <label>Nova Senha (deixe em branco para manter)</label>
                <input
                  type="password"
                  name="senha"
                  className="campinho-texto"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="********"
                />
              </div>

              <div className="form-grupo">
                <label>CEP</label>
                <input
                  type="text"
                  name="cep"
                  className="campinho-texto"
                  value={formData.cep}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grupo">
                <label>Rua</label>
                <input
                  type="text"
                  name="rua"
                  className="campinho-texto"
                  value={formData.rua}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grupo">
                <label>Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  className="campinho-texto"
                  value={formData.bairro}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grupo-flex">
                <div className="form-grupo">
                  <label>Número</label>
                  <input
                    type="text"
                    name="numero"
                    className="campinho-texto"
                    value={formData.numero}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-grupo">
                  <label>Estado (UF)</label>
                  <input
                    type="text"
                    name="estado"
                    className="campinho-texto"
                    value={formData.estado}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-grupo">
                <label>Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  className="campinho-texto"
                  value={formData.cidade}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grupo">
                <label>Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  className="campinho-texto"
                  value={formData.complemento}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button type="submit" className="botaozao-roxo">Salvar Alterações</button>
          </form>
        </section>
      </main>
    </>
  );
}
