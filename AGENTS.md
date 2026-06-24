<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Repo: nextjs-ai-app-starter

E-commerce starter (Next.js 16.2.7, React 19.2.7, Prisma 7, MariaDB, Tailwind v4).

## Commands

| Command | What |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build (Prisma generate is **not** automatic — run `npx prisma generate` first) |
| `npm run lint` | ESLint (flat config) |
| `npx prisma generate` | Generate Prisma client to `generated/prisma/` |

No test or typecheck scripts exist.

## Project structure

- **No root layout** — route groups `(auth)` and `(front)` each have independent `<html>` elements in their own `layout.tsx`. Adding a new route group requires its own layout.
- **Path alias**: `@/*` → `./src/*`
- **Components**: `@/components` (app) and `@/components/ui` (shadcn)
- **Auth**: better-auth (email/password) at `src/lib/auth.ts`, client at `src/lib/auth-client.ts`
  - Catch-all route: `src/app/api/auth/[...all]/route.ts`
  - Server-side session: `auth.api.getSession({ headers: await headers() })`
- **Cart**: Zustand store (`src/lib/cart-store.ts`) persisted to `localStorage` under key `skill-cart`
- **UI lib**: shadcn/ui ("radix-luma" style), remixicon icons, Tailwind v4 (`@import` syntax in `globals.css`)
- **DB**: MariaDB via Prisma with `@prisma/adapter-mariadb` driver adapter
  - Prisma v7 config at `prisma.config.ts`, schema at `prisma/schema.prisma`
  - Generated client: `generated/prisma/client` (imported in `src/lib/prisma.ts`)
  - `.env` requires `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
  - Local MariaDB via Docker: `Docs/install_mariadb_with_docker.txt`

## Docker

Multi-stage build: `npm ci` → `npx prisma generate` → `npm run build` → standalone output. Also copies `generated/` and `prisma/` to runner stage.
