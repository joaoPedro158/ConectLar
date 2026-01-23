import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Mensagem } from "../../types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";

interface ChatWindowProps {
  conversaId?: string;
  chatId?: string;
  onBack: () => void;
}

export function ChatWindow({ conversaId, chatId, onBack }: ChatWindowProps) {
  const currentChatId = conversaId || chatId;
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Buscar mensagens do backend
    // fetch(`SEU_BACKEND_URL/api/mensagens?conversaId=${conversaId}`)
    
    // Carregar mensagens mock
    const mockMensagens: Mensagem[] = [
      {
        id: "1",
        conteudo: "Olá! Preciso de um encanador urgente.",
        data_hora: new Date(Date.now() - 7200000).toISOString(),
        id_remetente: user?.role === "usuario" ? user.id : "other",
        id_destinatario: user?.role === "profissional" ? user.id : "other",
        lida: true
      },
      {
        id: "2",
        conteudo: "Olá! Posso te ajudar. Qual é o problema?",
        data_hora: new Date(Date.now() - 7000000).toISOString(),
        id_remetente: user?.role === "profissional" ? user.id : "other",
        id_destinatario: user?.role === "usuario" ? user.id : "other",
        lida: true
      },
      {
        id: "3",
        conteudo: "Está vazando água da pia da cozinha.",
        data_hora: new Date(Date.now() - 6800000).toISOString(),
        id_remetente: user?.role === "usuario" ? user.id : "other",
        id_destinatario: user?.role === "profissional" ? user.id : "other",
        lida: true
      },
      {
        id: "4",
        conteudo: "Entendi. Posso ir amanhã às 14h. Pode ser?",
        data_hora: new Date(Date.now() - 6600000).toISOString(),
        id_remetente: user?.role === "profissional" ? user.id : "other",
        id_destinatario: user?.role === "usuario" ? user.id : "other",
        lida: true
      },
      {
        id: "5",
        conteudo: "Perfeito! Te espero.",
        data_hora: new Date(Date.now() - 6400000).toISOString(),
        id_remetente: user?.role === "usuario" ? user.id : "other",
        id_destinatario: user?.role === "profissional" ? user.id : "other",
        lida: true
      }
    ];
    setMensagens(mockMensagens);
  }, [conversaId, user]);

  useEffect(() => {
    // Scroll para o final quando novas mensagens chegarem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // TODO: Implementar WebSocket ou polling para mensagens em tempo real
  // useEffect(() => {
  //   const ws = new WebSocket('ws://SEU_BACKEND_URL/ws');
  //   ws.onmessage = (event) => {
  //     const novaMensagem = JSON.parse(event.data);
  //     setMensagens(prev => [...prev, novaMensagem]);
  //   };
  //   return () => ws.close();
  // }, []);

  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !user) return;

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      conteudo: novaMensagem,
      data_hora: new Date().toISOString(),
      id_remetente: user.id,
      id_destinatario: "other", // TODO: Pegar do backend
      lida: false
    };

    // TODO: Enviar para o backend
    // await fetch('SEU_BACKEND_URL/api/mensagens', {
    //   method: 'POST',
    //   body: JSON.stringify(mensagem)
    // });

    setMensagens([...mensagens, mensagem]);
    setNovaMensagem("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const isMyMessage = (mensagem: Mensagem) => {
    return mensagem.id_remetente === user?.id;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 dark:text-gray-300" />
          </button>

          <Avatar className="w-10 h-10">
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
            <AvatarFallback>PR</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold dark:text-white">
              {user?.role === "usuario" ? "João Silva" : "Maria Cliente"}
            </h3>
            <p className="text-xs text-green-600 dark:text-green-400">Online</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Phone className="w-5 h-5 dark:text-gray-300" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Video className="w-5 h-5 dark:text-gray-300" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {mensagens.map((mensagem) => (
          <div
            key={mensagem.id}
            className={`flex ${isMyMessage(mensagem) ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isMyMessage(mensagem)
                  ? "bg-blue-500 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              }`}
            >
              <p className="text-sm break-words">{mensagem.conteudo}</p>
              <span
                className={`text-xs mt-1 block ${
                  isMyMessage(mensagem) ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {formatTime(mensagem.data_hora)}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button
            onClick={handleEnviarMensagem}
            className="bg-blue-500 hover:bg-blue-600"
            disabled={!novaMensagem.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}