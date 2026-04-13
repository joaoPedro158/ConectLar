"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import "./MenuSuspenso.css";

function MenuSuspenso({ ...props }) {
  return <DropdownMenuPrimitive.Root data-slot="menu-suspenso" {...props} />;
}

function MenuSuspensoPortal({ ...props }) {
  return <DropdownMenuPrimitive.Portal data-slot="menu-suspenso-portal" {...props} />;
}

function MenuSuspensoGatilho({ ...props }) {
  return <DropdownMenuPrimitive.Trigger data-slot="menu-suspenso-gatilho" {...props} />;
}

function MenuSuspensoConteudo({ className, deslocamentoLateral = 4, ...props }) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="menu-suspenso-conteudo"
        sideOffset={deslocamentoLateral}
        className={`menu-suspenso__conteudo ${className || ""}`}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function MenuSuspensoGrupo({ ...props }) {
  return <DropdownMenuPrimitive.Group data-slot="menu-suspenso-grupo" {...props} />;
}

function MenuSuspensoItem({ className, recuo, variante = "padrao", ...props }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="menu-suspenso-item"
      data-inset={recuo}
      data-variant={variante}
      className={`menu-suspenso__item menu-suspenso__item--${variante} ${className || ""}`}
      {...props}
    />
  );
}

function MenuSuspensoCheckboxItem({ className, children, marcado, ...props }) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="menu-suspenso-checkbox"
      className={`menu-suspenso__item-checkbox ${className || ""}`}
      checked={marcado}
      {...props}
    >
      <span className="menu-suspenso__indicador">
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon size={14} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

function MenuSuspensoLabel({ className, recuo, ...props }) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="menu-suspenso-label"
      className={`menu-suspenso__label ${className || ""}`}
      {...props}
    />
  );
}

function MenuSuspensoSeparador({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="menu-suspenso-separador"
      className={`menu-suspenso__separador ${className || ""}`}
      {...props}
    />
  );
}

function MenuSuspensoSubGatilho({ className, children, ...props }) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="menu-suspenso-sub-gatilho"
      className={`menu-suspenso__sub-gatilho ${className || ""}`}
      {...props}
    >
      {children}
      <ChevronRightIcon className="menu-suspenso__icone-sub" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

function MenuSuspensoSubConteudo({ className, ...props }) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="menu-suspenso-sub-conteudo"
      className={`menu-suspenso__sub-conteudo ${className || ""}`}
      {...props}
    />
  );
}

export {
  MenuSuspenso,
  MenuSuspensoPortal,
  MenuSuspensoGatilho,
  MenuSuspensoConteudo,
  MenuSuspensoGrupo,
  MenuSuspensoItem,
  MenuSuspensoCheckboxItem,
  MenuSuspensoLabel,
  MenuSuspensoSeparador,
  MenuSuspensoSubGatilho,
  MenuSuspensoSubConteudo,
};