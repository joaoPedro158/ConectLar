"use client";

import React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import "../../styles/ui/Alternancia.css";

// Componente de alternância (on/off) com estilos definidos em CSS
function Alternancia({ className = "", variante = "padrao", tamanho = "media", ...props }) {
  const classesBase = [
    "alternancia",
    `alternancia--${variante}`,
    `alternancia--${tamanho}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TogglePrimitive.Root
      data-slot="alternancia"
      className={classesBase}
      {...props}
    />
  );
}

export { Alternancia };
