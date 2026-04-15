import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import "../../../styles/ui/Distintivo.css";

function Badge({
  className,
  variant = "padrao",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";

  const classesFinais = [
    "distintivo",
    `distintivo--${variant}`,
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <Comp
      data-slot="badge"
      className={classesFinais}
      {...props}
    />
  );
}

export { Badge };
