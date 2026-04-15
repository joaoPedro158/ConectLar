"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import "../../styles/ui/Abas.css";

function Abas({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="abas"
      className={`abas ${className || ""}`}
      {...props}
    />
  );
}

function AbasLista({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="abas-lista"
      className={`abas__lista ${className || ""}`}
      {...props}
    />
  );
}

function AbasGatilho({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="abas-gatilho"
      className={`abas__gatilho ${className || ""}`}
      {...props}
    />
  );
}

function AbasConteudo({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="abas-conteudo"
      className={`abas__conteudo ${className || ""}`}
      {...props}
    />
  );
}

export { Abas, AbasLista, AbasGatilho, AbasConteudo };