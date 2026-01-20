import { X, Bell, CheckCheck, Trash2, MessageCircle, FileText, UserCheck, UserX, CheckCircle } from "lucide-react";
import { useNotifications, NotificationType } from "@/app/contexts/NotificationContext";
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
  servico_concluido: CheckCircle
};

const notificationColors: Record<NotificationType, string> = {
  nova_proposta: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  proposta_aceita: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
  proposta_rejeitada: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
  novo_pedido: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
  mensagem_chat: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  servico_concluido: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
};

export function NotificationScreen({ onClose, onNotificationClick }: NotificationScreenProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Agora mesmo";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} h atrás`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} dias atrás`;
    
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.lida) {
      markAsRead(notification.id);
    }
    if (onNotificationClick && notification.id_relacionado) {
      onNotificationClick(notification.id, notification.id_relacionado);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/30 dark:bg-black/40 z-50 flex items-start justify-center backdrop-blur-sm" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-b-2xl shadow-xl max-h-[70vh] flex flex-col animate-slide-down"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Notificações</h2>
              {unreadCount > 0 && (
                <p className="text-xs text-blue-100">
                  {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="flex gap-2 p-4 border-b dark:border-gray-700">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            )}
            <Button
              onClick={clearNotifications}
              variant="outline"
              size="sm"
              className="flex-1 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar tudo
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Você não tem notificações no momento.<br />
                Novas atualizações aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.tipo];
                const colorClass = notificationColors[notification.tipo];

                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      !notification.lida ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`font-semibold text-sm ${
                            !notification.lida ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {notification.titulo}
                          </h4>
                          {!notification.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {notification.mensagem}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {formatTimeAgo(notification.data)}
                        </span>
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