import { X, Bell, CheckCheck, Trash2, MessageCircle, FileText, UserCheck, UserX, CheckCircle } from "lucide-react";
import { useNotifications, type NotificationType } from "@/app/contexts/NotificationContext";
import { Button } from "./ui/button";

interface NotificationScreenProps {
  onClose: () => void;
  onNotificationClick?: (notificationId: string, relatedId?: string) => void;
}

const notificationIcons: Record<NotificationType, any> = {
  nova_proposta: MessageCircle,
  proposta_aceita: UserCheck,
  proposta_rejeitada: UserX,
  novo_pedido: FileText,
  mensagem_chat: MessageCircle,
  servico_concluido: CheckCircle,
};

export function NotificationScreen({ onClose, onNotificationClick }: NotificationScreenProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const handleNotificationClick = (n: any) => {
    if (!n.lida) markAsRead(n.id);
    onNotificationClick?.(n.id, n.id_relacionado);
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 dark:bg-black/40 z-50 flex items-start justify-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 w-full max-w-md rounded-b-2xl shadow-xl max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="font-bold">Notificações</h2>
            {unreadCount > 0 && <span className="text-sm text-gray-500">({unreadCount})</span>}
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2 p-4 border-b dark:border-gray-700">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline" size="sm" className="flex-1">
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar todas
              </Button>
            )}
            <Button onClick={clearNotifications} variant="outline" size="sm" className="flex-1 text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Nenhuma notificação</div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {notifications.map((n) => {
                const Icon = notificationIcons[n.tipo];
                return (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!n.lida ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{n.titulo}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{n.mensagem}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
