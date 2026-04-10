import React, { useState } from 'react';
import '../styles/components/DadosPessoaisForm.css';

const DadosPessoaisForm = ({ onSave }) => {
  const [telefone, setTelefone] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [audio, setAudio] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      if (onSave) {
        await onSave({ telefone, localizacao, audio });
      }
    } catch (err) {
      setErro('Erro ao salvar.');
    } finally {
      setSalvando(false);
    }
  };
  
  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    setAudio(file);
    if (file) {
      setAudioPreview(URL.createObjectURL(file));
    } else {
      setAudioPreview(null);
    }
  };

  return (
    <div className="container-dados">
      <h2 className="titulo-secao">Dados Pessoais</h2>
      <form onSubmit={handleSubmit} className="formulario">
        
        <div className="grupo-input">
          <label className="label-padrao">Telefone / WhatsApp</label>
          <div className="campo-com-icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-input">
              <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
            </svg>
            <input
              className="input-padrao"
              placeholder="(00) 00000-0000"
              type="tel"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
            />
          </div>
        </div>

        <div className="grupo-input">
          <label className="label-padrao">Localização (Bairro, Cidade)</label>
          <div className="campo-com-icone">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icone-input">
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <input
              className="input-padrao"
              placeholder="Ex: Centro, São Paulo"
              type="text"
              value={localizacao}
              onChange={e => setLocalizacao(e.target.value)}
            />
          </div>
        </div>

        <div className="grupo-input">
          <label className="label-padrao">Enviar áudio</label>
          <div className="campo-arquivo">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioChange}
              className="input-arquivo"
            />
            {audioPreview && (
              <audio controls src={audioPreview} className="preview-audio" />
            )}
          </div>
        </div>

        {erro && <p className="mensagem-erro">{erro}</p>}

        <button type="submit" className="botao-salvar" disabled={salvando || !telefone || !localizacao}>
          {salvando ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
};

export default DadosPessoaisForm;