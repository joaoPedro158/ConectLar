import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { ClientFeed } from "./pages/ClientFeed";
import { ConectaRide } from "./pages/ConectaRide";
import { ProfessionalFeed } from "./pages/ProfessionalFeed";
import { Perfil } from "./pages/Perfil";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ClientFeed },
      { path: "conectaride", Component: ConectaRide },
      { path: "profissional", Component: ProfessionalFeed },
      { path: "perfil", Component: Perfil },
    ],
  },
]);