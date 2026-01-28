import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../ui/card";
import { MessageCircle } from "lucide-react";

interface ChatListProps {
  onSelectChat: (conversaId: string) => void;
  onBack?: () => void;
  onOpenChatWindow?: (conversaId: string) => void;
}

export function ChatList({}: ChatListProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">Mensagens</h2>
      </div>

      {/* Em breve */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center bg-white dark:bg-gray-800">
          <MessageCircle className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Em breve</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
           Em desenvolvimento
          </p>
        </Card>
      </div>
    </div>
  );
}
