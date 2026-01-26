import { ArrowLeft, MapPin, DollarSign, Clock, Calendar, MessageCircle, Star, Send } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trabalho, Proposta } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ServiceRequestDetailProps {
  request: Trabalho & { 
    nomeUsuario?: string;
    categoria_nome?: string;
  };
  propostas: Proposta[];
  onBack: () => void;
  onSelectProfessional: (profissionalId: string) => void;
  onAcceptProposal?: (propostaId: string) => void;
  onSendProposal?: () => void;
  userRole?: string;
  userHasSentProposal?: boolean;
}

export function ServiceRequestDetail({ 
  request, 
  propostas,
  onBack, 
  onSelectProfessional,
  onAcceptProposal,
  onSendProposal,
  userRole,
  userHasSentProposal
}: ServiceRequestDetailProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d atrás`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-xl font-bold">Detalhes do Serviço</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Request Info Card */}
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700">
              {request.categoria_nome || "Serviço Geral"}
            </Badge>
            <Badge className="bg-yellow-100 text-yellow-700">
              {request.status === "pendente" ? "Aguardando Propostas" : request.status}
            </Badge>
          </div>

          <h2 className="text-xl font-bold mb-2 dark:text-white">{request.problema}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{request.descricao}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-600 dark:text-green-400 text-lg">
                {formatCurrency(request.pagamento)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>
                {request.rua}, {request.numero} - {request.bairro}, {request.cidade}/{request.estado}
              </span>
            </div>

            {request.nomeUsuario && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <MessageCircle className="w-4 h-4" />
                <span>Cliente: {request.nomeUsuario}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Publicado {formatTimeAgo(request.data_abertura)}</span>
            </div>
          </div>
        </Card>

        {/* Propostas Section */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 dark:text-white">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Propostas dos Profissionais ({propostas.length})
          </h3>

          {/* Botão Enviar Proposta para Profissionais */}
          {userRole === "profissional" && onSendProposal && !userHasSentProposal && (
            <Button
              onClick={onSendProposal}
              className="w-full mb-4 bg-blue-500 hover:bg-blue-600"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Proposta
            </Button>
          )}

          {userRole === "profissional" && userHasSentProposal && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                ✓ Você já enviou uma proposta para este serviço
              </p>
            </div>
          )}

          {propostas.length === 0 ? (
            <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Ainda não há propostas para este serviço.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Aguarde os profissionais enviarem suas propostas.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {propostas.map((proposta) => (
                <Card key={proposta.id} className="p-4 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <Avatar 
                      className="w-12 h-12 cursor-pointer" 
                      onClick={() => onSelectProfessional(proposta.id_profissional)}
                    >
                      <AvatarImage src={proposta.profissional_foto} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {proposta.profissional_nome.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 
                            className="font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer dark:text-white"
                            onClick={() => onSelectProfessional(proposta.id_profissional)}
                          >
                            {proposta.profissional_nome}
                          </h4>
                          {proposta.profissional_rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium dark:text-gray-300">{proposta.profissional_rating}</span>
                              <span className="text-gray-500 dark:text-gray-500">
                                ({proposta.profissional_reviews} avaliações)
                              </span>
                            </div>
                          )}
                        </div>
                        {proposta.valor_proposto && (
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(proposta.valor_proposto)}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{proposta.mensagem}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTimeAgo(proposta.data_proposta)}
                        </span>

                        {userRole === "usuario" && proposta.status === "pendente" && onAcceptProposal && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => onAcceptProposal(proposta.id)}
                          >
                            Aceitar Proposta
                          </Button>
                        )}

                        {proposta.status === "aceita" && (
                          <Badge className="bg-green-100 text-green-700">Aceita</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}