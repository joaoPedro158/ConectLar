import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Trabalho } from "../types";
import { useAuth } from "./AuthContext";

export type NotificationType =
  | "nova_proposta"
  | "proposta_aceita"
  | "proposta_rejeitada"
  | "servico_concluido"
  | "servico_cancelado"
  | "mensagem_chat";

export interface AppNotification {
  id: string;
  tipo: NotificationType;
  titulo: string;
  mensagem: string;
  data: string; // ISO
  lida: boolean;
  id_relacionado?: string; // id do trabalho/chat etc
}

type TrabalhoStatus = "ABERTO" | "EM_ESPERA" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;

  addNotification: (notification: Omit<AppNotification, "id" | "data" | "lida">) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;

  syncFromTrabalhos: (trabalhos: Trabalho[]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function makeId(prefix = "notif") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeStatus(s: any): TrabalhoStatus | null {
  const v = String(s ?? "").toUpperCase();
  if (v === "ABERTO" || v === "EM_ESPERA" || v === "EM_ANDAMENTO" || v === "CONCLUIDO" || v === "CANCELADO") {
    return v as TrabalhoStatus;
  }
  return null;
}

function keysFor(userId?: string | number, role?: string) {
  const id = userId ? String(userId) : "anon";
  const r = role ?? "anon";
  return {
    NOTIFS: `conectlar_notifications_${r}_${id}`,
    MAP: `conectlar_trabalho_status_map_${r}_${id}`,
  };
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  const userId = user?.id;
  const role = user?.role;
  const { NOTIFS: LS_NOTIFS, MAP: LS_MAP } = useMemo(() => keysFor(userId, role), [userId, role]);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [lastStatusByTrabalho, setLastStatusByTrabalho] = useState<Record<string, TrabalhoStatus>>({});


  useEffect(() => {
    if (!isAuthenticated || !userId || !role) {
      setNotifications([]);
      setLastStatusByTrabalho({});
      return;
    }

    setNotifications(safeParse<AppNotification[]>(localStorage.getItem(LS_NOTIFS), []));
    setLastStatusByTrabalho(safeParse<Record<string, TrabalhoStatus>>(localStorage.getItem(LS_MAP), {}));
  }, [isAuthenticated, userId, role, LS_NOTIFS, LS_MAP]);


  useEffect(() => {
    if (!isAuthenticated || !userId || !role) return;
    localStorage.setItem(LS_NOTIFS, JSON.stringify(notifications));
  }, [notifications, isAuthenticated, userId, role, LS_NOTIFS]);

  useEffect(() => {
    if (!isAuthenticated || !userId || !role) return;
    localStorage.setItem(LS_MAP, JSON.stringify(lastStatusByTrabalho));
  }, [lastStatusByTrabalho, isAuthenticated, userId, role, LS_MAP]);

  const addNotification = (notification: Omit<AppNotification, "id" | "data" | "lida">) => {
    const newNotification: AppNotification = {
      ...notification,
      id: makeId("notif"),
      data: new Date().toISOString(),
      lida: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // opcional: Notification API do navegador
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(notification.titulo, { body: notification.mensagem });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, lida: true } : n)));
  };

  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })));

  const clearNotifications = () => setNotifications([]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.lida).length, [notifications]);

  /**
   * ✅ Notificação “por conta”:
   * - Cliente ("usuario"): só cria notif para trabalhos dele (idUsuario === user.id)
   * - Profissional ("profissional"): só cria notif para trabalhos atribuídos a ele (idProfissional === user.id)
   */
  const syncFromTrabalhos = (trabalhos: Trabalho[]) => {
    if (!isAuthenticated || !userId || !role) return;
    if (!Array.isArray(trabalhos) || trabalhos.length === 0) return;

    const isCliente = role === "usuario";
    const isProf = role === "profissional";
    const myId = String(userId);

    setLastStatusByTrabalho((prevMap) => {
      let nextMap = { ...prevMap };
      let created: Omit<AppNotification, "id" | "data" | "lida">[] = [];

      for (const t of trabalhos as any[]) {
        const id = String(t?.id ?? "");
        if (!id) continue;

        const currentStatus = normalizeStatus(t?.status);
        if (!currentStatus) continue;

        const idUsuario = t?.idUsuario != null ? String(t.idUsuario) : null;
        const idProfissional = t?.idProfissional != null ? String(t.idProfissional) : null;

        // 🔒 filtro de “dono” da notificação
        if (isCliente && idUsuario !== myId) continue;
        if (isProf && idProfissional !== myId) continue;

        const prevStatus = prevMap[id];

        // primeira vez vendo esse trabalho: só registra (não notifica)
        if (!prevStatus) {
          nextMap[id] = currentStatus;
          continue;
        }

        // sem mudança
        if (prevStatus === currentStatus) continue;

        const problema = String(t?.problema ?? "Serviço");

        // =========================
        // CLIENTE: recebe quando
        // - vira EM_ESPERA (profissional reservou)
        // - vira CONCLUIDO / CANCELADO
        // =========================
        if (isCliente) {
          if (currentStatus === "EM_ESPERA") {
            created.push({
              tipo: "nova_proposta",
              titulo: "Um profissional reservou seu serviço",
              mensagem: `O serviço "${problema}" está em espera (aguardando sua resposta).`,
              id_relacionado: id,
            });
          } else if (currentStatus === "CONCLUIDO") {
            created.push({
              tipo: "servico_concluido",
              titulo: "Serviço concluído",
              mensagem: `O serviço "${problema}" foi marcado como concluído.`,
              id_relacionado: id,
            });
          } else if (currentStatus === "CANCELADO") {
            created.push({
              tipo: "servico_cancelado",
              titulo: "Serviço cancelado",
              mensagem: `O serviço "${problema}" foi cancelado.`,
              id_relacionado: id,
            });
          }
        }

        // =========================
        // PROFISSIONAL: recebe quando
        // - cliente aceita: EM_ANDAMENTO
        // - cliente recusa: volta pra ABERTO (vindo de EM_ESPERA)
        // - CONCLUIDO / CANCELADO (opcional)
        // =========================
        if (isProf) {
          if (currentStatus === "EM_ANDAMENTO") {
            created.push({
              tipo: "proposta_aceita",
              titulo: "Cliente aceitou sua proposta",
              mensagem: `O serviço "${problema}" foi aceito e está em andamento.`,
              id_relacionado: id,
            });
          } else if (currentStatus === "ABERTO" && prevStatus === "EM_ESPERA") {
            created.push({
              tipo: "proposta_rejeitada",
              titulo: "Cliente recusou sua proposta",
              mensagem: `O serviço "${problema}" voltou para ABERTO.`,
              id_relacionado: id,
            });
          } else if (currentStatus === "CONCLUIDO") {
            created.push({
              tipo: "servico_concluido",
              titulo: "Serviço concluído",
              mensagem: `O serviço "${problema}" foi concluído.`,
              id_relacionado: id,
            });
          } else if (currentStatus === "CANCELADO") {
            created.push({
              tipo: "servico_cancelado",
              titulo: "Serviço cancelado",
              mensagem: `O serviço "${problema}" foi cancelado.`,
              id_relacionado: id,
            });
          }
        }

        nextMap[id] = currentStatus;
      }

      if (created.length) {
        setNotifications((prevNotifs) => {
          const additions = created.map((c) => ({
            ...c,
            id: makeId("notif"),
            data: new Date().toISOString(),
            lida: false,
          }));
          return [...additions, ...prevNotifs];
        });
      }

      return nextMap;
    });
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      syncFromTrabalhos,
    }),
    [notifications, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}
