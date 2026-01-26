import { MapPin, DollarSign, Clock, User } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trabalho } from "../types";

interface ServiceRequestCardProps {
  request: Trabalho & {
    nomeUsuario?: string;
    categoria_nome?: string;
  };
  onAccept?: (requestId: string) => void;
  onClick?: (request: Trabalho) => void;
  showAcceptButton?: boolean;
  userRole?: string;
}

export function ServiceRequestCard({
  request,
  onAccept,
  onClick,
  showAcceptButton = true,
  userRole,
}: ServiceRequestCardProps) {
  const CATEGORIA_LABEL: Record<string, string> = {
    ENCANADOR: "Encanador",
    ELETRICISTA: "Eletricista",
    LIMPEZA: "Limpeza",
    PINTOR: "Pintor",
    MARCENEIRO: "Marceneiro",
    JARDINEIRO: "Jardineiro",
    MECANICO: "Mecânico",
    GERAL: "Serviço Geral",
  };

  const getCategoriaColor = (categoriaKey: string) => {
    const colors: Record<string, string> = {
      ENCANADOR: "bg-blue-100 text-blue-700",
      ELETRICISTA: "bg-yellow-100 text-yellow-700",
      LIMPEZA: "bg-purple-100 text-purple-700",
      PINTOR: "bg-orange-100 text-orange-700",
      MARCENEIRO: "bg-amber-100 text-amber-800",
      JARDINEIRO: "bg-green-100 text-green-700",
      MECANICO: "bg-red-100 text-red-700",
      GERAL: "bg-gray-100 text-gray-700",
    };
    return colors[categoriaKey] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ABERTO":
        return <Badge className="bg-yellow-100 text-yellow-700">Aberto</Badge>;
      case "EM_ESPERA":
        return <Badge className="bg-blue-100 text-blue-700">Em Espera</Badge>;
      case "EM_ANDAMENTO":
        return <Badge className="bg-purple-100 text-purple-700">Em Andamento</Badge>;
      case "CONCLUIDO":
        return <Badge className="bg-green-100 text-green-700">Concluído</Badge>;
      case "CANCELADO":
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Novo</Badge>;
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} min atrás`;
    }
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return date.toLocaleDateString("pt-BR");
  };

  // ✅ categoria vindo do back (ideal: request.categoria = "ENCANADOR", "PINTOR", etc)
  const categoriaKey = String((request as any).categoria ?? "GERAL").toUpperCase();
  const categoriaLabel =
    request.categoria_nome || CATEGORIA_LABEL[categoriaKey] || "Serviço Geral";

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
      onClick={() => onClick?.(request)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {/* ✅ Badge de categoria com label + cor corretos */}
            <Badge className={getCategoriaColor(categoriaKey)}>{categoriaLabel}</Badge>

            {getStatusBadge(request.status)}
          </div>

          <h3 className="font-semibold text-lg mb-1 dark:text-white">{request.problema}</h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
            {request.descricao}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="font-semibold text-green-600 dark:text-green-400 text-base">
            {formatCurrency(Number(request.pagamento))}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <MapPin className="w-4 h-4" />
          <span>
            {request.localizacao?.bairro}, {request.localizacao?.cidade} -{" "}
            {request.localizacao?.estado}
          </span>
        </div>

        {request.nomeUsuario && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <User className="w-4 h-4" />
            <span>{request.nomeUsuario}</span>
          </div>
        )}

        {!!(request as any).dataHoraAberta && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>Publicado {formatDate(String((request as any).dataHoraAberta))}</span>
          </div>
        )}
      </div>

      {showAcceptButton && userRole === "profissional" && request.status === "ABERTO" && (
        <Button
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={(e) => {
            e.stopPropagation();
            onAccept?.(String(request.id));
          }}
        >
          Aceitar Serviço
        </Button>
      )}

      {userRole === "usuario" && (
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(request);
          }}
        >
          Ver Detalhes
        </Button>
      )}
    </Card>
  );
}
