import { useState } from "react";
import { ArrowLeft, MapPin, DollarSign, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Trabalho } from "../types";
import {
  responderCandidatura,
  concluirTrabalho,
  cancelarTrabalho,
} from "../services/trabalhos";
import { toast } from "sonner";


const API_BASE = "http://localhost:8181";


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

interface ServiceRequestDetailProps {
  request: Trabalho & { nomeUsuario?: string };
  onBack: () => void;
  userRole?: "usuario" | "profissional" | "admin";
  userId?: string | number;
  onReserve?: (requestId: number | string) => void;
  onUpdated?: () => Promise<void> | void;
}

export function ServiceRequestDetail({
  request,
  onBack,
  userRole,
  userId,
  onReserve,
  onUpdated,
}: ServiceRequestDetailProps) {
  const [loadingAction, setLoadingAction] = useState<
    null | "accept" | "reject" | "conclude" | "cancel"
  >(null);

  /* ✅ IMAGEM */
  const firstImg = (request as any).imagens?.[0];
  const imgUrl = firstImg ? `${API_BASE}/imagens/${firstImg}` : null;

  /* ✅ CATEGORIA */
  const categoriaKey = String((request as any).categoria ?? "GERAL").toUpperCase();
  const categoriaLabel = CATEGORIA_LABEL[categoriaKey] ?? "Serviço Geral";

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatTimeAgo = (iso?: string) => {
    if (!iso) return "";
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

  async function run(action: typeof loadingAction, fn: () => Promise<any>) {
    try {
      setLoadingAction(action);
      await fn();
      await onUpdated?.();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Erro na ação.");
    } finally {
      setLoadingAction(null);
    }
  }

  async function onAccept() {
    await run("accept", async () => {
      await responderCandidatura(Number(request.id), true);
      toast.success("Profissional aceito!");
      onBack();
    });
  }

  async function onReject() {
    await run("reject", async () => {
      await responderCandidatura(Number(request.id), false);
      toast.success("Profissional recusado.");
      onBack();
    });
  }

  async function onConclude() {
    await run("conclude", async () => {
      await concluirTrabalho(Number(request.id));
      toast.success("Serviço concluído!");
      onBack();
    });
  }

  async function onCancel() {
    await run("cancel", async () => {
      await cancelarTrabalho(Number(request.id));
      toast.success("Serviço cancelado!");
      onBack();
    });
  }

  const statusBadge = (status?: string) => {
    switch (status) {
      case "ABERTO":
        return <Badge className="bg-yellow-100 text-yellow-700">Aberto</Badge>;
      case "EM_ESPERA":
        return <Badge className="bg-blue-100 text-blue-700">Em espera</Badge>;
      case "EM_ANDAMENTO":
        return <Badge className="bg-purple-100 text-purple-700">Em andamento</Badge>;
      case "CONCLUIDO":
        return <Badge className="bg-green-100 text-green-700">Concluído</Badge>;
      case "CANCELADO":
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">—</Badge>;
    }
  };

  const loc = (request as any).localizacao ?? {};
  const dataHora = (request as any).dataHoraAberta ?? "";

  const isCliente = userRole === "usuario";
  const isProfissional = userRole === "profissional";

  const isOwnerCliente =
    userId != null && String((request as any).idUsuario) === String(userId);

  const isOwnerProfissional =
    userId != null &&
    (request as any).idProfissional != null &&
    String((request as any).idProfissional) === String(userId);

  const canReserve = isProfissional && request.status === "ABERTO";
  const canClientRespond =
    isCliente && isOwnerCliente && request.status === "EM_ESPERA";
  const canProFinalize =
    isProfissional && isOwnerProfissional && request.status === "EM_ANDAMENTO";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 mb-3"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
          <h1 className="text-xl font-bold">Detalhes do Serviço</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Card className="p-4">
          {imgUrl && (
            <img
              src={imgUrl}
              alt="Imagem do serviço"
              className="w-full h-48 object-cover rounded-lg mb-4 border"
            />
          )}

          <div className="flex items-center gap-2 mb-3">
            <Badge className="bg-blue-100 text-blue-700">{categoriaLabel}</Badge>
            {statusBadge(request.status)}
          </div>

          <h2 className="text-xl font-bold mb-2">{request.problema}</h2>
          <p className="text-gray-600 mb-4">{request.descricao}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-600 text-lg">
                {formatCurrency(Number(request.pagamento))}
              </span>
            </div>

            {(loc.rua || loc.bairro || loc.cidade) && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {loc.rua}, {loc.numero} - {loc.bairro}, {loc.cidade}/{loc.estado}
                </span>
              </div>
            )}

            {request.nomeUsuario && (
              <div className="text-sm text-gray-600">
                Cliente: <strong>{request.nomeUsuario}</strong>
              </div>
            )}

            {!!dataHora && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Publicado {formatTimeAgo(dataHora)}</span>
              </div>
            )}
          </div>

          {canReserve && (
            <Button className="w-full mt-4" onClick={() => onReserve?.(request.id)}>
              Reservar serviço
            </Button>
          )}

          {canClientRespond && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={onAccept}>Aceitar</Button>
              <Button variant="destructive" onClick={onReject}>
                Recusar
              </Button>
            </div>
          )}

          {canProFinalize && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button onClick={onConclude}>Concluir</Button>
              <Button variant="destructive" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
