
export type UserRole = "usuario" | "profissional" | "admin";

interface UserBase {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  role: UserRole;
}
interface Endereco {
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string; 
  telefone: string;
  role: "usuario";
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;
}


export interface Profissional {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  categoria: string;
  telefone: string;
  role: "profissional";
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;

  foto?: string;
  rating?: number;
  reviews?: number;
  descricao?: string;
  priceRange?: string;
}


export interface Admin {
  id: string;
  nome: string;
  email: string;
  senha?: string; 
  role: "admin";
  rua?: string;
  bairro?: string;
  numero?: string; 
  cidade?: string;
  estado?: string;
}

export type User = Usuario | Profissional | Admin;


export interface Trabalho {
  id: string;
  problema: string;
  descricao: string;
  pagamento: number;
  data_abertura: string; 
  id_usuario: string;
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  cep: string;
  estado: string;
  complemento?: string;
  status?: "pendente" | "aceito" | "em_andamento" | "concluido" | "cancelado";
  id_profissional?: string;
}

export interface HistoricoTrabalho {
  id: string;
  avaliacao_recebida: number; 
  trabalho_feito: string;
  data_hora: string; 
  id_profissional: string;
}


export interface HistoricoPedido {
  id: string;
  avaliacao: number; 
  trabalho_feito: string;
  data_hora: string; 
  id_profissional: string;
  id_usuario: string;
  id_trabalho: string;
}

export interface Disputa {
  id: string;
  descricao: string;
  status: "aberta" | "em_analise" | "resolvida" | "fechada";
  data_abertura: string; 
  data_fechamento?: string; 
  id_usuario: string;
  id_profissional: string;
  id_adm?: string;
}


export interface Mensagem {
  id: string;
  conteudo: string;
  data_hora: string; 
  id_remetente: string;
  id_destinatario: string;
  lida: boolean;
}


export interface Conversa {
  id: string;
  id_usuario: string;
  id_profissional: string;
  ultima_mensagem?: string;
  data_ultima_mensagem?: string;
  mensagens_nao_lidas: number;
}


export interface Proposta {
  id: string;
  id_profissional: string;
  id_trabalho: string;
  mensagem: string;
  valor_proposto?: number;
  data_proposta: string;
  profissional_nome: string;
  profissional_foto?: string;
  profissional_rating?: number;
  profissional_reviews?: number;
  status: "pendente" | "aceita" | "recusada";
}