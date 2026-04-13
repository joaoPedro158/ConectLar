import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Car, Zap, Wrench, Star } from "lucide-react";
import "../styles/pages/SplashScreen.css";

const letras = "ConectaLar".split("");

export function SplashScreen({ aoFinalizar }) {
  const [progresso, setProgresso] = useState(0);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    const duracao = 2600;
    const passos = 60;
    const intervalo = duracao / passos;
    let atual = 0;

    const temporizador = setInterval(() => {
      atual += 100 / passos;
      setProgresso(Math.min(atual, 100));
      if (atual >= 100) {
        clearInterval(temporizador);
        setTimeout(() => {
          setSaindo(true);
          setTimeout(aoFinalizar, 500);
        }, 200);
      }
    }, intervalo);

    return () => clearInterval(temporizador);
  }, [aoFinalizar]);

  return (
    <AnimatePresence>
      {!saindo && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="splash"
        >
          <div className="splash__grade-fundo">
            <div className="splash__grade-padrao" />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -40, y: -40 }}
            animate={{ opacity: 0.15, x: 0, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="splash__acento splash__acento--topo-esq"
          />
          <motion.div
            initial={{ opacity: 0, x: 40, y: 40 }}
            animate={{ opacity: 0.12, x: 0, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="splash__acento splash__acento--baixo-dir"
          />

          <div className="splash__conteudo">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              className="splash__logo-wrapper"
            >
              <div className="splash__logo-sombra" />
              <div className="splash__logo-caixa">
                <Home size={44} className="splash__logo-icone" strokeWidth={2} />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
                className="splash__badge splash__badge--zap"
              >
                <Zap size={16} strokeWidth={3} />
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 }}
                className="splash__badge splash__badge--carro"
              >
                <Car size={14} strokeWidth={2.5} />
              </motion.div>
            </motion.div>

            <div className="splash__marca">
              <div className="splash__letras">
                {letras.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.045, duration: 0.35 }}
                    className={`splash__letra ${i >= 7 ? "splash__letra--destaque" : ""}`}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="splash__slogan"
              >
                <span className="splash__ponto splash__ponto--ciano" />
                <p className="splash__slogan-texto">Serviços · Mobilidade · Conexão</p>
                <span className="splash__ponto splash__ponto--amarelo" />
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="splash__progresso-container"
          >
            <div className="splash__barra-trilha">
              <motion.div
                className="splash__barra-preenchimento"
                style={{ width: `${progresso}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
            <div className="splash__progresso-info">
              <p className="splash__progresso-texto">Carregando</p>
              <p className="splash__progresso-porcentagem">{Math.round(progresso)}%</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}