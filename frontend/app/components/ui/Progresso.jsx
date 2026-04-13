"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import "../../../styles/ui/Progresso.css";

function Progress({ className, value, ...props }) {
  const classesFinais = [
    "progresso",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={classesFinais}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="progresso__indicador"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
