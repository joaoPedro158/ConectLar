"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CircleIcon } from "lucide-react";
import "./GrupoRadio.css";

function GrupoRadio({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="grupo-radio"
      className={`grupo-radio ${className || ""}`}
      {...props}
    />
  );
}

function GrupoRadioItem({ className, ...props }) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="grupo-radio-item"
      className={`grupo-radio__item ${className || ""}`}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="grupo-radio__indicador">
        <CircleIcon className="grupo-radio__icone" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { GrupoRadio, GrupoRadioItem };