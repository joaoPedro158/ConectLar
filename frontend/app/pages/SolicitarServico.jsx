import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Wrench, DollarSign, Image, Send } from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/SolicitarServico.css";

const CATEGORIAS = ["Encanador", "Eletricista", "Limpeza", "Pintor", "Marceneiro", "Jardineiro", "Mecânico", "Serviços Gerais"];

export default function SolicitarServico() {
  const navigate = useNavigate();
  const { temaEscuro } = useTemaEscuro();
  
  const [formData, setFormData] = useState({
    problema: "",
    descricao: "",
    categoria: "",
    localizacao: "Detectando localização...", // Simulação de GPS
    valor: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Proposta publicada com sucesso! Agora aguarde candidaturas.");
    navigate("/");
  };

  return (
    <div className={`solicitar-page ${temaEscuro ? "solicitar-page--escuro" : ""}`}>
      <header className="solicitar-header">
        <button onClick={() => navigate(-1)} className="btn-voltar-bruto">
          <ArrowLeft size={20} strokeWidth={3} />
        </button>
        <h1 className="solicitar-header__titulo">Novo Pedido</h1>
      </header>

      <main className="solicitar-main">
        <form onSubmit={handleSubmit} className="form-solicitar">
          
          {/* Categoria */}
          <div className="campo-grupo">
            <label className="rotulo-bruto">Qual o tipo de serviço?</label>
            <div className="grid-categorias-selecao">
              {CATEGORIAS.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({...formData, categoria: cat})}
                  className={`btn-selecao-cat ${formData.categoria === cat ? "ativo" : ""}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Problema e Descrição */}
          <div className="campo-grupo">
            <label className="rotulo-bruto">O que precisa ser resolvido?</label>
            <input 
              type="text" 
              placeholder="Ex: Torneira da cozinha vazando"
              className="input-bruto"
              required
              onChange={(e) => setFormData({...formData, problema: e.target.value})}
            />
          </div>

          <div className="campo-grupo">
            <label className="rotulo-bruto">Detalhes do problema</label>
            <textarea 
              placeholder="Descreva aqui os detalhes para o profissional..."
              className="input-bruto area-texto"
              rows="3"
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
            />
          </div>

          {/* Localização Dinâmica (Regra do Uber) */}
          <div className="campo-grupo">
            <label className="rotulo-bruto">Local do Serviço</label>
            <div className="input-icone-wrapper">
              <MapPin size={18} className="icone-input txt-fucsia" />
              <input 
                type="text" 
                value={formData.localizacao}
                className="input-bruto input-com-icone"
                readOnly
              />
            </div>
          </div>

          {/* Valor Proposto */}
          <div className="campo-grupo">
            <label className="rotulo-bruto">Quanto pretende pagar? (Opcional)</label>
            <div className="input-icone-wrapper">
              <DollarSign size={18} className="icone-input txt-lima" />
              <input 
                type="number" 
                placeholder="0,00"
                className="input-bruto input-com-icone"
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className="btn-enviar-proposta">
            Publicar Proposta <Send size={18} strokeWidth={3} />
          </button>
        </form>
      </main>
    </div>
  );
}