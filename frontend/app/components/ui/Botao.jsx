import React from "react";
import { Slot } from "@radix-ui/react-slot";
import "./Botao.css";

const Botao = React.forwardRef(({ 
  className, 
  variante = "padrao", 
  tamanho = "padrao", 
  asChild = false, 
  ...props 
}, ref) => {
  const Componente = asChild ? Slot : "button";

  const classesFinais = [
    "botao",
    `botao--${variante}`,
    `botao--tamanho-${tamanho}`,
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <Componente
      ref={ref}
      data-slot="botao"
      className={classesFinais}
      {...props}
    />
  );
});

Botao.displayName = "Botao";

export { Botao };