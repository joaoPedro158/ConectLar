import { ArrowLeft, MapPin, Star, MessageCircle, Phone, Award, Briefcase, ThumbsUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfessionalProfileProps {
  professional: {
    id: string;
    nome: string;
    foto?: string;
    rating?: number;
    reviews?: number;
    categoria: string;
    descricao?: string;
    telefone: string;
    cidade: string;
    estado: string;
    bairro: string;
    priceRange?: string;
    trabalhos_concluidos?: number;
    anos_experiencia?: number;
    especialidades?: string[];
    avaliacoes?: {
      id: string;
      cliente_nome: string;
      rating: number;
      comentario: string;
      data: string;
      servico: string;
    }[];
  };
  onBack: () => void;
  onContact?: () => void;
}

const categoriaMap: Record<string, string> = {
  "1": "Encanador",
  "2": "Eletricista",
  "3": "Limpeza",
  "4": "Pintor",
  "5": "Marceneiro",
  "6": "Jardineiro",
  "7": "Mecânico"
};

export function ProfessionalProfile({ professional, onBack, onContact }: ProfessionalProfileProps) {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Hoje";
    } else if (diffInDays === 1) {
      return "Ontem";
    } else if (diffInDays < 30) {
      return `${diffInDays} dias atrás`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? "mês" : "meses"} atrás`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} ${years === 1 ? "ano" : "anos"} atrás`;
    }
  };

  const getRatingPercentage = (rating: number) => {
    return (rating / 5) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Voltar</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
              <AvatarImage src={professional.foto} />
              <AvatarFallback className="text-2xl bg-blue-700">
                {professional.nome.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{professional.nome}</h1>
              <Badge className="bg-white text-blue-600 mb-2">
                {categoriaMap[professional.categoria] || "Profissional"}
              </Badge>
              
              {professional.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{professional.rating}</span>
                  </div>
                  <span className="text-blue-100">
                    ({professional.reviews} avaliações)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <Briefcase className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <div className="font-bold text-lg">{professional.trabalhos_concluidos || 0}</div>
              <div className="text-xs text-gray-600">Trabalhos</div>
            </Card>

            <Card className="p-3 text-center">
              <Award className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="font-bold text-lg">{professional.anos_experiencia || 0}+</div>
              <div className="text-xs text-gray-600">Anos</div>
            </Card>

            <Card className="p-3 text-center">
              <ThumbsUp className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <div className="font-bold text-lg">{getRatingPercentage(professional.rating || 0)}%</div>
              <div className="text-xs text-gray-600">Satisfação</div>
            </Card>
          </div>

          {/* About */}
          <Card className="p-4">
            <h3 className="font-bold mb-2">Sobre</h3>
            <p className="text-gray-600 text-sm">
              {professional.descricao || "Profissional qualificado e experiente, pronto para atender suas necessidades com excelência."}
            </p>
          </Card>

          {/* Especialidades */}
          {professional.especialidades && professional.especialidades.length > 0 && (
            <Card className="p-4">
              <h3 className="font-bold mb-2">Especialidades</h3>
              <div className="flex flex-wrap gap-2">
                {professional.especialidades.map((esp, index) => (
                  <Badge key={index} variant="secondary">
                    {esp}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Localização</div>
                <div className="font-medium">{professional.bairro}, {professional.cidade}/{professional.estado}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Telefone</div>
                <div className="font-medium">{professional.telefone}</div>
              </div>
            </div>

            {professional.priceRange && (
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Faixa de Preço</div>
                  <div className="font-medium">{professional.priceRange}</div>
                </div>
              </div>
            )}
          </Card>

          {/* Avaliações */}
          {professional.avaliacoes && professional.avaliacoes.length > 0 && (
            <div>
              <h3 className="font-bold mb-3">Avaliações ({professional.avaliacoes.length})</h3>
              <div className="space-y-3">
                {professional.avaliacoes.map((avaliacao) => (
                  <Card key={avaliacao.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{avaliacao.cliente_nome}</div>
                        <div className="text-xs text-gray-500">{avaliacao.servico}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{avaliacao.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{avaliacao.comentario}</p>
                    <div className="text-xs text-gray-500">{formatTimeAgo(avaliacao.data)}</div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={onContact}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Entrar em Contato
        </Button>
      </div>
    </div>
  );
}