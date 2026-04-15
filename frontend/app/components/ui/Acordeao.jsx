"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import "./Acordeao.css";

function Acordeao({ ...props }) {
  return <AccordionPrimitive.Root data-slot="acordeao" {...props} />;
}

function AcordeaoItem({ className, ...props }) {
  return (
    <AccordionPrimitive.Item
      data-slot="acordeao-item"
      className={`acordeao__item ${className || ""}`}
      {...props}
    />
  );
}

function AcordeaoGatilho({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Header className="acordeao__cabecalho">
      <AccordionPrimitive.Trigger
        data-slot="acordeao-gatilho"
        className={`acordeao__gatilho ${className || ""}`}
        {...props}
      >
        {children}
        <ChevronDownIcon 
          className="acordeao__icone" 
          aria-hidden="true" 
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AcordeaoConteudo({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      data-slot="acordeao-conteudo"
      className="acordeao__conteudo"
      {...props}
    >
      <div className={`acordeao__corpo ${className || ""}`}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Acordeao, AcordeaoItem, AcordeaoGatilho, AcordeaoConteudo };