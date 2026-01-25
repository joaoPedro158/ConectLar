import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../ui/card";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface ChatWindowProps {
  conversaId?: string;
  chatId?: string;
  onBack: () => void;
}

export function ChatWindow({ onBack }: ChatWindowProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 dark:text-gray-300" />
        </button>

        <h3 className="font-semibold dark:text-white">Chat</h3>
      </div>

      {/* Em breve */}
      <div className="flex-1 p-4 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
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
