import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Bike,
  Car,
  Package,
  Clock,
  DollarSign,
  Zap,
  Plus,
  Minus,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTemaEscuro } from "../context/ContextoTemaEscuro";
import "../styles/pages/ConectaRide.css";

const OPCOES_ESPERA = [0, 5, 10, 15, 20];
const PRECO_ESPERA_POR_MIN = 1.5;
const SUGESTAO_MINIMA = 12;

export function ConectaRide() {
  const navigate = useNavigate();
  const { temaEscuro, alternarTema } = useTemaEscuro();
  
  const [veiculo, setVeiculo] = useState("mototaxi");
  const [origem, setOrigem] = useState("");
  const [destino, setDestino] = useState("");
  const [tarifaCentro, setTarifaCentro] = useState(false);
  const [valorSugerido, setValorSugerido] = useState("");
  const [minutosEspera, setMinutosEspera] = useState(0);
  const [comEncomenda, setComEncomenda] = useState(false);
  const [chamando, setChamando] = useState(false);

  const extraEspera = minutosEspera * PRECO_ESPERA_POR_MIN;
  const sugestaoBase = tarifaCentro ? 10 : SUGESTAO_MINIMA;
  const valorNegociado = parseFloat(String(valorSugerido).replace(",", "."));
  const valorCorrida =
    !isNaN(valorNegociado) && valorNegociado >= sugestaoBase
      ? valorNegociado
      : sugestaoBase;
  const totalEstimado = valorCorrida + extraEspera + (comEncomenda ? 3 : 0);

  const ajustarEspera = (direcao) => {
    const index = OPCOES_ESPERA.indexOf(minutosEspera);
    if (direcao === "aumentar" && index < OPCOES_ESPERA.length - 1)
      setMinutosEspera(OPCOES_ESPERA[index + 1]);
    if (direcao === "diminuir" && index > 0)
      setMinutosEspera(OPCOES_ESPERA[index - 1]);
  };

  const realizarChamada = () => {
    setChamando(true);
    setTimeout(() => setChamando(false), 3000);
  };

  return (
    <div className={`conectaride ${temaEscuro ? "conectaride--escuro" : ""}`}>
      {/* CABEÇALHO */}
      <header className="conectaride-header">
        <div className="conectaride-header__topo">
          <div className="conectaride-header__info">
            <button onClick={() => navigate("/")} className="btn-voltar">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="conectaride-header__titulo">ConectaRide</h1>
              <p className="conectaride-header__subtitulo">Transporte Nova Cruz</p>
            </div>
          </div>
          <button onClick={alternarTema} className="btn-tema">
            {temaEscuro ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* SELETOR DE VEÍCULO */}
        <div className="seletor-veiculo">
          <button 
            onClick={() => setVeiculo("mototaxi")}
            className={`seletor-veiculo__btn ${veiculo === "mototaxi" ? "seletor-veiculo__btn--ativo" : ""}`}
          >
            <Bike size={18} /> <span>Moto-táxi</span>
          </button>
          <button 
            onClick={() => setVeiculo("taxi")}
            className={`seletor-veiculo__btn ${veiculo === "taxi" ? "seletor-veiculo__btn--ativo" : ""}`}
          >
            <Car size={18} /> <span>Táxi</span>
          </button>
        </div>
      </header>

      <main className="conectaride-main">
        {/* ROTA (Origem / Destino) */}
        <div className="card-rota">
          <div className="card-rota__item">
            <div className="card-rota__icone card-rota__icone--origem">
              <Navigation size={14} />
            </div>
            <input
              type="text"
              placeholder="De onde você sai?"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
            />
          </div>
          <div className="card-rota__item">
            <div className="card-rota__icone card-rota__icone--destino">
              <MapPin size={14} />
            </div>
            <input
              type="text"
              placeholder="Para onde você vai?"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
          </div>
        </div>

        {/* TARIFA 00 - CENTRO */}
        <button
          onClick={() => setTarifaCentro(!tarifaCentro)}
          className={`card-opcao ${tarifaCentro ? "card-opcao--ativo" : ""}`}
        >
          <div className="card-opcao__conteudo">
            <div className="card-opcao__icone-wrapper">
              <Zap size={18} />
            </div>
            <div className="card-opcao__texto">
              <p className="card-opcao__titulo">Tarifa 00 · Centro</p>
              <p className="card-opcao__desc">Valor fixo R$ 10,00 — área central</p>
            </div>
          </div>
          <div className="card-opcao__checkbox">{tarifaCentro && "✓"}</div>
        </button>

        {/* NEGOCIAÇÃO DE VALOR */}
        <div className="card-negociacao">
          <div className="card-negociacao__header">
            <div className="card-negociacao__icone-wrapper">
              <DollarSign size={15} />
            </div>
            <div>
              <p className="card-negociacao__titulo">Negociação de Valor</p>
              <p className="card-negociacao__desc">Sugira quanto quer pagar</p>
            </div>
          </div>
          <div className="card-negociacao__campo-valor">
            <span className="card-negociacao__prefixo">R$</span>
            <input
              type="number"
              placeholder={`Mín. R$ ${sugestaoBase.toFixed(2)}`}
              value={valorSugerido}
              onChange={(e) => setValorSugerido(e.target.value)}
              min={sugestaoBase}
              className="card-negociacao__input"
            />
          </div>
          <p className="card-negociacao__dica">
            💡 O motorista pode aceitar ou fazer uma contraproposta
          </p>
        </div>

        {/* ESPERA DINÂMICA */}
        <div className="card-espera">
          <div className="card-espera__header">
            <div className="card-espera__icone-wrapper">
              <Clock size={15} />
            </div>
            <div>
              <p className="card-espera__titulo">Espera Dinâmica</p>
              <p className="card-espera__desc">O motorista precisa esperar por você?</p>
            </div>
          </div>
          <div className="controle-espera">
            <button
              onClick={() => ajustarEspera("diminuir")}
              disabled={minutosEspera === 0}
              className="controle-espera__btn"
            >
              <Minus size={16} />
            </button>
            <div className="controle-espera__valor">
              <span className="valor-minutos">
                {minutosEspera === 0 ? "Sem espera" : `${minutosEspera} min`}
              </span>
              {extraEspera > 0 && (
                <span className="valor-extra">+ R$ {extraEspera.toFixed(2)}</span>
              )}
            </div>
            <button
              onClick={() => ajustarEspera("aumentar")}
              disabled={
                OPCOES_ESPERA.indexOf(minutosEspera) ===
                OPCOES_ESPERA.length - 1
              }
              className="controle-espera__btn"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="controle-espera__opcoes">
            {OPCOES_ESPERA.map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setMinutosEspera(min)}
                className={`controle-espera__opcao-btn ${
                  minutosEspera === min ? "controle-espera__opcao-btn--ativo" : ""
                }`}
              >
                {min === 0 ? "0" : `${min}'`}
              </button>
            ))}
          </div>
        </div>

        {/* ENCOMENDA */}
        <button
          onClick={() => setComEncomenda(!comEncomenda)}
          className={`card-opcao card-opcao--encomenda ${
            comEncomenda ? "card-opcao--ativo-encomenda" : ""
          }`}
        >
          <div className="card-opcao__conteudo">
            <div className="card-opcao__icone-wrapper">
              <Package size={18} />
            </div>
            <div className="card-opcao__texto">
              <p className="card-opcao__titulo">Leva Eu e a Encomenda</p>
              <p className="card-opcao__desc">
                Passageiro + 1 pacote · + R$ 3,00
              </p>
            </div>
          </div>
          <div className="card-opcao__checkbox">{comEncomenda && "✓"}</div>
        </button>

        {/* RESUMO E BOTÃO */}
        <div className="resumo-chamada">
          <div className="resumo-chamada__card">
            <p className="resumo-chamada__label">Resumo</p>
            <div className="resumo-chamada__linha">
              <span className="resumo-chamada__texto">
                Corrida ({veiculo === "mototaxi" ? "Moto-táxi" : "Táxi"})
              </span>
              <span className="resumo-chamada__valor-base">
                R$ {valorCorrida.toFixed(2)}
              </span>
            </div>
            {extraEspera > 0 && (
              <div className="resumo-chamada__linha">
                <span className="resumo-chamada__texto resumo-chamada__texto--secundario">
                  Espera ({minutosEspera} min)
                </span>
                <span className="resumo-chamada__valor-extra">
                  + R$ {extraEspera.toFixed(2)}
                </span>
              </div>
            )}
            {comEncomenda && (
              <div className="resumo-chamada__linha">
                <span className="resumo-chamada__texto resumo-chamada__texto--secundario">
                  Encomenda
                </span>
                <span className="resumo-chamada__valor-encomenda">+ R$ 3,00</span>
              </div>
            )}
            <div className="resumo-chamada__linha resumo-chamada__linha--total">
              <span className="resumo-chamada__texto resumo-chamada__texto--total">
                Estimativa
              </span>
              <span className="valor-total">R$ {totalEstimado.toFixed(2)}</span>
            </div>
          </div>

          <motion.button
            type="button"
            onClick={realizarChamada}
            whileTap={{ scale: 0.97, y: 3 }}
            animate={chamando ? { scale: [1, 1.03, 1] } : {}}
            transition={{ duration: 0.5, repeat: chamando ? Infinity : 0 }}
            disabled={chamando || !destino}
            className={`btn-chamar ${chamando ? "btn-chamar--ativo" : ""}`}
          >
            {chamando ? (
              <>
                <span className="btn-chamar__ponto" />
                <span className="btn-chamar__texto">Procurando motorista...</span>
                <span className="btn-chamar__ponto btn-chamar__ponto--delay" />
              </>
            ) : (
              <>
                {veiculo === "mototaxi" ? (
                  <Bike size={20} />
                ) : (
                  <Car size={20} />
                )}
                <span>Chamar Agora</span>
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </div>
      </main>
    </div>
  );
}