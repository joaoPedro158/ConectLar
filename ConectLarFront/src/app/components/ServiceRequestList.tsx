import { ServiceRequestCard } from "./ServiceRequestCard";
import { Trabalho } from "../types";
import { Package } from "lucide-react";

interface ServiceRequestListProps {
  requests: (Trabalho & { 
    nomeUsuario?: string;
    categoria_nome?: string;
  })[];
  onAccept?: (requestId: string) => void;
  onSelectRequest?: (request: Trabalho) => void;
  userRole?: string;
  showAcceptButton?: boolean;
}

export function ServiceRequestList({ 
  requests, 
  onAccept, 
  onSelectRequest,
  userRole,
  showAcceptButton 
}: ServiceRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
          <Package className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum serviço disponível
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {userRole === "profissional" 
            ? "Não há pedidos de serviço no momento. Volte mais tarde!"
            : "Você ainda não publicou nenhum serviço. Clique no botão + para começar!"
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 dark:text-white">
        {userRole === "profissional" ? "Serviços Disponíveis" : "Meus Pedidos"}
      </h2>
      <div className="space-y-3">
        {requests.map((request) => (
          <ServiceRequestCard
            key={request.id}
            request={request}
            onAccept={onAccept}
            onClick={onSelectRequest}
            showAcceptButton={showAcceptButton}
            userRole={userRole}
          />
        ))}
      </div>
    </div>
  );
}