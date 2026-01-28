import type { Trabalho } from "../types";

export type CategoriaEnum =
  | "ENCANADOR"
  | "ELETRICISTA"
  | "LIMPEZA"
  | "PINTOR"
  | "MARCENEIRO"
  | "JARDINEIRO"
  | "MECANICO"
  | "GERAL";

export type TrabalhoRecordPayload = {
  categoria?: CategoriaEnum;

  localizacao: {
    rua: string;
    bairro: string;
    numero: string;
    cidade: string;
    cep: string;
    estado: string;
    complemento?: string;
  };

  problema: string;
  pagamento: number;
  descricao: string;

  status?: "ABERTO" | "EM_ESPERA" | "EM_ANDAMENTO" | "CONCLUIDO" | "CANCELADO";

  idProfissional?: number | null; // back ignora e controla
};

export async function criarTrabalho(payload: TrabalhoRecordPayload, imagens?: File[]) {
  const form = new FormData();

  form.append("dados", new Blob([JSON.stringify(payload)], { type: "application/json" }));

  if (imagens?.length) {
    imagens.forEach((img) => form.append("imagens", img));
  }

  const res = await api.post("/trabalho/form", form);
  return res.data;
}

export async function listarTrabalhosAbertos(): Promise<Trabalho[]> {
  const res = await api.get("/trabalho/list");
  return res.data;
}

export async function historicoTrabalhos(): Promise<Trabalho[]> {
  const res = await api.get("/trabalho/historico");
  return res.data;
}

export async function solicitarTrabalho(idTrabalho: number) {
  const res = await api.post(`/trabalho/candidatar/${idTrabalho}`);
  return res.data;
}

export async function processarResposta(idTrabalho: number, resposta: boolean) {
  const res = await api.post(`/trabalho/aceitarCandidato/${idTrabalho}`, resposta, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

export async function buscarTrabalhos(termo: string): Promise<Trabalho[]> {
  const res = await api.get("/trabalho/busca", { params: { termo } });
  return res.data;
}
