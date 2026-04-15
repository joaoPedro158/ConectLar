"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDownIcon } from "lucide-react";
import "./MenuNavegacao.css";

function MenuNavegacao({ className, children, viewport = true, ...props }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="menu-navegacao"
      className={`menu-navegacao ${className || ""}`}
      {...props}
    >
      {children}
      {viewport && <MenuNavegacaoViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function MenuNavegacaoLista({ className, ...props }) {
  return <NavigationMenuPrimitive.List className={`menu-navegacao__lista ${className || ""}`} {...props} />;
}

function MenuNavegacaoItem({ ...props }) {
  return <NavigationMenuPrimitive.Item data-slot="menu-navegacao-item" {...props} />;
}

function MenuNavegacaoGatilho({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger className={`menu-navegacao__gatilho ${className || ""}`} {...props}>
      {children}
      <ChevronDownIcon className="menu-navegacao__icone" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function MenuNavegacaoConteudo({ className, ...props }) {
  return <NavigationMenuPrimitive.Content className={`menu-navegacao__conteudo ${className || ""}`} {...props} />;
}

function MenuNavegacaoViewport({ className, ...props }) {
  return (
    <div className="menu-navegacao__viewport-wrapper">
      <NavigationMenuPrimitive.Viewport className={`menu-navegacao__viewport ${className || ""}`} {...props} />
    </div>
  );
}

function MenuNavegacaoLink({ className, ...props }) {
  return <NavigationMenuPrimitive.Link className={`menu-navegacao__link ${className || ""}`} {...props} />;
}

export {
  MenuNavegacao,
  MenuNavegacaoLista,
  MenuNavegacaoItem,
  MenuNavegacaoConteudo,
  MenuNavegacaoGatilho,
  MenuNavegacaoLink,
  MenuNavegacaoViewport,
};