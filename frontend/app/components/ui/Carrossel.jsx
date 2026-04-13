"use client";

import React, { useState, useCallback, useEffect, createContext, useContext } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Botao } from "./Botao";
import "../../../styles/ui/Carrossel.css";

const ContextoCarrossel = createContext(null);

function useCarrossel() {
  const contexto = useContext(ContextoCarrossel);
  if (!contexto) {
    throw new Error("useCarrossel deve ser usado dentro de um <Carrossel />");
  }
  return contexto;
}

function Carrossel({
  orientacao = "horizontal",
  opcoes,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carrosselRef, api] = useEmblaCarousel(
    {
      ...opcoes,
      axis: orientacao === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(false);

  const aoSelecionar = useCallback((api) => {
    if (!api) return;
    setPodeVoltar(api.canScrollPrev());
    setPodeAvancar(api.canScrollNext());
  }, []);

  const voltar = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const avancar = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const lidarTeclado = useCallback(
    (evento) => {
      if (evento.key === "ArrowLeft") {
        evento.preventDefault();
        voltar();
      } else if (evento.key === "ArrowRight") {
        evento.preventDefault();
        avancar();
      }
    },
    [voltar, avancar],
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  useEffect(() => {
    if (!api) return;
    aoSelecionar(api);
    api.on("reInit", aoSelecionar);
    api.on("select", aoSelecionar);

    return () => {
      api?.off("select", aoSelecionar);
    };
  }, [api, aoSelecionar]);

  const classes = ["carrossel", className].filter(Boolean).join(" ").trim();

  return (
    <ContextoCarrossel.Provider
      value={{
        carrosselRef,
        api,
        opcoes,
        orientacao,
        voltar,
        avancar,
        podeVoltar,
        podeAvancar,
      }}
    >
      <div
        onKeyDownCapture={lidarTeclado}
        className={classes}
        role="region"
        aria-roledescription="carrossel"
        data-slot="carrossel"
        {...props}
      >
        {children}
      </div>
    </ContextoCarrossel.Provider>
  );
}

function CarrosselConteudo({ className, ...props }) {
  const { carrosselRef, orientacao } = useCarrossel();

  const classes = [
    "carrossel__conteudo-interno",
    `carrossel__conteudo-interno--${orientacao}`,
    className
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      ref={carrosselRef}
      className="carrossel__conteudo"
      data-slot="carrossel-content"
    >
      <div className={classes} {...props} />
    </div>
  );
}

function CarrosselItem({ className, ...props }) {
  const { orientacao } = useCarrossel();

  const classes = [
    "carrossel__item",
    `carrossel__item--${orientacao}`,
    className
  ].filter(Boolean).join(" ").trim();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carrossel-item"
      className={classes}
      {...props}
    />
  );
}

function CarrosselAnterior({ className, variante = "contorno", tamanho = "icone", ...props }) {
  const { orientacao, voltar, podeVoltar } = useCarrossel();

  const classes = [
    "carrossel__botao-anterior",
    `carrossel__botao-anterior--${orientacao}`,
    className
  ].filter(Boolean).join(" ").trim();

  return (
    <Botao
      data-slot="carrossel-previous"
      variante={variante}
      tamanho={tamanho}
      className={classes}
      disabled={!podeVoltar}
      onClick={voltar}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Slide anterior</span>
    </Botao>
  );
}

function CarrosselProximo({ className, variante = "contorno", tamanho = "icone", ...props }) {
  const { orientacao, avancar, podeAvancar } = useCarrossel();

  const classes = [
    "carrossel__botao-proximo",
    `carrossel__botao-proximo--${orientacao}`,
    className
  ].filter(Boolean).join(" ").trim();

  return (
    <Botao
      data-slot="carrossel-next"
      variante={variante}
      tamanho={tamanho}
      className={classes}
      disabled={!podeAvancar}
      onClick={avancar}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Próximo slide</span>
    </Botao>
  );
}

export {
  Carrossel,
  CarrosselConteudo,
  CarrosselItem,
  CarrosselAnterior,
  CarrosselProximo,
};