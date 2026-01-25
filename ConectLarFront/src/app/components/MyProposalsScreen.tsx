import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { listarMinhasPropostas, type Proposta } from "../../services/propostas";
import { useNotifications } from "@/app/contexts/NotificationContext";

import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Send, CheckCircle, XCircle, Clock, Filter, Calendar, DollarSign, TrendingUp, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

function key(p: Proposta) {
  return String(p.id);
}

interface MyProposalsScreenProps {
  onBack?: () => void;
  onSelectRequest?: (requestId: string) => void;
}

export function MyProposalsScreen({ onBack, onSelectRequest }: MyProposalsScreenProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [ordenacao, setOrdenacao] = useState<string>("recentes");

  const lastMapRef = useRef<Record<string, Proposta["status"]>>({});
  const initializedRef = useRef(false);

  const fetchAndDetect = async () => {
    const data = await listarMinhasPropostas();

    const prev = lastMapRef.current;
    const next: Record<string, Proposta["status"]> = {};

    for (const p of data) {
      const id = key(p);
      next[id] = p.status;

      const oldStatus = prev[id];

      // não notificar no 1º carregamento
      if (initializedRef.current && oldStatus && oldStatus !== p.status) {
        if (p.status === "ACEITA") {
          addNotification?.({
            tipo: "proposta_aceita",
            titulo: "Proposta aceita 🎉",
            mensagem: `Sua proposta #${p.id} foi aceita.`,
            data: new Date().toISOString(),
            lida: false,
            id_relacionado: String(p.id),
          });
        } else if (p.status === "RECUSADA") {
          addNotification?.({
            tipo: "proposta_rejeitada",
            titulo: "Proposta recusada",
            mensagem: `Sua proposta #${p.id} foi recusada.`,
            data: new Date().toISOString(),
            lida: false,
            id_relacionado: String(p.id),
          });
        }
      }
    }

    lastMapRef.current = next;
    initializedRef.current = true;
    setPropostas(data);
  };

  useEffect(() => {
    if (user?.role !== "profissional") return;

    let alive = true;

    fetchAndDetect().catch(console.error);

    const interval = setInterval(() => {
      if (!alive) return;
      fetchAndDetect().catch(console.error);
    }, 10000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, [user?.role]);

  const propostasOrdenadas = useMemo(() => {
    const filtradas = propostas.filter((p) => (filtroStatus === "todos" ? true : p.status === filtroStatus));

    return [...filtradas].sort((a, b) => {
      const ta = new Date(a.dataHoraProposta).getTime();
      const tb = new Date(b.dataHoraProposta).getTime();
      return ordenacao === "recentes" ? tb - ta : ta - tb;
    });
  }, [propostas, filtroStatus, ordenacao]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status: Proposta["status"]) => {
    const statusConfig: Record<Proposta["status"], { label: string; className: string; icon: JSX.Element }> = {
      PENDENTE: {
        label: "Aguardando",
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: <Clock className="w-3 h-3" />,
      },
      ACEITA: {
        label: "Aceita",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      RECUSADA: {
        label: "Recusada",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: <XCircle className="w-3 h-3" />,
      },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.className} flex items-center gap-1 font-medium`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const stats = useMemo(() => {
    const total = propostas.length;
    const aceitas = propostas.filter((p) => p.status === "ACEITA").length;
    const pendentes = propostas.filter((p) => p.status === "PENDENTE").length;
    const taxaAceitacao = total > 0 ? ((aceitas / total) * 100).toFixed(0) : "0";
    return { total, aceitas, pendentes, taxaAceitacao };
  }, [propostas]);

  if (!user || user.role !== "profissional") return null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Propostas</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Acompanhe todas as propostas que você enviou</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Total Enviadas</p>
          </div>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs font-medium text-green-600 dark:text-green-400">Aceitas</p>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.aceitas}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Pendentes</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pendentes}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-xs font-medium text-purple-600 dark:text-purple-400">Taxa Aceitação</p>
          </div>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.taxaAceitacao}%</p>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[160px]">
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="PENDENTE">Aguardando</SelectItem>
              <SelectItem value="ACEITA">Aceitas</SelectItem>
              <SelectItem value="RECUSADA">Recusadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <Select value={ordenacao} onValueChange={setOrdenacao}>
            <SelectTrigger className="bg-white dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <SelectValue placeholder="Ordenar" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recentes">Mais recentes</SelectItem>
              <SelectItem value="antigos">Mais antigos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {propostasOrdenadas.length === 0 ? (
          <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800/50">
            <Send className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
              {filtroStatus === "todos" ? "Nenhuma proposta ainda" : "Nenhuma proposta encontrada"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {filtroStatus === "todos" ? "Envie propostas para pedidos de serviço disponíveis" : "Tente ajustar os filtros acima"}
            </p>
          </Card>
        ) : (
          propostasOrdenadas.map((proposta) => (
            <Card key={proposta.id} className="p-4 hover:shadow-md transition-all bg-white dark:bg-gray-800">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs">
                    Trabalho #{proposta.idTrabalho}
                  </Badge>
                  {getStatusBadge(proposta.status)}
                </div>

                <button
                  className="text-left font-semibold text-gray-900 dark:text-white hover:underline"
                  onClick={() => onSelectRequest?.(String(proposta.idTrabalho))}
                >
                  Ver detalhes do trabalho
                </button>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Enviada {formatDate(proposta.dataHoraProposta)}</span>
                  </div>
                  <span>Profissional #{proposta.idProfissional}</span>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400 mb-1">Sua Proposta</p>
                  <p className="font-semibold text-green-700 dark:text-green-300 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    R$ {proposta.valorProposto}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-1">Sua mensagem:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{proposta.mensagem}</p>
                </div>

                {proposta.status === "ACEITA" && (
                  <div className="pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Parabéns! Sua proposta foi aceita!</span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Entre em contato com o cliente para combinar os detalhes</p>
                  </div>
                )}

                {proposta.status === "RECUSADA" && (
                  <div className="pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>O cliente recusou sua proposta</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
