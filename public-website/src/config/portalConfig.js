const normalizeBaseUrl = (url) => (url ? String(url).replace(/\/$/, '') : '');

export const PORTAL_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_PORTAL_URL);

export const PATIENT_LOGIN_URL = PORTAL_BASE_URL
  ? `${PORTAL_BASE_URL}/login/patient`
  : '';

if (!PORTAL_BASE_URL) {
  const message =
    'VITE_PORTAL_URL is not set. Patient Portal links will not work. ' +
    'Set VITE_PORTAL_URL to your clinic portal frontend URL.';
  if (import.meta.env.PROD) {
    console.error(message);
  } else {
    console.warn(message);
  }
}
