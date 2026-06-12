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

### Cursor-Based Infinite Scroll

The home page (`/`) uses a hybrid server+client approach:

1. `page.tsx` (server) fetches initial `PAGE_SIZE` posts, computes `nextCursor` + `hasMore`, passes as props
2. `src/components/feed/InfiniteFeed.tsx` (client) manages posts array, cursor, loading/end/error states
3. `src/actions/post.ts` exports `getMorePosts` server action for subsequent batches using Prisma `cursor: { id }` + `skip: 1`
4. `react-intersection-observer`'s `useInView` with `rootMargin: "200px"` triggers pre-fetch
5. `useRef<boolean>` guards against concurrent fetches (more reliable than `useState` in React 19)
6. Key prop `key={categoryId ?? "all"}` on `InfiniteFeed` forces remount when category changes

`PAGE_SIZE = 10` lives in `src/lib/constants.ts` — NOT in a `"use server"` file (Next.js requires ALL exports from `"use server"` files to be async functions; a constant export breaks module resolution).

`Feed.tsx` is used by esports/patches/trending pages for non-paginated rendering. These pages **must** pass `activeCategory` prop (category `id`) so `Feed` displays the correct Chinese category heading via `tagLabel()`.

---

## i18n: 数据键 → 中文显示名 映射

数据库中的标签（`Post.tag`）和段位（`User.lolRank`）以英文存储，作为查询键和样式映射 key。汉化时这些键保持不变，只在渲染层通过 `src/lib/labels.ts` 转为中文显示：

- **`tagLabel(tag)`** — `"#PatchNotes"` → `"版本公告"`，`"#Esports"` → `"电子竞技"` 等。无匹配时去掉 `#` 作为兜底。
- **`rankLabel(rank)`** — `"Challenger"` → `"最强王者"`，`"Gold"` → `"黄金"` 等。无匹配时原样返回。

**规则**: 所有 `PostCard`、`CommentCard`、`Navbar`、`RightPanel`、`SettingsForm`、`Sidebar`、`Feed`、`InfiniteFeed`、`post/[id]/page.tsx`、`profile/page.tsx` 中显示标签/段位的地方，**必须**使用 `tagLabel()` / `rankLabel()` 包装。样式 lookup（`rankStyles[rank]`、`tagStyles[tagAccent]`）继续使用英文 key。

---

---

## Theme Script (防闪烁)

`layout.tsx` renders a blocking inline `<script>` inside `<head>` that reads `localStorage` and sets `.dark` / `.light` class **before first paint**:

```tsx
<html lang="zh-CN" suppressHydrationWarning>
  <head>
    <script dangerouslySetInnerHTML={{ __html: `(function(){...})()` }} />
  </head>
  <body>...</body>
</html>
```

**Why raw `<script>`, not `<Script>` from `next/script`:** React 19 warns "Encountered a script tag" for `<Script>` and "Scripts inside React components are never executed" for raw `<script>` outside `<head>`. A raw `<script>` inside `<head>` in a Server Component is server-rendered HTML — the browser executes it during parsing (before hydration). React 19's "never executed" warning is a false positive for SSR output.

---

## Database & Prisma

**Provider**: PostgreSQL via Neon. **Adapter**: `@prisma/adapter-pg` + `pg` Pool.

**Connection**: `src/lib/prisma.ts` constructs a `pg.Pool` with the connection string from `POSTGRES_PRISMA_URL` env var. Uses a URL constructor to ensure `sslmode=verify-full` (NOT `require` — triggers pg v9 deprecation warning). Pool config:

```
max: 5                      // enough for concurrent OAuth callbacks
idleTimeoutMillis: 10_000   // release idle connections before Neon's timeout
connectionTimeoutMillis: 30_000  // generous headroom for Neon cold starts
keepAlive: true             // prevent firewalls from dropping idle connections
```

**Neon endpoint**: Use the **direct** endpoint (`ep-...c-2.ap-southeast-1.aws.neon.tech`), NOT the pooler (`ep-...-pooler...`). The pooler with `channel_binding=require` causes intermittent "Connection terminated due to connection timeout" errors.

**Prisma 7 config**: The schema file (`prisma/schema.prisma`) must NOT contain a `url` in the datasource block — Prisma 7 rejects this. The generator uses custom `output = "../src/generated/prisma"`, so all Prisma client imports must be from `@/generated/prisma/client`, never from `@prisma/client` directly.

---

## Theme & Styling

Tailwind v4 with a **semantic, two-mode token system** defined in `src/app/globals.css`. Light/dark switching is class-based via `next-themes` (toggles `.dark` on `<html>`).

**How the theme machinery works:**
- `@custom-variant dark (&:is(.dark *));` makes shadcn `dark:` utilities respond to the `.dark` class (NOT the OS `prefers-color-scheme`). This line is required — without it, `dark:` variants never fire under `next-themes`.
- `:root { … }` holds the **light** token values; `.dark { … }` overrides them with the **dark** values.
- `@theme inline { --color-*: var(--*) }` maps each CSS variable to a Tailwind color utility. The `inline` keyword makes utilities resolve `var()` at the use site, so a single `bg-card` switches color when `.dark` toggles.

