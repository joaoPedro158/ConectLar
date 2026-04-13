"use client";

import React, { createContext, useContext, useId, useMemo } from "react";
import * as RechartsPrimitive from "recharts";
import "./Grafico.css";

const TEMAS = { claro: "", escuro: ".dark" };

const ContextoGrafico = createContext(null);

function useGrafico() {
  const contexto = useContext(ContextoGrafico);
  if (!contexto) {
    throw new Error("useGrafico deve ser usado dentro de um <GraficoContainer />");
  }
  return contexto;
}

function GraficoContainer({ id, className, children, configuracao, ...props }) {
  const idUnico = useId();
  const idGrafico = `grafico-${id || idUnico.replace(/:/g, "")}`;

  return (
    <ContextoGrafico.Provider value={{ configuracao }}>
      <div
        data-slot="grafico"
        data-chart={idGrafico}
        className={`grafico-container ${className || ""}`}
        {...props}
      >
        <GraficoEstilo id={idGrafico} configuracao={configuracao} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ContextoGrafico.Provider>
  );
}

const GraficoEstilo = ({ id, configuracao }) => {
  const configCores = Object.entries(configuracao).filter(
    ([, config]) => config.theme || config.color,
  );

  if (!configCores.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(TEMAS)
          .map(([tema, prefixo]) => `
            ${prefixo} [data-chart=${id}] {
              ${configCores.map(([chave, itemConfig]) => {
                const cor = itemConfig.theme?.[tema] || itemConfig.color;
                return cor ? `  --color-${chave}: ${cor};` : null;
              }).join("\n")}
            }
          `).join("\n"),
      }}
    />
  );
};

const GraficoDica = RechartsPrimitive.Tooltip;

function GraficoDicaConteudo({
  active, payload, className, indicador = "ponto", hideLabel = false, label, nameKey, labelKey
}) {
  const { configuracao } = useGrafico();

  const rotuloDica = useMemo(() => {
    if (hideLabel || !payload?.length) return null;
    const [item] = payload;
    const chave = `${labelKey || item?.dataKey || item?.name || "valor"}`;
    const itemConfig = obterConfiguracaoPayload(configuracao, item, chave);
    const valor = itemConfig?.label || label;

    return valor ? <div className="grafico-dica__rotulo">{valor}</div> : null;
  }, [label, payload, hideLabel, configuracao, labelKey]);

  if (!active || !payload?.length) return null;

  return (
    <div className={`grafico-dica ${className || ""}`}>
      {!hideLabel && rotuloDica}
      <div className="grafico-dica__grid">
        {payload.map((item) => {
          const chave = `${nameKey || item.name || item.dataKey || "valor"}`;
          const itemConfig = obterConfiguracaoPayload(configuracao, item, chave);
          const corIndicador = item.payload.fill || item.color;

          return (
            <div key={item.dataKey} className="grafico-dica__item">
              <div 
                className={`grafico-dica__indicador grafico-dica__indicador--${indicador}`}
                style={{ "--cor-bg": corIndicador }}
              />
              <div className="grafico-dica__info">
                <span className="grafico-dica__nome">{itemConfig?.label || item.name}</span>
                <span className="grafico-dica__valor">{item.value.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const GraficoLegenda = RechartsPrimitive.Legend;

function GraficoLegendaConteudo({ payload, className, nameKey }) {
  const { configuracao } = useGrafico();
  if (!payload?.length) return null;

  return (
    <div className={`grafico-legenda ${className || ""}`}>
      {payload.map((item) => {
        const chave = `${nameKey || item.dataKey || "valor"}`;
        const itemConfig = obterConfiguracaoPayload(configuracao, item, chave);
        return (
          <div key={item.value} className="grafico-legenda__item">
            <div className="grafico-legenda__cor" style={{ backgroundColor: item.color }} />
            <span>{itemConfig?.label || item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

function obterConfiguracaoPayload(config, payload, chave) {
  if (typeof payload !== "object" || payload === null) return undefined;
  const itemInterno = payload.payload;
  let chaveFinal = chave;

  if (chave in payload && typeof payload[chave] === "string") {
    chaveFinal = payload[chave];
  } else if (itemInterno && chave in itemInterno && typeof itemInterno[chave] === "string") {
    chaveFinal = itemInterno[chave];
  }

  return config[chaveFinal] || config[chave];
}

export {
  GraficoContainer, GraficoDica, GraficoDicaConteudo,
  GraficoLegenda, GraficoLegendaConteudo, GraficoEstilo
};