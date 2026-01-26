import { Star, MapPin, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface ServiceProvider {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  service: string;
  categoryId: string;
  distance: string;
  priceRange: string;
  availability: "available" | "busy" | "offline";
  responseTime: string;
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
  onClick: () => void;
}

export function ServiceProviderCard({ provider, onClick }: ServiceProviderCardProps) {
  const getAvailabilityBadge = () => {
    switch (provider.availability) {
      case "available":
        return <Badge className="bg-green-500">Disponível</Badge>;
      case "busy":
        return <Badge className="bg-orange-500">Ocupado</Badge>;
      case "offline":
        return <Badge variant="secondary">Offline</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <Avatar className="w-16 h-16">
          <AvatarImage src={provider.photo} alt={provider.name} />
          <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold truncate">{provider.name}</h3>
            {getAvailabilityBadge()}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{provider.service}</p>
          
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-500">({provider.reviews})</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{provider.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{provider.responseTime}</span>
            </div>
          </div>
          
          <p className="text-sm font-medium text-green-600 mt-2">{provider.priceRange}</p>
        </div>
      </div>
    </Card>
  );
}