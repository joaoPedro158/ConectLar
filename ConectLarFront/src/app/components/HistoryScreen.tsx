import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Trabalho, StatusTrabalho } from "../types";
import { historicoTrabalhos } from "../services/trabalhos";
import {
  Star,
  Calendar,
  Box,
  CheckCircle,
  TrendingUp,
  Filter,
  ChevronDown,
  Check,
} from "lucide-react";

type HistoryScreenProps = {
  onSelectRequest?: (t: Trabalho) => void;
};

export function HistoryScreen({ onSelectRequest }: HistoryScreenProps) {
  const { user } = useAuth();

  const [items, setItems] = useState<Trabalho[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<"status" | "date" | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos os status");
  const [selectedDate, setSelectedDate] = useState<string>("Mais recentes");

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
      try {
        const data = await historicoTrabalhos();
        setItems(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const statusLabel: Record<StatusTrabalho, string> = {
    ABERTO: "Aberto",
    EM_ESPERA: "Em Espera",
    EM_ANDAMENTO: "Em Andamento",
    CONCLUIDO: "Concluído",
    CANCELADO: "Cancelado",
  };

  // UI dos filtros -> status real do backend
  const statusMapUIToBackend: Record<string, StatusTrabalho | null> = {
    "Todos os status": null,
    Aberto: "ABERTO",
    "Em Espera": "EM_ESPERA",
    "Em Andamento": "EM_ANDAMENTO",
    Concluído: "CONCLUIDO",
    Cancelado: "CANCELADO",
  };

  const statusOptions = Object.keys(statusMapUIToBackend);
  const dateOptions = ["Mais recentes", "Mais antigos"];

  const pedidosFiltrados = useMemo(() => {
    let filtered = [...items];

    const target = statusMapUIToBackend[selectedStatus] ?? null;
    if (target) {
      filtered = filtered.filter((t) => t.status === target);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dataHoraAberta).getTime();
      const dateB = new Date(b.dataHoraAberta).getTime();
      return selectedDate === "Mais recentes" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [items, selectedStatus, selectedDate]);

  const stats = useMemo(() => {
    const total = items.length;
    const concluidos = items.filter((t) => t.status === "CONCLUIDO").length;
    const totalMonetario = items.reduce((acc, t) => acc + Number(t.pagamento || 0), 0);

    return {
      total,
      concluidos,
      avaliacaoMedia: 0, // sem mock
      totalMonetario,
    };
  }, [items]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (yesterday.toDateString() === date.toDateString()) return "Ontem";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getStatusColor = (status: StatusTrabalho) => {
    switch (status) {
      case "CONCLUIDO":
        return "bg-green-100 text-green-700";
      case "EM_ANDAMENTO":
        return "bg-purple-100 text-purple-700";
      case "EM_ESPERA":
        return "bg-blue-100 text-blue-700";
      case "CANCELADO":
        return "bg-red-100 text-red-700";
      case "ABERTO":
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Meus Pedidos</h2>
        <p className="text-gray-500 text-sm">Histórico completo dos seus serviços</p>
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
          <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">
            {stats.avaliacaoMedia}
          </span>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex flex-col justify-between h-32">
          <div className="flex items-start gap-2 text-purple-600 dark:text-purple-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total Gasto</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">R$</span>
            <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {formatCurrency(stats.totalMonetario)}
            </span>
          </div>
        </div>
      </div>

      {/* filtros */}
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
              className={`w-4 h-4 text-gray-400 transition-transform ${
                activeDropdown === "status" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeDropdown === "status" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50">
              {statusOptions.map((option) => (
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
              className={`w-4 h-4 text-gray-400 transition-transform ${
                activeDropdown === "date" ? "rotate-180" : ""
              }`}
            />
          </button>

          {activeDropdown === "date" && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50">
              {dateOptions.map((option) => (
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

      {/* lista */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando histórico...</div>
        ) : pedidosFiltrados.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p className="font-medium">Seu histórico aparecerá aqui quando houver serviços.</p>
          </div>
        ) : (
          pedidosFiltrados.map((t) => (
            <div
              key={t.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectRequest?.(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelectRequest?.(t);
              }}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
            >

              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {"Serviço"}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(
                      t.status
                    )}`}
                  >
                    {t.status === "CONCLUIDO" && <Box className="w-3 h-3" />}
                    {statusLabel[t.status]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    // aqui você coloca setOpen(...) se criar expansão
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </button>

              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.problema}</h3>

              <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(t.dataHoraAberta)}
                </div>
                <div className="text-green-600 font-bold text-lg">{formatCurrency(Number(t.pagamento || 0))}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
