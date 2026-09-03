# KurePulse Public Website

Public-facing clinic website for appointment booking and clinic information.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_URL`. Without it, Vite proxies `/api` to `http://localhost:8080`.

## Production build

```bash
npm run build
```

Output: `dist/`

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes (production) | Backend API base URL |
| `VITE_PORTAL_URL` | Optional | Patient portal frontend URL for header links |
