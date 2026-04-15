const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "conectlar_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options.headers || {});
  const token = getToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const resp = await fetch(url, { ...options, headers });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

async function get(path) {
  return request(path, { method: "GET" });
}

async function post(path, body, options = {}) {
  const payload = body instanceof FormData ? body : JSON.stringify(body ?? {});
  return request(path, { method: "POST", body: payload, ...options });
}

const api = { get, post, getToken, setToken };

export default api;
