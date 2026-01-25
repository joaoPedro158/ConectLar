// src/types/index.ts

// ===== ROLES =====
export type UserRole = "usuario" | "profissional" | "admin";
export type UsuarioRoleBackend = "USUARIO" | "PROFISSIONAL" | "ADMIN";

// ===== LOCALIZAÇÃO =====
export interface Localizacao {
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;
}

// ===== USUÁRIO (/auth/me) =====
export interface MeResponse {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  role: UsuarioRoleBackend | string;
  localizacao?: Localizacao | null;
  foto?: string | null;
}

export interface RegisterFormData {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  categoria: string;
  cnpj: string;

  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento: string;
}

