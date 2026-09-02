# KurePulse Clinic Portal (Frontend)

React + Vite SPA for the KurePulse clinic management system.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend URL, or leave it unset to proxy `/api` to `http://localhost:8080` via Vite.

## Production build

```bash
npm run build
```

Output: `dist/`

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes (production) | Backend API base URL, e.g. `https://dportal-j04g.onrender.com` |

Set `VITE_API_URL` in the Vercel project dashboard for production deployments.
