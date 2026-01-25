import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { HistoricoPedido, Trabalho } from "../types";
import {
  Star,
  Calendar,
  Box,
  CheckCircle,
  TrendingUp,
  Filter,
  ChevronDown,
  Check
} from "lucide-react";

interface HistoryScreenProps {
  onBack?: () => void;
  serviceRequests?: (Trabalho & {
    nomeUsuario?: string;
    categoria_nome?: string;
  })[];
}

interface PedidoComDetalhes extends HistoricoPedido {
  categoria?: string;
  status?: string;
  valor?: number;
}

export function HistoryScreen({ onBack, serviceRequests = [] }: HistoryScreenProps) {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<PedidoComDetalhes[]>([]);

  const [activeDropdown, setActiveDropdown] = useState<"status" | "date" | null>(null);
  const [selectedStatus, setSelectedStatus] = useState("Todos os status");
  const [selectedDate, setSelectedDate] = useState("Mais recentes");

  const [stats, setStats] = useState({
    total: 0,
    concluidos: 0,
    avaliacaoMedia: 0,
    totalMonetario: 0
  });

  useEffect(() => {
    if (!user) return;

    // Por enquanto, sem mock: só usa o que vier de verdade por props
    // (Depois você troca para consumir /usuario/historico no backend.)
    if (user.role === "usuario") {
      const realRequests: PedidoComDetalhes[] = serviceRequests
        .filter(req => req.id_usuario === user.id)
        .map(req => ({
          id: req.id,
          avaliacao: 0,
          trabalho_feito: req.problema,
          data_hora: req.data_abertura,
          id_profissional: req.id_profissional || "pendente",
          id_usuario: req.id_usuario,
          id_trabalho: req.id,
          categoria: req.categoria_nome || "Geral",
          status: req.status || "pendente",
          valor: req.pagamento || 0
        }));

      setPedidos(realRequests);

      const total = realRequests.length;
      const concluidos = realRequests.filter(p => p.status === "concluido").length;
      const totalGasto = realRequests.reduce((acc, curr) => acc + (curr.valor || 0), 0);

      setStats({
        total,
        concluidos,
        avaliacaoMedia: 0, // sem inventar dado
        totalMonetario: totalGasto
      });
    }
  }, [user, serviceRequests]);

  const getFilteredPedidos = () => {
    let filtered = [...pedidos];

    if (selectedStatus !== "Todos os status") {
      const statusMap: Record<string, string> = {
        "Aguardando": "pendente",
        "Aceito": "aceito",
        "Em Andamento": "em_andamento",
        "Concluído": "concluido",
        "Cancelado": "cancelado"
      };
      const targetStatus = statusMap[selectedStatus];
      if (targetStatus) filtered = filtered.filter(p => p.status === targetStatus);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.data_hora).getTime();
      const dateB = new Date(b.data_hora).getTime();
      return selectedDate === "Mais recentes" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isYesterday =
      new Date(today.setDate(today.getDate() - 1)).toDateString() === date.toDateString();

    if (isYesterday) return "Ontem";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-100 text-green-700";
      case "em_andamento":
        return "bg-purple-100 text-purple-700";
      case "aceito":
        return "bg-blue-100 text-blue-700";
      case "cancelado":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "concluido":
        return "Concluído";
      case "em_andamento":
        return "Em Andamento";
      case "aceito":
        return "Aceito";
      case "pendente":
        return "Aberto";
      case "cancelado":
        return "Cancelado";
      default:
        return status;
    }
  };

  const statusOptions = ["Todos os status", "Aguardando", "Aceito", "Em Andamento", "Concluído", "Cancelado"];
  const dateOptions = ["Mais recentes", "Mais antigos"];

  if (!user) return null;

  const pedidosFiltrados = getFilteredPedidos();

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h2>
        <p className="text-gray-500 text-sm">Histórico completo dos seus serviços solicitados</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex flex-col justify-between h-32">
          <div className="flex items-start gap-2 text-blue-600 dark:text-blue-400">
            <Box className="w-5 h-5" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</span>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex flex-col justify-between h-32">
          <div className="flex items-start gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Concluídos</span>
          </div>
          <span className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.concluidos}</span>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl flex flex-col justify-between h-32">
          <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-400">
            <Star className="w-5 h-5" />
            <span className="text-sm font-medium">Avaliação</span>
          </div>
          <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">{stats.avaliacaoMedia}</span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex flex-col justify-between h-32">
          <div className="flex items-start gap-2 text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total Gasto</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">R$</span>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.totalMonetario}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 relative z-20">
        <div className="flex-1 relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === "status" ? null : "status")}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="truncate">{selectedStatus}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${activeDropdown === "status" ? "rotate-180" : ""}`}
            />
          </button>

          {activeDropdown === "status" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50">
              {statusOptions.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedStatus(option);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  {option}
                  {selectedStatus === option && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 relative">
          <button
            onClick={() => setActiveDropdown(activeDropdown === "date" ? null : "date")}
            className="w-full flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="truncate">{selectedDate}</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${activeDropdown === "date" ? "rotate-180" : ""}`}
            />
          </button>

          {activeDropdown === "date" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50">
              {dateOptions.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setSelectedDate(option);
                    setActiveDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  {option}
                  {selectedDate === option && <Check className="w-4 h-4 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {pedidosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="font-medium">Seu histórico aparecerá aqui assim que houver feito pedidos.</p>
          </div>
        ) : (
          pedidosFiltrados.map(pedido => (
            <div
              key={pedido.id}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {pedido.categoria || "Geral"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(pedido.status || "")}`}>
                    {pedido.status === "concluido" && <Box className="w-3 h-3" />}
                    {getStatusLabel(pedido.status || "")}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{pedido.trabalho_feito}</h3>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(pedido.data_hora)}
                </div>
                <div className="text-green-600 font-bold text-lg">{formatCurrency(pedido.valor || 0)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
