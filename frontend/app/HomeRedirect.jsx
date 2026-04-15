import React from "react";
import { ClientFeed } from "./pages/cliente/ClientFeed";
import { ProfessionalFeed } from "./pages/profissional/ProfessionalFeed";
import { useAuth } from "./context/ContextoAutenticacao";

export function HomeRedirect() {
  const { modoAtivo } = useAuth();
  console.log('[DEBUG][HomeRedirect] modoAtivo:', modoAtivo);
  if (modoAtivo === "profissional") {
    return <ProfessionalFeed />;
  }
  return <ClientFeed />;
}
