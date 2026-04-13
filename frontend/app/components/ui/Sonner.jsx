"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import "../../../styles/ui/Sonner.css";

function Toaster(props) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      {...props}
    />
  );
}

export { Toaster };
