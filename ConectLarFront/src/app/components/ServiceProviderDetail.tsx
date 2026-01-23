import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, CheckCircle, Award } from "lucide-react";
import { ServiceProvider } from "./ServiceProviderCard";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface Review {
  id: string;
  userName: string;
  userPhoto: string;
  rating: number;
  date: string;
  comment: string;
}

interface ServiceProviderDetailProps {
  provider: ServiceProvider;
  onBack: () => void;
  onRequestService: () => void;
}

export function ServiceProviderDetail({ provider, onBack, onRequestService }: ServiceProviderDetailProps) {
  // Mock data para serviços oferecidos
  const services = getServicesForProvider(provider.categoryId);
  
  // Mock data para avaliações
  const reviews: Review[] = [
    {
      id: "1",
      userName: "Carlos Souza",
      userPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      rating: 5,
      date: "Há 2 dias",
      comment: "Excelente profissional! Muito atencioso e resolveu o problema rapidamente. Recomendo!"
    },
    {
      id: "2",
      userName: "Ana Rodrigues",
      userPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      rating: 5,
      date: "Há 1 semana",
      comment: "Serviço impecável, pontual e com preço justo. Com certeza vou contratar novamente."
    },
    {
      id: "3",
      userName: "Roberto Lima",
      userPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      rating: 4,
      date: "Há 2 semanas",
      comment: "Bom atendimento e trabalho de qualidade. Pequeno atraso mas compensou no resultado."
    }
  ];

  const getAvailabilityBadge = () => {
    switch (provider.availability) {
      case "available":
        return <Badge className="bg-green-500">Disponível Agora</Badge>;
      case "busy":
        return <Badge className="bg-orange-500">Ocupado</Badge>;
      case "offline":
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto">
      {/* Header com foto */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700">
          <div className="absolute top-4 left-4">
            <button
              onClick={onBack}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="px-4 -mt-16">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="flex gap-4">
              <Avatar className="w-24 h-24 border-4 border-white">
                <AvatarImage src={provider.photo} alt={provider.name} />
                <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-bold text-xl mb-1">{provider.name}</h1>
                    <p className="text-gray-600 text-sm mb-2">{provider.service}</p>
                  </div>
                  {getAvailabilityBadge()}
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{provider.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500">({provider.reviews} avaliações)</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">{provider.distance}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">{provider.responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Sobre */}
        <Card className="p-4">
          <h2 className="font-semibold mb-2">Sobre</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {getDescriptionForProvider(provider.categoryId)}
          </p>
          
          <div className="flex gap-2 mt-4">
            <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-2 rounded-lg">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Verificado</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{provider.reviews}+ trabalhos</span>
            </div>
          </div>
        </Card>

        {/* Serviços oferecidos */}
        <Card className="p-4">
          <h2 className="font-semibold mb-3">Serviços Oferecidos</h2>
          <div className="space-y-2">
            {services.map((service, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{service}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="font-semibold text-green-600">{provider.priceRange}</p>
            <p className="text-xs text-gray-500 mt-1">Preço pode variar conforme o serviço</p>
          </div>
        </Card>

        {/* Avaliações */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Avaliações</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{provider.rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({provider.reviews})</span>
            </div>
          </div>

          {/* Distribuição de estrelas */}
          <div className="space-y-2 mb-4">
            {[5, 4, 3, 2, 1].map((stars) => {
              const percentage = getStarPercentage(stars, provider.rating);
              return (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-8">{stars} ★</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{percentage}%</span>
                </div>
              );
            })}
          </div>

          {/* Lista de comentários */}
          <div className="space-y-4 mt-4 pt-4 border-t">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.userPhoto} alt={review.userName} />
                    <AvatarFallback>{review.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{review.userName}</p>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Footer fixo com botões de ação */}
      <div className="bg-white border-t p-4 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Ligar
          </Button>
          <Button
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Mensagem
          </Button>
        </div>
        
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={onRequestService}
        >
          Solicitar Serviço
        </Button>
      </div>
    </div>
  );
}

// Funções auxiliares
function getServicesForProvider(categoryId: string): string[] {
  const servicesMap: Record<string, string[]> = {
    "1": [
      "Instalação e reparo de torneiras",
      "Desentupimento de pias e ralos",
      "Conserto de vazamentos",
      "Instalação de chuveiros e aquecedores",
      "Reparo de descargas",
      "Troca de registros e válvulas"
    ],
    "2": [
      "Instalação de luminárias e lustres",
      "Reparo de disjuntores",
      "Instalação de tomadas e interruptores",
      "Revisão de quadro elétrico",
      "Instalação de ventiladores de teto",
      "Correção de problemas elétricos"
    ],
    "3": [
      "Limpeza residencial completa",
      "Limpeza pós-obra",
      "Limpeza de estofados",
      "Limpeza de vidros e janelas",
      "Organização de ambientes",
      "Limpeza profunda"
    ],
    "4": [
      "Pintura interna e externa",
      "Pintura de fachadas",
      "Aplicação de texturas",
      "Pintura de portões e grades",
      "Reparo de paredes",
      "Pintura decorativa"
    ],
    "5": [
      "Fabricação de móveis sob medida",
      "Montagem de móveis",
      "Restauração de móveis",
      "Instalação de armários",
      "Reparo em móveis de madeira",
      "Projetos personalizados"
    ],
    "6": [
      "Manutenção de jardins",
      "Poda de árvores e arbustos",
      "Plantio e paisagismo",
      "Limpeza de terrenos",
      "Instalação de grama",
      "Adubação e cuidados com plantas"
    ],
    "7": [
      "Manutenção preventiva",
      "Troca de óleo e filtros",
      "Reparo de motor",
      "Troca de freios e suspensão",
      "Alinhamento e balanceamento",
      "Diagnóstico eletrônico"
    ],
    "8": [
      "Pequenos reparos domésticos",
      "Instalação de prateleiras",
      "Montagem de móveis",
      "Reparo de portas e janelas",
      "Fixação de suportes",
      "Manutenção geral"
    ]
  };

  return servicesMap[categoryId] || [
    "Serviço profissional de qualidade",
    "Atendimento personalizado",
    "Garantia do trabalho realizado"
  ];
}

function getDescriptionForProvider(categoryId: string): string {
  const descriptionsMap: Record<string, string> = {
    "1": "Profissional com mais de 10 anos de experiência em serviços hidráulicos residenciais e comerciais. Especializado em instalações, reparos e manutenção preventiva. Atendimento rápido e eficiente com garantia de qualidade.",
    "2": "Eletricista certificado com ampla experiência em instalações elétricas residenciais e comerciais. Trabalho com segurança e qualidade, seguindo todas as normas técnicas. Disponível para emergências.",
    "3": "Equipe especializada em limpeza residencial e comercial. Utilizamos produtos de qualidade e técnicas profissionais para garantir o melhor resultado. Atendimento pontual e confiável.",
    "4": "Pintor profissional com experiência em diversos tipos de acabamento. Trabalho limpo, organizado e com atenção aos detalhes. Utilizo materiais de primeira linha para garantir durabilidade.",
    "5": "Marceneiro especializado em móveis sob medida e restauração. Trabalho artesanal de alta qualidade com madeiras nobres. Projetos personalizados conforme sua necessidade.",
    "6": "Jardineiro profissional com conhecimento em paisagismo e manutenção de áreas verdes. Cuidado especial com cada planta e ambiente. Transformo seu jardim em um espaço bonito e saudável.",
    "7": "Mecânico automotivo com formação técnica e vasta experiência. Diagnóstico preciso e reparo de qualidade. Trabalho com peças originais e garantia dos serviços prestados.",
    "8": "Profissional multifuncional para resolver diversos tipos de reparos e manutenções. Pontual, confiável e com preço justo. Experiência em diversos tipos de serviços residenciais."
  };

  return descriptionsMap[categoryId] || "Profissional qualificado e experiente, pronto para atender suas necessidades com qualidade e eficiência.";
}

function getStarPercentage(stars: number, rating: number): number {
  // Simulação de distribuição de avaliações baseada no rating médio
  if (stars === 5 && rating >= 4.5) return 75;
  if (stars === 5 && rating >= 4.0) return 60;
  if (stars === 4 && rating >= 4.5) return 20;
  if (stars === 4 && rating >= 4.0) return 30;
  if (stars === 3) return rating < 4.5 ? 8 : 3;
  if (stars === 2) return rating < 4.0 ? 5 : 1;
  if (stars === 1) return rating < 3.5 ? 3 : 1;
  return 0;
}
