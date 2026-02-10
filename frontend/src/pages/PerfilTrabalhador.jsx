import { useState, useEffect } from 'react';
import { requisicao } from '../services/api';
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
  const [historicoCont, setHistoricoCont] = useState(0);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const dados = await requisicao('/usuario/meusdados', 'GET');
      if (dados) {
        setFormData(prev => ({
          ...prev,
          nome: dados.nome || '',
          telefone: dados.telefone || '',
          login: dados.login || '',
          cep: dados.endereco?.cep || '',
          rua: dados.endereco?.rua || '',
          bairro: dados.endereco?.bairro || '',
          numero: dados.endereco?.numero || '',
          estado: dados.endereco?.estado || '',
          cidade: dados.endereco?.cidade || '',
          complemento: dados.endereco?.complemento || ''
        }));
        if (dados.fotoPerfil) {
          setFotoPreview(dados.fotoPerfil);
        }
      }

      const historico = await requisicao('/usuario/historico', 'GET');
      setHistoricoCont(historico?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload imediato da foto (opcional, ou pode ser no submit)
      try {
        const payload = new FormData();
        payload.append('foto', file);
        await requisicao('/usuario/foto', 'POST', payload, true);
      } catch (error) {
        console.error('Erro ao atualizar foto:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dadosAtualizados = {
        nome: formData.nome,
        telefone: formData.telefone,
        senha: formData.senha || undefined, // Só envia se preenchido
        endereco: {
          cep: formData.cep,
          rua: formData.rua,
          bairro: formData.bairro,
          numero: formData.numero,
          estado: formData.estado,
          cidade: formData.cidade,
          complemento: formData.complemento
        }
      };

      await requisicao('/usuario/atualizar', 'PUT', dadosAtualizados);
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
