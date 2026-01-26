import { useState } from "react";
import { X, MapPin, Calendar, FileText } from "lucide-react";
import { ServiceProvider } from "./ServiceProviderCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface ServiceRequestDrawerProps {
  provider: ServiceProvider | null;
  onClose: () => void;
  onConfirm: (data: { address: string; date: string; description: string }) => void;
}

export function ServiceRequestDrawer({ provider, onClose, onConfirm }: ServiceRequestDrawerProps) {
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  if (!provider) return null;

  const handleConfirm = () => {
    onConfirm({ address, date, description });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-3xl max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <h2 className="font-semibold">Solicitar Serviço</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Provider Info */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
            <Avatar className="w-12 h-12">
              <AvatarImage src={provider.photo} alt={provider.name} />
              <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{provider.name}</h3>
              <p className="text-sm text-gray-600">{provider.service}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4" />
                Endereço
              </label>
              <Input
                placeholder="Digite seu endereço completo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <Calendar className="w-4 h-4" />
                Data e Hora
              </label>
              <Input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium mb-2">
                <FileText className="w-4 h-4" />
                Descrição do Problema
              </label>
              <Textarea
                placeholder="Descreva detalhadamente o serviço que você precisa..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Price Estimate */}
          <div className="mt-6 p-4 bg-green-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Estimativa de preço</span>
              <span className="font-semibold text-green-600">{provider.priceRange}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              O valor final será definido após avaliação
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleConfirm}
              disabled={!address || !date || !description}
            >
              Confirmar Solicitação
            </Button>
            <Button 
              className="w-full" 
              variant="outline" 
              size="lg"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
