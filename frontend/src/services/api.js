export const API_BASE = '';

const ROTAS_PUBLICAS = ['/auth/login', '/usuario/cadastrar', '/profissional/cadastrar'];

export const authService = {
  getToken: () => localStorage.getItem('token_conectlar'),
  setToken: (token) => localStorage.setItem('token_conectlar', token),
  removeToken: () => localStorage.removeItem('token_conectlar'),
  isAuthenticated: () => !!localStorage.getItem('token_conectlar'),
  
  logout: () => {
    localStorage.removeItem('token_conectlar');
    window.location.href = '/login';
  }
};

export async function requisicao(endpoint, method = 'GET', body = null, multipart = false) {
  const token = authService.getToken();
  const headers = {};

  if (token && !ROTAS_PUBLICAS.includes(endpoint)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    if (multipart) {
      options.body = body;
    } else {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);

    if (response.status === 401 || response.status === 403) {
      if (!ROTAS_PUBLICAS.includes(endpoint)) {
        authService.logout();
        throw new Error('Sessão expirada');
      }
    }

    const text = await response.text();
    if (!response.ok) {
      let message = text || 'Erro na requisição';
      try {
        const obj = JSON.parse(text);
        if (obj && obj.message) message = obj.message;
        if (obj && obj.trace && (obj.trace.includes('BadCredentialsException') || obj.trace.includes('Usuário inexistente'))) {
            message = 'Usuário inexistente ou senha inválida';
        }
      } catch (e) { }
      throw new Error(message);
    }

    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      return text;
    }
  } catch (error) {
    throw error;
  }
}
