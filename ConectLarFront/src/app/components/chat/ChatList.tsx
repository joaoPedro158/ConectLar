import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Conversa } from "../../types";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { MessageCircle, Search } from "lucide-react";
import { Input } from "../ui/input";

interface ChatListProps {
  onSelectChat: (conversaId: string) => void;
  onBack?: () => void;
  onOpenChatWindow?: (conversaId: string) => void;
}

export function ChatList({ onSelectChat, onBack, onOpenChatWindow }: ChatListProps) {
  const { user } = useAuth();
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // TODO: Buscar conversas do backend
    // fetch(`SEU_BACKEND_URL/api/conversas?userId=${user?.id}`)
    
    // Mock temporário
    const mockConversas: Conversa[] = [
      {
        id: "1",
        id_usuario: user?.role === "usuario" ? user.id : "user1",
        id_profissional: user?.role === "profissional" ? user.id : "prof1",
        ultima_mensagem: "Olá, tudo bem? Quando você pode vir?",
        data_ultima_mensagem: new Date().toISOString(),
        mensagens_nao_lidas: 2
      },
      {
        id: "2",
        id_usuario: user?.role === "usuario" ? user.id : "user2",
        id_profissional: user?.role === "profissional" ? user.id : "prof2",
        ultima_mensagem: "Obrigado pelo serviço!",
        data_ultima_mensagem: new Date(Date.now() - 3600000).toISOString(),
        mensagens_nao_lidas: 0
      }
    ];
    setConversas(mockConversas);
  }, [user]);

  const getContactName = (conversa: Conversa) => {
    // TODO: Buscar nome do backend baseado no ID
    return user?.role === "usuario" ? "Profissional" : "Cliente";
  };

  const getContactPhoto = () => {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  };

  const filteredConversas = conversas.filter(conversa =>
    getContactName(conversa).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold mb-3 dark:text-white">Mensagens</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 p-8">
            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-center">Nenhuma conversa ainda</p>
            <p className="text-sm text-center mt-2">
              Suas conversas aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {filteredConversas.map((conversa) => (
              <button
                key={conversa.id}
                onClick={() => onSelectChat(conversa.id)}
                className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
              >
                <div className="flex gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={getContactPhoto()} alt={getContactName(conversa)} />
                    <AvatarFallback>
                      {getContactName(conversa).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate dark:text-white">
                        {getContactName(conversa)}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {conversa.data_ultima_mensagem && formatTime(conversa.data_ultima_mensagem)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                        {conversa.ultima_mensagem}
                      </p>
                      {conversa.mensagens_nao_lidas > 0 && (
                        <Badge className="bg-blue-500 ml-2">
                          {conversa.mensagens_nao_lidas}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}