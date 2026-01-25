import { useState } from "react";
import { X, Send, DollarSign } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Trabalho } from "../types";
import { useNotifications } from "@/app/contexts/NotificationContext";
import { criarProposta, type Proposta } from "../services/propostas";

interface SendProposalModalProps {
  request: Trabalho & {
    nomeUsuario?: string;
    categoria_nome?: string;
  };
  onClose: () => void;
  onCreated?: (proposta: Proposta) => void; // opcional: pai atualiza lista
}

export function SendProposalModal({ request, onClose, onCreated }: SendProposalModalProps) {
  const [mensagem, setMensagem] = useState("");
  const [valorProposto, setValorProposto] = useState(String(request.pagamento ?? ""));
  const [loading, setLoading] = useState(false);

  const { addNotification } = useNotifications();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim() || !valorProposto) return;

    setLoading(true);
    try {
      const propostaCriada = await criarProposta({
        idTrabalho: Number(request.id),
        mensagem: mensagem.trim(),
        valorProposto: Number(valorProposto),
      });

      addNotification?.({
        tipo: "nova_proposta",
        titulo: "Proposta enviada",
        mensagem: `Você enviou uma proposta para o serviço #${request.id}.`,
        data: new Date().toISOString(),
        lida: false,
        id_relacionado: String(request.id),
      });


      onCreated?.(propostaCriada);
      onClose();
    } catch (err) {
      console.error(err);
      // se quiser, aqui você pode mostrar toast/alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Enviar Proposta</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{request.problema}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{request.descricao}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-500">Valor sugerido pelo cliente:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(Number(request.pagamento))}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="valor" className="text-gray-900 dark:text-white">
              Seu Valor Proposto <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={valorProposto}
                onChange={(e) => setValorProposto(e.target.value)}
                className="pl-10 dark:bg-gray-900 dark:border-gray-700"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="mensagem" className="text-gray-900 dark:text-white">
              Mensagem para o Cliente <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="mt-2 min-h-[120px] dark:bg-gray-900 dark:border-gray-700"
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-right">{mensagem.length}/500</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600" disabled={loading || !mensagem.trim() || !valorProposto}>
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Enviando..." : "Enviar Proposta"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
