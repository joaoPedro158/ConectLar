const DEFAULT_API_URL = 'http://localhost:8080';

export const API_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_URL).replace(/\/$/, '');
export const TOKEN_STORAGE_KEY = 'conectlar-token';

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
}

export function setToken(token) {
  if (!token) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    return;
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

function buildHeaders({ token, headers, isJson } = {}) {
  const next = new Headers(headers || {});
  if (token) next.set('Authorization', `Bearer ${token}`);
  if (isJson && !next.has('Content-Type')) next.set('Content-Type', 'application/json');
  if (!next.has('Accept')) next.set('Accept', 'application/json');
  return next;
}

async function parseJsonSafe(resp) {
  const text = await resp.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(path, { method = 'GET', token, headers, body } = {}) {
  const url = path.startsWith('http') ? path : `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const isJson = !!body && !isFormData && typeof body !== 'string' && !(body instanceof Blob);

  const resp = await fetch(url, {
    method,
    headers: buildHeaders({ token, headers, isJson: isJson || typeof body === 'string' }),
    body: body == null ? undefined : isFormData ? body : isJson ? JSON.stringify(body) : body,
  });

  if (resp.ok) return parseJsonSafe(resp);

  const errBody = await parseJsonSafe(resp);
  const error = new Error(
    typeof errBody === 'string'
      ? errBody
      : errBody?.message || `HTTP ${resp.status} ${resp.statusText}`
  );
  error.status = resp.status;
  error.body = errBody;
  throw error;
}

export async function login({ login, senha }) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { login, senha },
  });
}

export async function getMe(token) {
  try {
    const usuario = await apiRequest('/usuario/meusdados', { token });
    return { tipoPerfil: 'USUARIO', usuario };
  } catch (e) {
    if (e?.status && e.status !== 401 && e.status !== 403) throw e;
  }

  const profissional = await apiRequest('/profissional/meusdados', { token });
  return { tipoPerfil: 'PROFISSIONAL', usuario: profissional };
}

export async function listProfissionais() {
  return apiRequest('/profissional/list');
}

export async function listTrabalhos() {
  return apiRequest('/trabalho/list');
}

export async function getHistorico({ tipoPerfil, token }) {
  if (tipoPerfil === 'PROFISSIONAL') return apiRequest('/profissional/historico', { token });
  return apiRequest('/usuario/historico', { token });
}

export function mapCategoriaToEnum(value) {
  const v = String(value || '').trim().toLowerCase();
  if (v === 'encanador') return 'ENCANADOR';
  if (v === 'eletricista') return 'ELETRICISTA';
  if (v === 'limpeza') return 'LIMPEZA';
  if (v === 'pintor') return 'PINTOR';
  if (v === 'marceneiro') return 'MARCENEIRO';
  if (v === 'jardineiro') return 'JARDINEIRO';
  if (v === 'mecanico' || v === 'mecânico') return 'MECANICO';
  return 'GERAL';
}

export async function cadastrarUsuario({ nome, email, senha, telefone, localizacao }, arquivo) {
  const dados = {
    nome,
    email,
    senha,
    telefone: telefone || '',
    localizacao: localizacao ?? null,
    role: 'USUARIO',
  };

  const form = new FormData();
  form.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
  if (arquivo) form.append('arquivo', arquivo);

  return apiRequest('/usuario/cadastrar', { method: 'POST', body: form });
}

export async function cadastrarProfissional({ nome, email, senha, telefone, localizacao, categoria }, arquivo) {
  const dados = {
    nome,
    email,
    senha,
    telefone: telefone || '',
    localizacao: localizacao ?? null,
    categoria: mapCategoriaToEnum(categoria),
    role: 'PROFISSIONAL',
  };

  const form = new FormData();
  form.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
  if (arquivo) form.append('arquivo', arquivo);

  return apiRequest('/profissional/cadastrar', { method: 'POST', body: form });
}

export async function atualizarPerfil({ tipoPerfil, token, patch }, arquivo) {
  const form = new FormData();
  if (patch) form.append('dados', new Blob([JSON.stringify(patch)], { type: 'application/json' }));
  if (arquivo) form.append('arquivo', arquivo);

  const path = tipoPerfil === 'PROFISSIONAL' ? '/profissional/update' : '/usuario/update';
  return apiRequest(path, { method: 'PUT', token, body: form });
}

export async function criarTrabalho({ token, problema, descricao, pagamento, categoria, localizacao }, imagem) {
  const dados = {
    localizacao: localizacao ?? null,
    problema,
    pagamento: pagamento != null && pagamento !== '' ? Number(pagamento) : null,
    descricao,
    status: 'ABERTO',
    idProfissional: null,
    categoria: mapCategoriaToEnum(categoria),
  };

  const form = new FormData();
  form.append('dados', new Blob([JSON.stringify(dados)], { type: 'application/json' }));
  if (imagem) form.append('imagen', imagem);

  return apiRequest('/trabalho/cadastrar', { method: 'POST', token, body: form });
}

export async function candidatarTrabalho({ token, idTrabalho }) {
  return apiRequest(`/trabalho/${idTrabalho}/candidatar`, { method: 'POST', token });
}

export async function responderCandidato({ token, idTrabalho, resposta }) {
  return apiRequest(`/trabalho/${idTrabalho}/responder`, {
    method: 'POST',
    token,
    body: !!resposta,
  });
}

export async function cancelarTrabalho({ token, idTrabalho }) {
  return apiRequest(`/trabalho/${idTrabalho}/cancelar`, { method: 'POST', token });
}

export async function concluirTrabalho({ token, idTrabalho }) {
  return apiRequest(`/trabalho/${idTrabalho}/concluir`, { method: 'POST', token });
}

export async function avaliarTrabalho({ token, idTrabalho, nota, comentario }) {
  return apiRequest(`/avaliacao/avaliar/${idTrabalho}`, {
    method: 'POST',
    token,
    body: { nota, comentario },
  });
}
