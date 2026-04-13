"use client";

import React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import "../../../styles/ui/AreaRolagem.css";

function AreaRolagem({ className, children, ...props }) {
  const classes = ["area-rolagem", className].filter(Boolean).join(" ").trim();

  return (
    <ScrollAreaPrimitive.Root
      data-slot="area-rolagem"
      className={classes}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="area-rolagem-viewport"
        className="area-rolagem__viewport"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <BarraRolagem />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function BarraRolagem({ className, orientacao = "vertical", ...props }) {
  const classes = [
    "area-rolagem__barra",
    `area-rolagem__barra--${orientacao}`,
    className
  ].filter(Boolean).join(" ").trim();

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="barra-rolagem"
      orientation={orientacao}
      className={classes}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="area-rolagem-thumb"
        className="area-rolagem__thumb"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { AreaRolagem, BarraRolagem };