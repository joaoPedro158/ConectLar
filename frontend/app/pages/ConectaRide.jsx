import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Navigation, Bike, Car, Package,
  Clock, DollarSign, Zap, Plus, Minus, ChevronRight, Sun, Moon
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
  const [tarifa00, setTarifa00] = useState(false);
  const [valorSugerido, setValorSugerido] = useState("");
  const [minutosEspera, setMinutosEspera] = useState(0);
  const [comEncomenda, setComEncomenda] = useState(false);
  const [chamando, setChamando] = useState(false);

  const extraEspera = minutosEspera * PRECO_ESPERA_POR_MIN;
  const sugestaoBase = tarifa00 ? 10 : SUGESTAO_MINIMA;
  
  // Calcula o total sugerido
  const valorDigitado = parseFloat(valorSugerido);
  const valorCorridaBase = !isNaN(valorDigitado) && valorDigitado >= sugestaoBase ? valorDigitado : sugestaoBase;
  const totalSugerido = valorCorridaBase + extraEspera + (comEncomenda ? 3 : 0);

  const ajustarEspera = (direcao) => {
    const idx = OPCOES_ESPERA.indexOf(minutosEspera);
    if (direcao === "up" && idx < OPCOES_ESPERA.length - 1) setMinutosEspera(OPCOES_ESPERA[idx + 1]);
    if (direcao === "down" && idx > 0) setMinutosEspera(OPCOES_ESPERA[idx - 1]);
  };

  const realizarChamada = () => {
    setChamando(true);
    setTimeout(() => setChamando(false), 3000);
  };

  return (
    <div className={`ride-layout ${temaEscuro ? "ride-layout--escuro" : ""}`}>
      {/* HEADER */}
      <header className="ride-header">
        <div className="ride-header__topo">
          <div className="ride-header__esq">
            <button onClick={() => navigate("/")} className="btn-voltar-ride">
              <ArrowLeft size={18} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="ride-header__titulo">ConectaRide</h1>
              <p className="ride-header__sub">Transporte Local Flexível</p>
            </div>
          </div>
          <button onClick={alternarTema} className="btn-tema-ride">
            {temaEscuro ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
          </button>
        </div>

        <div className="ride-seletor-veiculo">
          <button
            onClick={() => setVeiculo("mototaxi")}
            className={`btn-veiculo ${veiculo === "mototaxi" ? "btn-veiculo--ativo" : ""}`}
          >
            <Bike size={18} strokeWidth={2.5} />
            <span>Moto-táxi</span>
          </button>
          <button
            onClick={() => setVeiculo("taxi")}
            className={`btn-veiculo ${veiculo === "taxi" ? "btn-veiculo--ativo" : ""}`}
          >
            <Car size={18} strokeWidth={2.5} />
            <span>Táxi</span>
          </button>
        </div>
      </header>

      <main className="ride-main">
        {/* ROTA */}
        <div className="ride-card ride-card--rota">
          <div className="rota-linha">
            <div className="icone-rota icone-rota--origem"><Navigation size={14} strokeWidth={3} /></div>
            <input
              type="text"
              placeholder="De onde você sai?"
              value={origem}
              onChange={(e) => setOrigem(e.target.value)}
              className="input-rota"
            />
          </div>
          <div className="rota-linha sem-borda">
            <div className="icone-rota icone-rota--destino"><MapPin size={14} strokeWidth={3} /></div>
            <input
              type="text"
              placeholder="Para onde você vai?"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="input-rota"
            />
          </div>
        </div>

        {/* TARIFA 00 */}
        <button
          onClick={() => setTarifa00(!tarifa00)}
          className={`ride-card-toggle ${tarifa00 ? "ride-card-toggle--ativo-amarelo" : ""}`}
        >
          <div className="toggle-esq">
            <div className="icone-caixa bg-preto"><Zap size={18} className="txt-amarelo" strokeWidth={3} /></div>
            <div className="textos">
              <p className="titulo">Tarifa 00 · Centro</p>
              <p className="sub">Valor fixo R$ 10,00 — área central</p>
            </div>
          </div>
          <div className={`caixa-check ${tarifa00 ? "caixa-check--ativo" : ""}`}>
            {tarifa00 && <span className="txt-amarelo">✓</span>}
          </div>
        </button>

        {/* NEGOCIAÇÃO */}
        <div className="ride-card">
          <div className="card-cabecalho">
            <div className="icone-caixa bg-fucsia"><DollarSign size={15} strokeWidth={3} className="txt-preto"/></div>
            <div>
              <p className="titulo">Negociação de Valor</p>
              <p className="sub">Sugira quanto quer pagar</p>
            </div>
          </div>
          <div className="campo-negociar">
            <span className="moeda">R$</span>
            <input
              type="number"
              placeholder={`Mín. R$ ${sugestaoBase.toFixed(2)}`}
              value={valorSugerido}
              onChange={(e) => setValorSugerido(e.target.value)}
              min={sugestaoBase}
              className="input-negociar"
            />
          </div>
          <p className="dica">💡 O motorista pode aceitar ou fazer uma contraproposta</p>
        </div>

        {/* ESPERA */}
        <div className="ride-card">
          <div className="card-cabecalho">
            <div className="icone-caixa bg-laranja"><Clock size={15} strokeWidth={3} className="txt-preto"/></div>
            <div>
              <p className="titulo">Espera Dinâmica</p>
              <p className="sub">O motorista precisa esperar por você?</p>
            </div>
          </div>
          
          <div className="controle-espera">
            <button onClick={() => ajustarEspera("down")} disabled={minutosEspera === 0} className="btn-controle">
              <Minus size={16} strokeWidth={3} />
            </button>
            <div className="visor-espera">
              <span className="minutos">{minutosEspera === 0 ? "Sem espera" : `${minutosEspera} min`}</span>
              {extraEspera > 0 && <span className="extra">+ R$ {extraEspera.toFixed(2)}</span>}
            </div>
            <button onClick={() => ajustarEspera("up")} disabled={minutosEspera === OPCOES_ESPERA[OPCOES_ESPERA.length - 1]} className="btn-controle">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>

          <div className="grid-opcoes-espera">
            {OPCOES_ESPERA.map((min) => (
              <button
                key={min}
                onClick={() => setMinutosEspera(min)}
                className={`btn-opcao-espera ${minutosEspera === min ? "btn-opcao-espera--ativo" : ""}`}
              >
                {min === 0 ? "0" : `${min}'`}
              </button>
            ))}
          </div>
        </div>

        {/* ENCOMENDA */}
        <button
          onClick={() => setComEncomenda(!comEncomenda)}
          className={`ride-card-toggle ${comEncomenda ? "ride-card-toggle--ativo-lima" : ""}`}
        >
          <div className="toggle-esq">
            <div className="icone-caixa bg-preto"><Package size={18} className="txt-lima" strokeWidth={3} /></div>
            <div className="textos">
              <p className="titulo">Leva Eu e a Encomenda</p>
              <p className="sub">Passageiro + 1 pacote · + R$ 3,00</p>
            </div>
          </div>
          <div className={`caixa-check ${comEncomenda ? "caixa-check--ativo" : ""}`}>
            {comEncomenda && <span className="txt-lima">✓</span>}
          </div>
        </button>

        {/* RESUMO */}
        <div className="caixa-resumo">
          <p className="caixa-resumo__label">Resumo</p>
          <div className="caixa-resumo__linha">
            <span>Corrida ({veiculo === "mototaxi" ? "Moto-táxi" : "Táxi"})</span>
            <span className="valor-destaque">R$ {tarifa00 ? "10,00" : sugestaoBase.toFixed(2)}</span>
          </div>
          {extraEspera > 0 && (
            <div className="caixa-resumo__linha">
              <span className="texto-opaco">Espera ({minutosEspera} min)</span>
              <span className="valor-extra-laranja">+ R$ {extraEspera.toFixed(2)}</span>
            </div>
          )}
          {comEncomenda && (
            <div className="caixa-resumo__linha">
              <span className="texto-opaco">Encomenda</span>
              <span className="valor-extra-lima">+ R$ 3,00</span>
            </div>
          )}
          <div className="caixa-resumo__linha caixa-resumo__linha--total">
            <span>Estimativa</span>
            <span className="valor-total-ciano">R$ {totalSugerido.toFixed(2)}</span>
          </div>
        </div>

        {/* BOTÃO CHAMAR */}
        <motion.button
          onClick={realizarChamada}
          whileTap={{ scale: 0.97, y: 3 }}
          animate={chamando ? { scale: [1, 1.03, 1] } : {}}
          transition={{ duration: 0.5, repeat: chamando ? Infinity : 0 }}
          className={`btn-chamar-ride ${chamando ? "btn-chamar-ride--chamando" : ""}`}
        >
          {chamando ? (
            <div className="animacao-chamando">
              <span className="bolinha-pulo" />
              <span>Procurando motorista...</span>
              <span className="bolinha-pulo delay" />
            </div>
          ) : (
            <>
              {veiculo === "mototaxi" ? <Bike size={20} strokeWidth={3} /> : <Car size={20} strokeWidth={3} />}
              <span>Chamar Agora</span>
              <ChevronRight size={18} strokeWidth={3} />
            </>
          )}
        </motion.button>

      </main>
    </div>
  );
}