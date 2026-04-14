import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Navigation, Bike, Clock, User, Check, X, HandCoins } from "lucide-react";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/ConectaRide.css";

// Mock de uma corrida a tocar
const corridaPendente = {
  id: 123,
  passageiro: "Carlos Eduardo",
  avaliacao: "4.9",
  origem: "Rua das Flores, 123 - Centro",
  destino: "IFRN - Campus Nova Cruz",
  distancia: "2.5 km",
  tempo: "8 min",
  valorSugerido: 12.00,
  espera: 0,
  pacote: true
};

export function MotoristaRide() {
  const navigate = useNavigate();
  const { temaEscuro } = useTemaEscuro();
  
  const [online, setOnline] = useState(true);
  const [showContraproposta, setShowContraproposta] = useState(false);
  const [valorContraproposta, setValorContraproposta] = useState("");

  const aceitarCorrida = () => {
    alert("Corrida Aceita! Dirija-se ao local.");
    navigate("/");
  };

  const enviarContraproposta = () => {
    alert(`Contraproposta de R$ ${valorContraproposta} enviada para o cliente!`);
    setShowContraproposta(false);
  };

  return (
    <div className={`ride-layout ${temaEscuro ? "ride-layout--escuro" : ""}`}>
      {/* HEADER DO MOTORISTA */}
      <header className="ride-header ride-header--motorista">
        <div className="ride-header__topo">
          <div className="ride-header__esq">
            <button onClick={() => navigate("/")} className="btn-voltar-ride btn-voltar-ride--moto">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="ride-header__titulo txt-preto">Modo Motorista</h1>
              <p className="ride-header__sub txt-preto">ConectaRide</p>
            </div>
          </div>
          
          {/* Toggle Online/Offline */}
          <button 
            onClick={() => setOnline(!online)} 
            className={`btn-status-moto ${online ? "online" : "offline"}`}
          >
            <div className="bolinha" />
            {online ? "Online" : "Offline"}
          </button>
        </div>
      </header>

      <main className="ride-main">
        {!online ? (
          <div className="caixa-offline">
            <h2>Você está offline</h2>
            <p>Fique online para receber chamadas na sua região.</p>
          </div>
        ) : (
          <div className="card-chamada-tocar">
            {/* Pulsar de notificação */}
            <div className="aviso-tocando">
              <span className="ponto-pulsante" /> Nova Corrida Disponível
            </div>

            {/* Info do Passageiro */}
            <div className="info-passageiro">
              <div className="avatar-pass">
                <User size={20} />
              </div>
              <div>
                <p className="nome">{corridaPendente.passageiro}</p>
                <p className="nota">⭐ {corridaPendente.avaliacao}</p>
              </div>
              <div className="etiqueta-preco">
                R$ {corridaPendente.valorSugerido.toFixed(2)}
              </div>
            </div>

            {/* Rota do Cliente */}
            <div className="ride-card ride-card--rota mt-3">
              <div className="rota-linha">
                <div className="icone-rota icone-rota--origem"><Navigation size={14} strokeWidth={3} /></div>
                <p className="texto-rota">{corridaPendente.origem}</p>
              </div>
              <div className="rota-linha sem-borda">
                <div className="icone-rota icone-rota--destino"><MapPin size={14} strokeWidth={3} /></div>
                <p className="texto-rota">{corridaPendente.destino}</p>
              </div>
            </div>

            {/* Meta infos (Distância, tempo, extras) */}
            <div className="meta-infos-corrida">
              <div className="meta-item">
                <Bike size={14} /> {corridaPendente.distancia}
              </div>
              <div className="meta-item">
                <Clock size={14} /> {corridaPendente.tempo}
              </div>
              {corridaPendente.pacote && (
                <div className="meta-item meta-item--lima">
                  <Package size={14} /> Pacote
                </div>
              )}
            </div>

            {/* Ações do Motorista */}
            {showContraproposta ? (
              <div className="caixa-contraproposta">
                <p>Qual a sua oferta?</p>
                <div className="campo-negociar mb-3">
                  <span className="moeda">R$</span>
                  <input
                    type="number"
                    placeholder="Ex: 15.00"
                    value={valorContraproposta}
                    onChange={(e) => setValorContraproposta(e.target.value)}
                    className="input-negociar"
                  />
                </div>
                <div className="botoes-acao-dupla">
                  <button onClick={() => setShowContraproposta(false)} className="btn-rejeitar">Cancelar</button>
                  <button onClick={enviarContraproposta} className="btn-aceitar bg-laranja">Enviar Oferta</button>
                </div>
              </div>
            ) : (
              <div className="botoes-acao-motorista">
                <button className="btn-rejeitar">
                  <X size={18} strokeWidth={3} /> Recusar
                </button>
                <button onClick={() => setShowContraproposta(true)} className="btn-contra">
                  <HandCoins size={18} strokeWidth={3} /> Negociar
                </button>
                <button onClick={aceitarCorrida} className="btn-aceitar">
                  <Check size={18} strokeWidth={3} /> Aceitar
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}