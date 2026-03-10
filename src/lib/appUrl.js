const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : '';

export const APP_PUBLIC_URL = (import.meta.env.VITE_PUBLIC_APP_URL ?? fallbackOrigin).replace(/\/$/, '');

export const criarUrlPublica = (rota = '/') => {
  const caminho = rota.startsWith('/') ? rota : `/${rota}`;
  return `${APP_PUBLIC_URL}${caminho}`;
};
