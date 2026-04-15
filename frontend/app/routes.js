import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { ClientFeed } from "./pages/cliente/ClientFeed";
import { ConectaRide } from "./pages/ConectaRide";
import { ProfessionalFeed } from "./pages/profissional/ProfessionalFeed";
import { Perfil } from "./pages/Perfil";
import { HomeRedirect } from "./HomeRedirect";
import SolicitarServico from "./pages/cliente/SolicitarServico";
import GerenciarProposta from "./pages/profissional/GerenciarProposta";
import ServicoAtivo from "./pages/profissional/ServicoAtivo";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomeRedirect },
      { path: "conectaride", Component: ConectaRide },
      { path: "profissional", Component: ProfessionalFeed },
      { path: "perfil", Component: Perfil },
      { path: "solicitar-servico", Component: SolicitarServico },
      { path: "gerenciar-proposta", Component: GerenciarProposta },
      { path: "servico-ativo", Component: ServicoAtivo },
    ],
  },
]);