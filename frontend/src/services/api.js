export const API_BASE = '';

const ROTAS_PUBLICAS = ['/auth/login', '/usuario/cadastrar', '/profissional/cadastrar'];

const decodeTokenPayload = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const authService = {
  getToken: () => localStorage.getItem('token_conectlar'),
  setToken: (token) => localStorage.setItem('token_conectlar', token),
  removeToken: () => localStorage.removeItem('token_conectlar'),
  isAuthenticated: () => !!localStorage.getItem('token_conectlar'),

  getUserInfo: () => {
    const token = localStorage.getItem('token_conectlar');
    const payload = decodeTokenPayload(token);
    if (!payload) return null;
    return {
      email: payload.sub || null,
      role: payload.role || null,
      id: payload.id || null,
    };
  },

  logout: () => {
    localStorage.clear();
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

    // Tratamento especial de 401/403 igual ao legado
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
        const obj = text ? JSON.parse(text) : null;
        if (obj && typeof obj === 'object') {
          if (obj.trace && typeof obj.trace === 'string') {
            if (
              obj.trace.includes('BadCredentialsException') ||
              obj.trace.includes('Usuário inexistente ou senha inválida')
            ) {
              message = 'Usuário inexistente ou senha inválida';
            }
          }

          if (message !== 'Usuário inexistente ou senha inválida') {
            if (obj.message) message = obj.message;
            else if (obj.error && typeof obj.error === 'string') message = obj.error;
          }
        }
      } catch (e) {
        // se não conseguir parsear JSON, mantém mensagem padrão
      }

      if (
        (response.status === 401 || response.status === 403) &&
        (message === 'Forbidden' || message === 'Access Denied')
      ) {
        message = 'Usuário inexistente ou senha inválida';
      }

      throw new Error(message);
    }

    try {
      return text ? JSON.parse(text) : null;
    } catch (e) {
      return text;
    }
  } catch (error) {
    console.error('Erro API:', error);
    throw error;
  }
}
