# News App (Feature 1 Scaffold)

This repository contains the initial scaffold for a full-stack News App:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database target: PostgreSQL
- Serverless target: Vercel-style handlers in `/api`

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Fill required values in `.env`.

## Available Scripts

- Start frontend dev server:

```bash
npm run dev
```

- Build frontend:

```bash
npm run build
```

- Preview frontend build:

```bash
npm run preview
```

- Start Express server:

```bash
node server/server.js
```

## Environment Variables

Defined in `.env.example`:

- `NEWS_API_KEY`
- `POSTGRES_URL` or the individual PG variables:
	- `PGHOST`
	- `PGUSER`
	- `PGDATABASE`
	- `PGPASSWORD`
	- `PGPORT`
- `PGSSL` (optional)
- `VITE_API_BASE_URL`

`VITE_API_BASE_URL` guidance:

- Keep it empty for deployment so frontend requests use relative `/api/*` paths.
- Optional for local development; if set, use `http://localhost:5000`.

## Notes

- Vite dev proxy forwards `/api/*` requests to `http://localhost:5000`.
- Serverless handlers in `/api` are deployment-ready for platforms like Vercel.
- Tailwind is integrated via the official `@tailwindcss/vite` plugin.
- This commit is scaffold-only. Feature logic is added incrementally in later features.
