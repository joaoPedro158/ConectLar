const API_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

async function request(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const resp = await fetch(url, options);
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

const api = { get };

export default api;
