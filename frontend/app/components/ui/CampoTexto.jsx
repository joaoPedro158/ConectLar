import * as React from "react";
import "../../../styles/ui/CampoTexto.css";

function Input({ className, type, ...props }) {
  const classesFinais = [
    "campo-texto",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <input
      type={type}
      data-slot="input"
      className={classesFinais}
      {...props}
    />
  );
}

export { Input };
