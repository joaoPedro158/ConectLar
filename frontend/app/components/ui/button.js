import React from "react";
import { Botao } from "./Botao.jsx";

const variantMap = {
  default: "padrao",
  destructive: "destrutivo",
  outline: "contorno",
  secondary: "secundario",
  ghost: "fantasma",
};

const sizeMap = {
  default: "padrao",
  sm: "pequeno",
  lg: "grande",
  icon: "icone",
};

function buttonVariants({ variant = "default", size = "default" } = {}) {
  const classes = [
    "botao",
    `botao--${variantMap[variant] ?? variantMap.default}`,
    `botao--tamanho-${sizeMap[size] ?? sizeMap.default}`,
  ];
  return classes.join(" ");
}

const Button = React.forwardRef(function Button(
  { variant = "default", size = "default", className, ...props },
  ref,
) {
  return (
    <Botao
      ref={ref}
      variante={variantMap[variant] ?? variantMap.default}
      tamanho={sizeMap[size] ?? sizeMap.default}
      className={className}
      {...props}
    />
  );
});

export { Button, buttonVariants };

