"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import "../../../styles/ui/Interruptor.css";

function Switch({
  className,
  ...props
}) {
  const classesFinais = [
    "interruptor",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={classesFinais}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="interruptor__polegar"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
