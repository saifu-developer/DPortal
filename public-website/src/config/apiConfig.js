const normalizeBaseUrl = (url) => (url ? String(url).replace(/\/$/, '') : '');

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_URL);

if (!API_BASE_URL) {
  const message =
    'VITE_API_URL is not set. API requests will fall back to the Vite dev server (/api proxy). ' +
    'Set VITE_API_URL in .env or your deployment environment.';
  if (import.meta.env.PROD) {
    throw new Error(message);
  } else {
    console.warn(message);
  }
}

export default API_BASE_URL;
