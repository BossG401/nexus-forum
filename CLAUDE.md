# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build
npm start                # Production server
npm run lint             # ESLint
npx tsc --noEmit         # TypeScript type-check (zero errors required)
npx prisma generate      # Regenerate client after schema changes
npx prisma db push       # Push schema to database (no migrations)
npx prisma studio        # Visual database browser
```

`prisma db push` is preferred over `prisma migrate` for this project — the schema is the single source of truth for the database shape.

---

## Architecture: Server / Client Boundary

This is a Next.js 16 App Router project. The boundary between server and client code is the central design constraint.

### Server Components (default — no `"use client"`)

- `src/app/layout.tsx` — root layout, fetches fresh user + categories on every request via `getServerSession` + `prisma`, passes as props to client children
- `src/app/page.tsx` and all `src/app/**/page.tsx` — fetch data directly with Prisma, render feed/post/profile pages. Receive `searchParams` as `Promise<{...}>` (Next.js 16 async API)
- `src/actions/*.ts` — Server Actions for mutations. Pattern: `"use server"` → `getServerSession` auth guard → Prisma write → `revalidatePath()` to invalidate caches

### Client Components (marked `"use client"`)

- `src/components/layout/Navbar.tsx`, `RightPanel.tsx`, `Sidebar.tsx` — receive data via props (never import `prisma` directly)
- `src/components/auth/AuthProvider.tsx` — wraps children in `SessionProvider` for `useSession()` hook
- `src/components/feed/Feed.tsx`, `VoteButtons.tsx` — interactive client components, call Server Actions for mutations
- Client components use `useSession()` from `next-auth/react` only for auth state (logged in/out, user ID); **never** rely on the session JWT payload for fresh DB data (see "Stale Session" below)

---

## Data Flow Patterns

### Fresh User Data (Stale Session Problem)

NextAuth JWT sessions are frozen at login time — `session.user.name` does **not** update when the database changes. The pattern is:

1. `layout.tsx` (server component) calls `getServerSession(authOptions)` to get the user ID
2. Queries `prisma.user.findUnique({ where: { id: session.user.id } })` for fresh data
3. Passes `userStats` prop to `<Navbar>` and `<RightPanel>`
4. Client components display the prop, not `useSession().data.user`

`deriveUserStats()` in `layout.tsx` overlays real DB identity fields (name, rank, lp, server, image) onto mock gaming stat defaults (KDA, champions, playtime) for fields not yet in the User model.

### Server Actions → Revalidation

All mutations follow this pattern in `src/actions/`:

```
Server Action → prisma write → revalidatePath("/affected/route")
```

Example (`src/actions/user.ts`):
```
updateProfile(formData) → prisma.user.update → revalidatePath("/profile"), revalidatePath("/settings"), revalidatePath("/")
```

Client components that call Server Actions should `router.refresh()` after success to re-render server components with fresh data.

### Prisma → UI Type Mapping

`src/lib/mappers.ts` provides `mapPrismaPost()` and `mapPrismaComment()` that convert Prisma query results (raw dates, nullable author fields) into UI-safe `Post` / `Comment` types (relative time strings, resolved defaults). Always use these instead of passing raw Prisma results to components.

---

## Database & Prisma

**Provider**: PostgreSQL via Vercel Postgres. **Adapter**: `@prisma/adapter-pg` + `pg` Pool (not the older `@prisma/adapter-better-sqlite3`).

**Connection**: `src/lib/prisma.ts` constructs a `pg.Pool` with the connection string from `POSTGRES_PRISMA_URL` env var, wraps it with `PrismaPg` adapter, exports as `export const prisma` (named export, not default). SSL is set via `?sslmode=require` appended to the connection string — do not pass `ssl` option to `Pool` constructor (triggers pg deprecation warnings).

**Prisma 7 config**: `prisma.config.ts` at repo root provides the Migrate URL via `env("POSTGRES_PRISMA_URL")`. The schema file (`prisma/schema.prisma`) must NOT contain a `url` in the datasource block — Prisma 7 rejects this. The generator uses custom `output = "../src/generated/prisma"`, so all Prisma client imports must be from `@/generated/prisma/client`, never from `@prisma/client` directly.

---

## Theme & Styling

Tailwind v4 with custom design tokens defined in `src/app/globals.css` via `@theme` blocks:

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cyber-darker` | `#070A12` | Page background |
| `--color-cyber-dark` | `#0B0F19` | Panel/card bg |
| `--color-cyber-surface` | `#131A2B` | Elevated surfaces |
| `--color-cyber-border` | `#1E2D45` | Borders, dividers |
| `--color-neon-blue` | `#00D4FF` | Primary accent |
| `--color-neon-purple` | `#A855F7` | Secondary accent |
| `--color-neon-gold` | `#C8A951` | Rank badges |

CSS utility classes: `.glass` (glassmorphism with backdrop-blur), `.glass-strong` (header variant), `.glow-blue` / `.glow-purple` (box-shadow glow), `.neon-text-blue` / `.neon-text-purple` (text glow). The `input-tech` and `input-tech-focus` classes style form inputs with the cyber aesthetic. Scrollbar styling uses webkit pseudo-elements for a dark minimal look.

---

## Authentication

NextAuth v4 with two providers:
- **GitHub OAuth** — requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` env vars
- **Demo Login** (Credentials) — finds or creates a user by summoner name, auto-fills LoL defaults (Challenger / IONIA). For local dev/testing.

Session strategy is JWT. The `session` callback only copies `token.sub` → `session.user.id`. The JWT does not carry name/image/rank — those must be fetched from the database on each request.

`src/app/api/auth/[...nextauth]/route.ts` re-exports the handler from `src/lib/auth.ts`.

---

## Key Constraints

- Prisma client is at `src/generated/prisma/` — import from `@/generated/prisma/client`, not `@prisma/client`
- `.env` must contain `POSTGRES_PRISMA_URL` — pull via `vercel env pull` or set manually
- All page components must handle the unauthenticated state (redirect to sign-in if needed)
- `searchParams` in Next.js 16 page components is a `Promise`, must be awaited
- The `@@unique([userId, postId])` constraint on `Vote` enables upsert-style toggle logic in `src/actions/vote.ts`
- Mock data in `src/data/` provides defaults and fallbacks — real data comes from Prisma
