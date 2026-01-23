import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Disputa } from "../types";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { AlertTriangle, Calendar, Plus, X } from "lucide-react";

interface DisputesScreenProps {
  onBack?: () => void;
}

export function DisputesScreen({ onBack }: DisputesScreenProps) {
  const { user } = useAuth();
  const [disputas, setDisputas] = useState<Disputa[]>([]);
  const [showNewDispute, setShowNewDispute] = useState(false);
  const [newDispute, setNewDispute] = useState({
    descricao: "",
    id_trabalho: ""
  });

  useEffect(() => {
    // TODO: Buscar do backend
    // fetch(`SEU_BACKEND_URL/api/disputas?userId=${user?.id}`)
    
    const mockDisputas: Disputa[] = [
      {
        id: "1",
        descricao: "Serviço não foi concluído conforme o combinado",
        status: "em_analise",
        data_abertura: new Date(Date.now() - 172800000).toISOString(),
        id_usuario: user?.role === "usuario" ? user.id : "user1",
        id_profissional: user?.role === "profissional" ? user.id : "prof1",
        id_adm: "admin1"
      },
      {
        id: "2",
        descricao: "Cliente não pagou pelo serviço realizado",
        status: "resolvida",
        data_abertura: new Date(Date.now() - 604800000).toISOString(),
        data_fechamento: new Date(Date.now() - 259200000).toISOString(),
        id_usuario: user?.role === "usuario" ? user.id : "user2",
        id_profissional: user?.role === "profissional" ? user.id : "prof2",
        id_adm: "admin1"
      }
    ];
    setDisputas(mockDisputas);
  }, [user]);

  const handleCreateDispute = async () => {
    if (!newDispute.descricao.trim() || !user) return;

    const disputa: Disputa = {
      id: Date.now().toString(),
      descricao: newDispute.descricao,
      status: "aberta",
      data_abertura: new Date().toISOString(),
      id_usuario: user.role === "usuario" ? user.id : "other",
      id_profissional: user.role === "profissional" ? user.id : "other"
    };

    // TODO: Enviar para o backend
    // await fetch('SEU_BACKEND_URL/api/disputas', {
    //   method: 'POST',
    //   body: JSON.stringify(disputa)
    // });

    setDisputas([disputa, ...disputas]);
    setNewDispute({ descricao: "", id_trabalho: "" });
    setShowNewDispute(false);
  };

  const getStatusBadge = (status: Disputa["status"]) => {
    const statusMap = {
      aberta: { label: "Aberta", color: "bg-yellow-500" },
      em_analise: { label: "Em Análise", color: "bg-blue-500" },
      resolvida: { label: "Resolvida", color: "bg-green-500" },
      fechada: { label: "Fechada", color: "bg-gray-500" }
    };

    const config = statusMap[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  if (!user || user.role === "admin") {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">
          {user?.role === "admin" 
            ? "Painel de administração de disputas em desenvolvimento"
            : "Acesso não autorizado"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Disputas</h2>
        {!showNewDispute && (
          <Button
            onClick={() => setShowNewDispute(true)}
            className="bg-red-500 hover:bg-red-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Disputa
          </Button>
        )}
      </div>

      {/* Formulário Nova Disputa */}
      {showNewDispute && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Abrir Nova Disputa
            </h3>
            <button
              onClick={() => setShowNewDispute(false)}
              className="p-1 hover:bg-red-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Descreva o problema *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                placeholder="Explique detalhadamente o motivo da disputa..."
                value={newDispute.descricao}
                onChange={(e) =>
                  setNewDispute({ ...newDispute, descricao: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowNewDispute(false)}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateDispute}
                className="flex-1 bg-red-500 hover:bg-red-600"
                disabled={!newDispute.descricao.trim()}
              >
                Abrir Disputa
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Disputas */}
      <div className="space-y-3">
        {disputas.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600">Nenhuma disputa aberta</p>
            <p className="text-sm text-gray-500 mt-1">
              Esperamos que não precise usar este recurso
            </p>
          </Card>
        ) : (
          disputas.map((disputa) => (
            <Card key={disputa.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-semibold">Disputa #{disputa.id}</span>
                    {getStatusBadge(disputa.status)}
                  </div>
                  <p className="text-gray-700 mb-3">{disputa.descricao}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Aberta em: {formatDate(disputa.data_abertura)}</span>
                </div>
                {disputa.data_fechamento && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Fechada em: {formatDate(disputa.data_fechamento)}</span>
                  </div>
                )}
                {disputa.id_adm && (
                  <p className="text-blue-600">
                    ✓ Em análise pela administração
                  </p>
                )}
              </div>

              {disputa.status === "aberta" && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Aguardando análise da administração. Você será notificado sobre atualizações.
                  </p>
                </div>
              )}

              {disputa.status === "resolvida" && (
                <div className="mt-4 pt-4 border-t bg-green-50 -m-4 p-4 rounded-b-lg">
                  <p className="text-sm text-green-700 font-medium">
                    ✓ Esta disputa foi resolvida pela administração
                  </p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Informações */}
      <Card className="p-4 bg-blue-50">
        <h3 className="font-semibold mb-2 text-blue-900">ℹ️ Sobre Disputas</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use apenas para problemas sérios que não foram resolvidos diretamente</li>
          <li>• A administração analisará ambos os lados</li>
          <li>• Seja detalhista e honesto na descrição</li>
          <li>• O tempo médio de análise é de 3-5 dias úteis</li>
        </ul>
      </Card>
    </div>
  );
}