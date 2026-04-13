"use client";

import React from "react";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import "./BarraMenu.css";

function BarraMenu({ className, ...props }) {
  return (
    <MenubarPrimitive.Root
      data-slot="barra-menu"
      className={`barra-menu ${className || ""}`}
      {...props}
    />
  );
}

function BarraMenuMenu({ ...props }) {
  return <MenubarPrimitive.Menu data-slot="barra-menu-menu" {...props} />;
}

function BarraMenuGrupo({ ...props }) {
  return <MenubarPrimitive.Group data-slot="barra-menu-grupo" {...props} />;
}

function BarraMenuPortal({ ...props }) {
  return <MenubarPrimitive.Portal data-slot="barra-menu-portal" {...props} />;
}

function BarraMenuRadioGrupo({ ...props }) {
  return <MenubarPrimitive.RadioGroup data-slot="barra-menu-radio-grupo" {...props} />;
}

function BarraMenuGatilho({ className, ...props }) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="barra-menu-gatilho"
      className={`barra-menu__gatilho ${className || ""}`}
      {...props}
    />
  );
}

function BarraMenuConteudo({ className, align = "start", alignOffset = -4, sideOffset = 8, ...props }) {
  return (
    <BarraMenuPortal>
      <MenubarPrimitive.Content
        data-slot="barra-menu-conteudo"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={`barra-menu__conteudo ${className || ""}`}
        {...props}
      />
    </BarraMenuPortal>
  );
}

function BarraMenuItem({ className, recuo, variante = "padrao", ...props }) {
  return (
    <MenubarPrimitive.Item
      data-slot="barra-menu-item"
      data-inset={recuo}
      data-variant={variante}
      className={`barra-menu__item barra-menu__item--${variante} ${className || ""}`}
      {...props}
    />
  );
}

function BarraMenuSeparador({ className, ...props }) {
  return (
    <MenubarPrimitive.Separator
      data-slot="barra-menu-separador"
      className={`barra-menu__separador ${className || ""}`}
      {...props}
    />
  );
}

function BarraMenuAtalho({ className, ...props }) {
  return (
    <span
      data-slot="barra-menu-atalho"
      className={`barra-menu__atalho ${className || ""}`}
      {...props}
    />
  );
}

function BarraMenuSubGatilho({ className, recuo, children, ...props }) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="barra-menu-sub-gatilho"
      data-inset={recuo}
      className={`barra-menu__sub-gatilho ${className || ""}`}
      {...props}
    >
      {children}
      <ChevronRightIcon className="barra-menu__icone-sub" />
    </MenubarPrimitive.SubTrigger>
  );
}

function BarraMenuSubConteudo({ className, ...props }) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="barra-menu-sub-conteudo"
      className={`barra-menu__sub-conteudo ${className || ""}`}
      {...props}
    />
  );
}

export {
  BarraMenu,
  BarraMenuPortal,
  BarraMenuMenu,
  BarraMenuGatilho,
  BarraMenuConteudo,
  BarraMenuGrupo,
  BarraMenuSeparador,
  BarraMenuItem,
  BarraMenuAtalho,
  BarraMenuRadioGrupo,
  BarraMenuSubGatilho,
  BarraMenuSubConteudo,
};