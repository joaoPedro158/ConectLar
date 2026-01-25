import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, MapPin, DollarSign, Clock, MessageCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trabalho } from "../types";
import { listarPropostasPorTrabalho, aceitarProposta, recusarProposta, type Proposta } from "../services/propostas";

import { useNotifications } from "@/app/contexts/NotificationContext";

interface ServiceRequestDetailProps {
  request: Trabalho & { nomeUsuario?: string; categoria_nome?: string };
  onBack: () => void;
  onSelectProfessional: (profissionalId: string) => void;
  userRole?: "usuario" | "profissional" | "admin";
}

export function ServiceRequestDetail({ request, onBack, onSelectProfessional, userRole }: ServiceRequestDetailProps) {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loadingPropostas, setLoadingPropostas] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const { addNotification } = useNotifications();

  useEffect(() => {
    (async () => {
      setLoadingPropostas(true);
      try {
        const data = await listarPropostasPorTrabalho(Number(request.id));
        setPropostas(data);
      } catch (e) {
        console.error(e);
        setPropostas([]);
      } finally {
        setLoadingPropostas(false);
      }
    })();
  }, [request.id]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatTimeAgo = (iso: string) => {
    const date = new Date(iso);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    if (diffMin < 1) return "Agora";
    if (diffMin < 60) return `${diffMin} min atrás`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH} h atrás`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD} d atrás`;
  };

  const statusBadge = (status: Proposta["status"]) => {
    const map: Record<Proposta["status"], { label: string; cls: string }> = {
      PENDENTE: { label: "Pendente", cls: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      ACEITA: { label: "Aceita", cls: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      RECUSADA: { label: "Recusada", cls: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    };
    const c = map[status];
    return <Badge className={c.cls}>{c.label}</Badge>;
  };

  const propostasOrdenadas = useMemo(() => {
    return [...propostas].sort((a, b) => new Date(b.dataHoraProposta).getTime() - new Date(a.dataHoraProposta).getTime());
  }, [propostas]);

  const refresh = async () => {
    const data = await listarPropostasPorTrabalho(Number(request.id));
    setPropostas(data);
  };

  const handleAccept = async (propostaId: number) => {
    setBusyId(propostaId);
    try {
      await aceitarProposta(propostaId);
      await refresh();

      addNotification?.({
        tipo: "proposta_aceita",
        titulo: "Proposta aceita",
        mensagem: "Você aceitou uma proposta. O profissional será avisado.",
        data: new Date().toISOString(),
        lida: false,
        id_relacionado: String(propostaId),
      });
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (propostaId: number) => {
    setBusyId(propostaId);
    try {
      await recusarProposta(propostaId);
      await refresh();

      addNotification?.({
        tipo: "proposta_rejeitada",
        titulo: "Proposta recusada",
        mensagem: "Você recusou uma proposta.",
        data: new Date().toISOString(),
        lida: false,
        id_relacionado: String(propostaId),
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-3">
          <button onClick={onBack} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-xl font-bold">Detalhes do Serviço</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Request */}
        <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700">{request.categoria_nome || "Serviço Geral"}</Badge>
            <Badge className="bg-yellow-100 text-yellow-700">{request.status === "pendente" ? "Aguardando Propostas" : request.status}</Badge>
          </div>

          <h2 className="text-xl font-bold mb-2 dark:text-white">{request.problema}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{request.descricao}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-green-600 dark:text-green-400 text-lg">{formatCurrency(request.pagamento)}</span>
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

        {/* Propostas */}
        <div>
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 dark:text-white">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Propostas ({propostas.length})
          </h3>

          {loadingPropostas ? (
            <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">Carregando propostas...</p>
            </Card>
          ) : propostasOrdenadas.length === 0 ? (
            <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">Ainda não há propostas.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {propostasOrdenadas.map((p) => (
                <Card key={p.id} className="p-4 dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <button
                      onClick={() => onSelectProfessional(String(p.idProfissional))}
                      className="text-left font-semibold text-gray-900 dark:text-white hover:underline"
                    >
                      Profissional #{p.idProfissional}
                    </button>
                    <div className="flex items-center gap-2">
                      {statusBadge(p.status)}
                      <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(p.valorProposto)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{p.mensagem}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-500">{formatTimeAgo(p.dataHoraProposta)}</span>

                    {userRole === "usuario" && p.status === "PENDENTE" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === p.id}
                          onClick={() => handleReject(p.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Recusar
                        </Button>
                        <Button size="sm" disabled={busyId === p.id} className="bg-green-500 hover:bg-green-600" onClick={() => handleAccept(p.id)}>
                          Aceitar
                        </Button>
                      </div>
                    )}
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
