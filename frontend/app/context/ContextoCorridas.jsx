import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./ContextoAutenticacao";

const CorridasContext = createContext(null);

export function ProvedorCorridas({ children }) {
  const { usuario } = useAuth();
  const [corridas, setCorridas] = useState([]);

  const criarCorrida = ({ origem, destino, tipoVeiculo, valor, minutosEspera = 0, comEncomenda = false }) => {
    if (!origem || !destino) return;

    const novaCorrida = {
      id: Date.now(),
      passengerName: usuario?.nome || "Cliente",
      type: tipoVeiculo || "mototaxi",
      origin: origem,
      destination: destino,
      distance: "-",
      time: "-",
      offeredValue: Number(valor) || 0,
      waitMinutes: minutosEspera,
      withPackage: comEncomenda,
      status: "novo",
      createdAt: new Date().toISOString(),
    };

    setCorridas((anteriores) => [novaCorrida, ...anteriores]);
  };

  const marcarAceita = (id) => {
    setCorridas((anteriores) =>
      anteriores.map((c) => (c.id === id ? { ...c, status: "aceito" } : c))
    );
  };

  const limparCorrida = (id) => {
    setCorridas((anteriores) => anteriores.filter((c) => c.id !== id));
  };

  const value = { corridas, criarCorrida, marcarAceita, limparCorrida };

  return <CorridasContext.Provider value={value}>{children}</CorridasContext.Provider>;
}

export function useCorridas() {
  const contexto = useContext(CorridasContext);
  if (!contexto) {
    throw new Error("useCorridas deve ser usado dentro de ProvedorCorridas");
  }
  return contexto;
}
