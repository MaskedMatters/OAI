# OAI Frontend

React + Vite + TypeScript frontend for the Open Access Identifier platform.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Routes

| Path | Page |
|------|------|
| `/` | Home / landing page |
| `/about` | Nomenclature & specifications |
| `/dashboard` | User dashboard (requires ORCiD auth) |
| `/auth-callback` | ORCiD OAuth callback handler |

## Notes

- The dashboard makes API calls to `/api/...` which are proxied to `http://localhost:3000` in dev via `vite.config.ts`.
- OAI resolution paths (`/16.*`) are also proxied to the backend.
- Auth state is stored in `localStorage` under the key `oai_user`.

## Deployment

For SPA routing to work on a static host (Netlify, Vercel, etc.), you need to configure all paths to serve `index.html`:

**Netlify** — add a `_redirects` file to `public/`:
```
/* /index.html 200
```

**Vercel** — add to `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
