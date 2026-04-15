import * as React from "react";
import "../../../styles/ui/AreaTexto.css";

function Textarea({ className, ...props }) {
  const classesFinais = [
    "area-texto",
    className || ""
  ].filter(Boolean).join(" ").trim();

  return (
    <textarea
      data-slot="textarea"
      className={classesFinais}
      {...props}
    />
  );
}

export { Textarea };