**Always style with semantic tokens, never hardcoded dark-only colors.** Use `bg-background` / `bg-card` / `bg-muted` / `bg-popover`, `text-foreground` / `text-muted-foreground` / `text-card-foreground`, `border-border`, `ring-border`, `bg-primary` / `text-primary-foreground`, `bg-destructive` / `text-destructive`. Do NOT reintroduce `bg-cyber-*`, `text-slate-*`, `text-white`, `bg-white/8`, `border-white/8`, `neon-*`, `clip-*`, `glass*`, `glow-*`, `input-tech`, or `font-display` — these were removed in the NEXUS clean redesign.

| Token (light / dark) | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `#f4f4f5` | `#0a0a0a` | Page background |
| `--card` / `--popover` | `#ffffff` | `#161618` | Cards, panels, dropdowns |
| `--foreground` / `--card-foreground` | `#18181b` | `#fafafa` | Primary text |
| `--muted` / `--accent` / `--secondary` | `#f4f4f5` | `#27272a` | Inset fills, hover states |
| `--muted-foreground` | `#71717a` | `#a1a1aa` | Secondary text |
| `--border` / `--input` | `#e4e4e7` | `#26262a` | Borders, dividers |
| `--primary` / `--ring` | `#ef5616` | `#ff5c1a` | Orange accent, focus ring |
| `--destructive` | `#e5484d` | `#f0494e` | Errors, destructive actions |

**Layout convention:** structural surfaces (Navbar `bg-card/80`, Sidebar `bg-card`, RightPanel section cards, PostCards) sit on the `bg-background` page; inputs use `bg-background` for an inset look against `bg-card` panels; hover/active fills use `bg-accent`. Status badges (rank/tag color maps in `PostCard.tsx`, `post/[id]/page.tsx`, `CommentCard.tsx`, `profile/page.tsx`) use dual-mode pairs like `text-amber-700 dark:text-amber-300` so they stay readable on white.

Kept animations (clean, no skew/glitch): `.animate-fade-in`, `.animate-fade-in-up`, `.animate-slide-in-right`, and `.stagger-children` (per-item delay via `--stagger`). Scrollbar styling uses `var(--border)` / `var(--muted-foreground)`.

---

## Authentication

NextAuth v4 with two providers:
- **GitHub OAuth** — requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` env vars
- **体验登录 (Demo Login)** (Credentials) — finds or creates a user by summoner name, auto-fills LoL defaults (Challenger / IONIA). For local dev/testing.

Session strategy is JWT. The `session` callback only copies `token.sub` → `session.user.id`. The JWT does not carry name/image/rank — those must be fetched from the database on each request.

`src/app/api/auth/[...nextauth]/route.ts` re-exports the handler from `src/lib/auth.ts`.

### Auth UI Components

- `src/components/auth/AuthProvider.tsx` — wraps app in `SessionProvider` from `next-auth/react`
- `Navbar.tsx` holds the auth UI inline: a skeleton while `status === "loading"`, a `DropdownMenu` (avatar → Profile/Settings/Sign out) when logged in, and an outline "Sign in" button (`signIn()`) when logged out. There are no separate `LoginButton`/`UserMenu` components.

### Theme Components

- `src/components/theme/ThemeProvider.tsx` — wraps the app (outside `AuthProvider` in `layout.tsx`) in `next-themes`' provider with `attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange`. `<html>` has `suppressHydrationWarning` so the server/client class mismatch on first paint is silenced.
- `src/components/theme/ThemeToggle.tsx` — pill button (lucide `Sun`/`Moon` + "Light Mode"/"Dark Mode" label) rendered in the Navbar action group before the bell. Uses a `mounted` guard: renders a stable placeholder until mounted to avoid hydration mismatch and theme flash.

### Env Var Quoting: CRITICAL

**Next.js `.env` files do NOT strip double quotes.** `KEY="value"` loads as `"value"` (literal quotes included). This silently breaks OAuth credentials:

```
# WRONG — process.env.GITHUB_CLIENT_ID === '"abc123"' (with quotes)
GITHUB_CLIENT_ID="abc123"

# RIGHT — process.env.GITHUB_CLIENT_ID === 'abc123' (no quotes)
GITHUB_CLIENT_ID=abc123
```

If `GITHUB_CLIENT_ID` or `GITHUB_CLIENT_SECRET` contain quotes, GitHub responds with `error=OAuthCallback`. The same applies to `NEXTAUTH_URL` and `NEXTAUTH_SECRET` — quoted values break callback URL construction and token signing.

### GitHub OAuth Setup Checklist

1. `.env.local` (overrides `.env`) must have `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` without quotes
2. `NEXTAUTH_URL=http://localhost:3000` (no quotes, no trailing slash)
3. GitHub OAuth App → Settings → Authorization callback URL must be exactly `http://localhost:3000/api/auth/callback/github`
4. GitHub OAuth App must have the correct Client ID and Client Secret

---

## Key Constraints

- Prisma client is at `src/generated/prisma/` — import from `@/generated/prisma/client`, not `@prisma/client`
- `.env` must contain `POSTGRES_PRISMA_URL` — pull via `vercel env pull` or set manually
- All page components must handle the unauthenticated state (redirect to sign-in if needed)
- `searchParams` in Next.js 16 page components is a `Promise`, must be awaited
- The `@@unique([userId, postId])` constraint on `Vote` enables upsert-style toggle logic in `src/actions/vote.ts`
- Mock data in `src/data/` provides defaults and fallbacks — real data comes from Prisma
