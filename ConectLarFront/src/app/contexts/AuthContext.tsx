import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (data: any, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem("conectlar_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      // TODO: Substituir por chamada real ao backend
      // const response = await fetch('SEU_BACKEND_URL/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, senha })
      // });
      // const data = await response.json();
      // setUser(data.user); // O backend já retorna o tipo correto do usuário

      // Mock temporário - Simula busca no banco de dados
      // Verifica se o usuário já está registrado no localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("conectlar_registered_users") || "[]");
      const foundUser = registeredUsers.find((u: any) => u.email === email && u.senha === senha);

      if (!foundUser) {
        throw new Error("Email ou senha incorretos");
      }

      // Remove a senha antes de salvar no estado
      const { senha: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem("conectlar_user", JSON.stringify(userWithoutPassword));
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (data: any, role: UserRole) => {
    try {
      // TODO: Substituir por chamada real ao backend
      // const response = await fetch('SEU_BACKEND_URL/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...data, role })
      // });
      // const result = await response.json();

      // Mock temporário
      const newUser: User = {
        id: Date.now().toString(),
        ...data,
        role: role
      } as User;

      setUser(newUser);
      localStorage.setItem("conectlar_user", JSON.stringify(newUser));

      // Adiciona o novo usuário à lista de usuários registrados
      const registeredUsers = JSON.parse(localStorage.getItem("conectlar_registered_users") || "[]");
      registeredUsers.push(newUser);
      localStorage.setItem("conectlar_registered_users", JSON.stringify(registeredUsers));
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("conectlar_user");
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("conectlar_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}