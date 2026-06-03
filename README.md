# NEXUS — LoL Esports Forum

⚡ Hardcore League of Legends esports forum with real gaming stats, ranks, and discussions. Built with Next.js 16 App Router, styled with a cyberpunk dark theme (glassmorphism, neon accents, glow effects).

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Vercel_Cloud-4169E1?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)

---

## Screenshot

```text
┌─────────────────────────────────────────────────────────┐
│  ⚡ NEXUS  │  🔍 Search…  │  + Create Post  │ 🔔 │ 👤 │  ← Navbar (glass)
├──────────┬────────────────────────┬──────────────────────┤
│          │                        │  ┌────────────────┐  │
│ Sidebar  │   Feed / Content       │  │ Player Dossier │  │
│ 260px    │   (main area)          │  │ Rank, LP, WR   │  │
│          │                        │  │ KDA, Champions │  │
│ Categories│                       │  │ Trending Topics│  │
│          │                        │  │ [Force Sync]   │  │
├──────────┴────────────────────────┴──────────────────────┤
│              3-panel responsive grid                      │
│   lg: 2-col (sidebar + main)  xl: 3-col (+ right panel)  │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/BossG401/nexus-forum.git
cd nexus-forum

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in POSTGRES_PRISMA_URL from Vercel Storage dashboard

# 4. Push database schema
npx prisma generate
npx prisma db push

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

### Demo Login

On the login page, use **"Demo Login"** (credentials provider) to enter without a GitHub account.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` |
| **UI Library** | shadcn/ui (New York style) |
| **Icons** | Lucide React |
| **Auth** | NextAuth v4 (GitHub + Credentials) |
| **Database** | PostgreSQL via Vercel Postgres |
| **ORM** | Prisma 7 + `@prisma/adapter-pg` |
| **Package Manager** | npm |

---

## Project Structure

```text
nexus-forum/
├── prisma/
│   ├── schema.prisma          # User, Post, Comment, Vote models
│   └── prisma.config.ts       # Prisma 7 datasource config
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 3-panel root layout (server component)
│   │   ├── page.tsx           # Home feed
│   │   ├── globals.css        # Theme: cyber colors, glass, glow utilities
│   │   ├── submit/page.tsx    # Create post
│   │   ├── post/[id]/page.tsx # Post detail + comments
│   │   ├── profile/page.tsx   # User profile + settings
│   │   ├── settings/page.tsx  # Account settings
│   │   └── api/auth/[...nextauth]/ # NextAuth route
│   ├── components/
│   │   ├── layout/            # Navbar, Sidebar, RightPanel
│   │   ├── auth/              # AuthProvider, LoginForm
│   │   ├── feed/              # Post card, feed components
│   │   ├── post/              # Comment form, post actions
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── prisma.ts          # DB client (Vercel Postgres, SSL)
│   │   ├── auth.ts            # NextAuth options
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── utils.ts           # cn() helper
│   ├── data/                  # Mock data (categories, stats, nav)
│   └── generated/prisma/      # Generated Prisma client
├── nexus-project-guide.md     # Full development journey & learning guide
└── README.md
```

---

## Design System

| Token | Hex | Usage |
| --- | --- | --- |
| `cyber-darker` | `#070A12` | Page background |
| `cyber-dark` | `#0B0F19` | Panel / card background |
| `cyber-surface` | `#131A2B` | Elevated surfaces |
| `cyber-border` | `#1E2D45` | Borders, dividers |
| `neon-blue` | `#00D4FF` | Primary accent, active states |
| `neon-purple` | `#A855F7` | Notifications, secondary |
| `neon-gold` | `#C8A951` | Rank badges, highlights |

CSS utilities: `.glass` (glassmorphism), `.glow-blue` / `.glow-purple`, `.neon-text-blue`

---

## Version History

### v1.1 — Cloud Database Migration

- ✅ Migrated from local SQLite to **Vercel Postgres** (PostgreSQL)
- ✅ Prisma 7 + `@prisma/adapter-pg` + `pg` driver with SSL
- ✅ Fixed `prisma.ts` named export for server components
- ✅ Added `nexus-project-guide.md` comprehensive project documentation

### v1.0 — Core Forum MVP

- ✅ 3-panel responsive layout (Navbar + Sidebar + Feed + Right Panel)
- ✅ NextAuth v4 (GitHub OAuth + Demo Login)
- ✅ CRUD: create posts, post detail page, comment system
- ✅ Upvote/downvote with real Prisma persistence
- ✅ Profile page with editable LoL identity (rank, LP, server)
- ✅ Settings page with database-synced updates
- ✅ Right Panel "Player Dossier" with live stats + mock Riot API sync
- ✅ Fresh user data flowing from server layout → Navbar + RightPanel
- ✅ Cyberpunk dark theme with glassmorphism and neon glow effects
- ✅ shadcn/ui primitives (Button, Card, Avatar, DropdownMenu, Sheet, etc.)

---

## Learning Resources

See [nexus-project-guide.md](nexus-project-guide.md) for the full step-by-step development journey covering:

- React Server Components vs Client Components
- NextAuth JWT session flow & cache revalidation
- Server Actions for form mutations
- Prisma schema design & database migration
- Tailwind v4 CSS-first theme configuration

---

## Scripts

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
```
