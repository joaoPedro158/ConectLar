import { api } from "./api";
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

export type TrabalhoStatus =
  | "ABERTO"
  | "EM_ESPERA"
  | "EM_ANDAMENTO"
  | "CONCLUIDO"
  | "CANCELADO";

export type TrabalhoRecordPayload = {
  categoria: CategoriaEnum;
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
  status?: TrabalhoStatus;
};

export async function criarTrabalho(payload: TrabalhoRecordPayload, imagens?: File[]) {
  const form = new FormData();

  form.append("dados", new Blob([JSON.stringify(payload)], { type: "application/json" }));

  if (imagens?.length) {
    // se o back espera outro nome (ex: "imagens"), troca aqui
    imagens.forEach((img) => form.append("imagen", img));
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

/**
 * PROFISSIONAL: reservar/pegar o serviço
 * (rota ajustada pra /trabalho/{id}/candidatar)
 */
export async function solicitarTrabalho(idTrabalho: number) {
  const res = await api.post(`/trabalho/${idTrabalho}/candidatar`);
  return res.data;
}

/**
 * CLIENTE: aceitar/recusar o profissional que reservou
 * Pelo seu Postman: POST /trabalho/{id}/responder com body boolean (true/false)
 */
export async function responderCandidatura(idTrabalho: number, aceitar: boolean) {
  const res = await api.post(`/trabalho/${idTrabalho}/responder`, aceitar, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}

/**
 * PROFISSIONAL: concluir o serviço
 * Postman: POST /trabalho/{id}/concluir
 */
export async function concluirTrabalho(idTrabalho: number) {
  const res = await api.post(`/trabalho/${idTrabalho}/concluir`);
  return res.data;
}

/**
 * PROFISSIONAL (ou cliente, depende da regra do back): cancelar
 * Postman: POST /trabalho/{id}/cancelar
 */
export async function cancelarTrabalho(idTrabalho: number) {
  const res = await api.post(`/trabalho/${idTrabalho}/cancelar`);
  return res.data;
}

export async function buscarTrabalhos(termo: string): Promise<Trabalho[]> {
  const res = await api.get("/trabalho/busca", { params: { termo } });
  return res.data;
}
