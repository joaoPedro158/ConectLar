import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import type { MeResponse, RegisterFormData, UserRole } from "../types";
import { normalizeUserRole } from "../types/auth";

type AuthContextType = {
  user: MeResponse | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;

  login: (email: string, senha: string) => Promise<void>;
  register: (data: RegisterFormData, role: UserRole, foto?: File | null) => Promise<void>;

  logout: () => void;
  refreshMe: () => Promise<void>;
  updateUser: (payload: Partial<MeResponse>) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MeResponse | null>(null);


  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("conectlar_token") : null
  );


  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const isAuthenticated = !!token;

  const persistUser = (u: MeResponse | null) => {
    const normalized = u
      ? ({ ...u, role: normalizeUserRole((u as any).role) } as MeResponse)
      : null;

    setUser(normalized);

    if (normalized) {
      localStorage.setItem("conectlar_user", JSON.stringify(normalized));
    } else {
      localStorage.removeItem("conectlar_user");
    }
  };

  const extractBackendMessage = (err: any) => {
    const data = err?.response?.data;
    if (!data) return null;
    if (typeof data === "string") return data;
    if (data.message) return data.message;
    if (data.error) return data.error;

    if (data.trace && typeof data.trace === "string") {
      const m = data.trace.match(/IllegalArgumentException:\s*(.+?)\\n/);
      if (m?.[1]) return m[1];
    }
    return null;
  };

  const refreshMe = async () => {
    const res = await api.get<MeResponse>("/auth/me");
    persistUser(res.data);
  };

  const login = async (email: string, senha: string) => {
    try {
      const res = await api.post("/auth/login", { login: email, senha });
      const t = res.data?.token;
      if (!t) throw new Error("Token não retornado no login.");

      localStorage.setItem("conectlar_token", t);
      setToken(t);

      await refreshMe();
    } catch (err: any) {
      const msg = extractBackendMessage(err) ?? err?.message ?? "Erro ao fazer login";
      throw new Error(msg);
    }
  };

  const register = async (data: RegisterFormData, role: UserRole, foto?: File | null) => {
    try {
      const endpoint = role === "profissional" ? "/profissional/form" : "/usuario/form";

      const payload: any = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
        role: role.toUpperCase(),
        ...(role === "profissional" ? { categoria: data.categoria, cnpj: data.cnpj } : {}),
        localizacao: {
          rua: data.rua,
          bairro: data.bairro,
          numero: (data.numero ?? "").trim(),
          cidade: data.cidade,
          cep: data.cep,
          estado: data.estado,
          complemento: data.complemento ?? "",
        },
      };

      const form = new FormData();
      form.append("dados", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (foto) form.append("arquivo", foto);

      await api.post(endpoint, form);


      await login(data.email, data.senha);
    } catch (err: any) {
      const msg = extractBackendMessage(err) ?? err?.message ?? "Erro ao cadastrar";
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem("conectlar_token");
    setToken(null); // ✅ dispara re-render
    persistUser(null);
  };

  const updateUser = (payload: Partial<MeResponse>) => {
    const merged = { ...(user || {}), ...payload } as MeResponse;
    persistUser(merged);
  };

  // ✅ bootstrap: quando token muda, busca /me (ou limpa)
  useEffect(() => {
    const run = async () => {
      try {
        if (!token) {
          persistUser(null);
          return;
        }
        await refreshMe();
      } catch {
        // token inválido => derruba
        localStorage.removeItem("conectlar_token");
        setToken(null);
        persistUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    setIsBootstrapping(true);
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isBootstrapping,
      login,
      register,
      logout,
      refreshMe,
      updateUser,
    }),
    [user, isAuthenticated, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
