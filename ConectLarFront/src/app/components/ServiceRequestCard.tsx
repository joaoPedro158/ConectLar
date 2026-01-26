import { MapPin, DollarSign, Calendar, Clock, User } from "lucide-react";
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
  userRole 
}: ServiceRequestCardProps) {
  const getCategoriaColor = (categoriaId: string) => {
    const colors: { [key: string]: string } = {
      "1": "bg-blue-100 text-blue-700",
      "2": "bg-yellow-100 text-yellow-700",
      "3": "bg-purple-100 text-purple-700",
      "4": "bg-orange-100 text-orange-700",
      "5": "bg-brown-100 text-brown-700",
      "6": "bg-green-100 text-green-700",
      "7": "bg-red-100 text-red-700",
      "8": "bg-gray-100 text-gray-700",
    };
    return colors[categoriaId] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Pendente</Badge>;
      case "aceito":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-300">Aceito</Badge>;
      case "em_andamento":
        return <Badge className="bg-purple-100 text-purple-700 border-purple-300">Em Andamento</Badge>;
      case "concluido":
        return <Badge className="bg-green-100 text-green-700 border-green-300">Concluído</Badge>;
      case "cancelado":
        return <Badge className="bg-red-100 text-red-700 border-red-300">Cancelado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Novo</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} min atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      return date.toLocaleDateString("pt-BR");
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
      onClick={() => onClick?.(request)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getCategoriaColor(request.id_usuario.split('')[0] || "8")}>
              {request.categoria_nome || "Serviço Geral"}
            </Badge>
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
            {formatCurrency(request.pagamento)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <MapPin className="w-4 h-4" />
          <span>
            {request.bairro}, {request.cidade} - {request.estado}
          </span>
        </div>

        {request.nomeUsuario && (
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <User className="w-4 h-4" />
            <span>{request.nomeUsuario}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          <span>Publicado {formatDate(request.data_abertura)}</span>
        </div>
      </div>

      {/* Accept Button (only for professionals) */}
      {showAcceptButton && userRole === "profissional" && request.status === "pendente" && (
        <Button
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={(e) => {
            e.stopPropagation();
            onAccept?.(request.id);
          }}
        >
          Aceitar Serviço
        </Button>
      )}

      {/* View Details Button (for clients) */}
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