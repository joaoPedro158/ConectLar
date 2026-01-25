import { useState, useEffect } from "react";
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, User, FileText } from "lucide-react";
import { ServiceProvider } from "./ServiceProviderCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface OrderTrackingProps {
  provider: ServiceProvider;
  requestData: {
    address: string;
    date: string;
    description: string;
  };
  onBack: () => void;
  onCancel: () => void;
}

type OrderStatus = "searching" | "accepted" | "on-the-way" | "arrived" | "in-progress" | "completed";

const statusInfo: Record<OrderStatus, { label: string; description: string; progress: number }> = {
  searching: { label: "Buscando prestador...", description: "Aguarde enquanto encontramos o melhor profissional", progress: 0 },
  accepted: { label: "Solicitação aceita!", description: "O prestador está se preparando", progress: 25 },
  "on-the-way": { label: "A caminho", description: "O prestador está indo até você", progress: 50 },
  arrived: { label: "Chegou ao local", description: "O prestador está no endereço", progress: 75 },
  "in-progress": { label: "Serviço em andamento", description: "Trabalhando no seu problema", progress: 85 },
  completed: { label: "Concluído", description: "Serviço finalizado com sucesso", progress: 100 },
};

export function OrderTracking({ provider, requestData, onBack, onCancel }: OrderTrackingProps) {
  const [status, setStatus] = useState<OrderStatus>("searching");
  const [estimatedTime, setEstimatedTime] = useState(15);

  useEffect(() => {
    // Simular progressão do status
    const timers: NodeJS.Timeout[] = [];
    
    timers.push(setTimeout(() => setStatus("accepted"), 2000));
    timers.push(setTimeout(() => setStatus("on-the-way"), 4000));
    timers.push(setTimeout(() => setStatus("arrived"), 8000));
    
    // Atualizar tempo estimado
    const interval = setInterval(() => {
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 60000);
    timers.push(interval);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  const currentStatus = statusInfo[status];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-semibold">Acompanhar Pedido</h2>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <MapPin className="w-12 h-12 text-blue-500" />
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Tempo estimado: {estimatedTime} min</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Status Progress */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{currentStatus.label}</h3>
            <span className="text-sm text-gray-500">{currentStatus.progress}%</span>
          </div>
          <Progress value={currentStatus.progress} className="mb-2" />
          <p className="text-sm text-gray-600">{currentStatus.description}</p>
        </div>

        {/* Provider Info */}
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-14 h-14">
                <AvatarImage src={provider.photo} alt={provider.name} />
                <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{provider.name}</h3>
                <p className="text-sm text-gray-600">{provider.service}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs">⭐ {provider.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({provider.reviews} avaliações)</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" size="sm">
              <Phone className="w-4 h-4 mr-2" />
              Ligar
            </Button>
            <Button variant="outline" className="flex-1" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Mensagem
            </Button>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h4 className="font-semibold">Detalhes do Serviço</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Endereço</p>
                <p className="text-gray-600">{requestData.address}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Data e Hora</p>
                <p className="text-gray-600">
                  {new Date(requestData.date).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Descrição</p>
                <p className="text-gray-600">{requestData.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border rounded-xl p-4">
          <h4 className="font-semibold mb-3">Histórico</h4>
          <div className="space-y-3">
            {Object.entries(statusInfo).map(([key, info]) => {
              const statusKey = key as OrderStatus;
              const statusOrder = ["searching", "accepted", "on-the-way", "arrived", "in-progress", "completed"];
              const currentIndex = statusOrder.indexOf(status);
              const itemIndex = statusOrder.indexOf(statusKey);
              const isPast = itemIndex <= currentIndex;
              
              return (
                <div key={key} className="flex gap-3">
                  <div className={`flex flex-col items-center ${!isPast && 'opacity-30'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isPast ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {isPast ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <User className="w-4 h-4 text-white" />
                      )}
                    </div>
                    {itemIndex < statusOrder.length - 1 && (
                      <div className={`w-0.5 h-8 ${isPast ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                  <div className={`flex-1 ${!isPast && 'opacity-50'}`}>
                    <p className="font-medium text-sm">{info.label}</p>
                    <p className="text-xs text-gray-500">{info.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {status !== "completed" && status !== "in-progress" && (
          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50"
            onClick={onCancel}
          >
            Cancelar Solicitação
          </Button>
        )}
      </div>
    </div>
  );
}