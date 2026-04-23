# News App

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

## Runtime Features

- Category tabs fetch category-specific news.
- Date filter loads news for the selected date.
- If date is not selected, news loads for the present day.
- Favorites are persisted to PostgreSQL/Neon via `/api/favorites`.

## Database Setup

Favorites table is auto-created on first favorites request:

```sql
CREATE TABLE IF NOT EXISTS favorites (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	url TEXT UNIQUE NOT NULL,
	source TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Notes

- Vite dev proxy forwards `/api/*` requests to `http://localhost:5000`.
- Serverless handlers in `/api` are deployment-ready for platforms like Vercel.
- Tailwind is integrated via the official `@tailwindcss/vite` plugin.

## Vercel Deployment

1. Import this repository in Vercel.
2. Add environment variables in Project Settings:
	- `NEWS_API_KEY`
	- `POSTGRES_URL` (recommended for Neon)
	- `PGSSL=true` (recommended for Neon)
3. Keep `VITE_API_BASE_URL` empty for deployment so frontend uses relative `/api/*` routes.

This project uses Vercel-style serverless handlers in `/api`, so both news and favorites APIs are deployment-ready.
