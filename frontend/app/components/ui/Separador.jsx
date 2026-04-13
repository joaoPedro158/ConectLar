"use client";

import React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import "../../../styles/ui/Separador.css";

function Separador({
  className,
  orientacao = "horizontal",
  decorativo = true,
  ...props
}) {
  const classesFinais = [
    "separador",
    `separador--${orientacao}`,
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <SeparatorPrimitive.Root
      data-slot="separador-raiz"
      decorative={decorativo}
      orientation={orientacao}
      className={classesFinais}
      {...props}
    />
  );
}

export { Separador };