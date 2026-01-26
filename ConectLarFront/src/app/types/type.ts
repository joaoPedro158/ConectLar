import type { CategoriaEnum } from "./services/trabalhos";

export interface Trabalho {
  id: number;


  categoria: CategoriaEnum;

  problema: string;
  descricao: string;
  pagamento: number;

  status: "ABERTO" | "EM_ESPERA" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";

  dataHoraAberta?: string;

  localizacao?: {
    rua?: string;
    bairro?: string;
    numero?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    complemento?: string;
  };

  imagens?: string[];

  nomeUsuario?: string;
  idUsuario?: number;

  nomeProfissional?: string;
  idProfissional?: number;
}
