import { api } from "./api";

export type StatusProposta = "PENDENTE" | "ACEITA" | "RECUSADA";

export interface Proposta {
  id: number;
  idTrabalho: number;
  idProfissional: number;
  mensagem: string;
  valorProposto: number;
  dataHoraProposta: string;
  status: StatusProposta;
}

// profissional
export async function criarProposta(payload: {
  idTrabalho: number;
  mensagem: string;
  valorProposto: number;
}) {
  const res = await api.post("/proposta", payload);
  return res.data as Proposta;
}

export async function listarMinhasPropostas() {
  const res = await api.get("/proposta/minhas");
  return res.data as Proposta[];
}

// usuário
export async function listarPropostasPorTrabalho(idTrabalho: number) {
  const res = await api.get(`/proposta/por-trabalho/${idTrabalho}`);
  return res.data as Proposta[];
}

export async function aceitarProposta(id: number) {
  const res = await api.put(`/proposta/${id}/aceitar`);
  return res.data;
}

export async function recusarProposta(id: number) {
  const res = await api.put(`/proposta/${id}/recusar`);
  return res.data;
}
