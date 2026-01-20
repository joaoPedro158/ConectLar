import { createContext, useContext, useState, ReactNode } from "react";

export type NotificationType = 
  | "nova_proposta" 
  | "proposta_aceita" 
  | "proposta_rejeitada" 
  | "novo_pedido"
  | "mensagem_chat"
  | "servico_concluido";

export interface Notification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  id_relacionado?: string; // ID do pedido, proposta, chat, etc
  icone?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "data" | "lida">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, "id" | "data" | "lida">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random()}`,
      data: new Date().toISOString(),
      lida: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Simular notificação push (na web seria com Notification API)
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.titulo, {
        body: notification.mensagem,
        icon: "/logo.png"
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, lida: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, lida: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.lida).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
