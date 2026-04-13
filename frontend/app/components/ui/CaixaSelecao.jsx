"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import "../../../styles/ui/CaixaSelecao.css";

function Checkbox({
  className,
  ...props
}) {
  const classes = ["caixa-selecao", className].filter(Boolean).join(" ").trim();

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={classes}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="caixa-selecao__indicador"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
