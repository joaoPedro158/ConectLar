"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import "../../../styles/ui/Rotulo.css";

function Label({
  className,
  ...props
}) {
  const classesFinais = [
    "rotulo",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={classesFinais}
      {...props}
    />
  );
}

export { Label };
