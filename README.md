# NEXUS — LoL Esports Forum

英雄联盟社区论坛 —— 讨论赛事、版本公告、玩法攻略与玩家故事。基于 Next.js 16 App Router，支持 Light/Dark 双主题。

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)

---

## Screenshot

```text
┌─────────────────────────────────────────────────────────┐
│  ⚡ NEXUS  │  🔍 搜索…  │  + 发帖  │ 🔔 │ 👤 │  ← Navbar │
├──────────┬────────────────────────┬──────────────────────┤
│          │                        │  ┌────────────────┐  │
│ Sidebar  │   Feed / Content       │  │ 玩家档案        │  │
│ 280px    │   (main area)          │  │ 段位, LP, 胜率  │  │
│          │                        │  │ KDA, 常用英雄   │  │
│ 分类导航  │                        │  │ [同步战绩]      │  │
│          │                        │  └────────────────┘  │
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
# Copy .env from Vercel or create manually with:
#   POSTGRES_PRISMA_URL=postgresql://...?sslmode=verify-full
#   GITHUB_CLIENT_ID=...
#   GITHUB_CLIENT_SECRET=...
#   NEXTAUTH_SECRET=...
#   UPLOADTHING_SECRET=...

# 4. Push database schema
npx prisma generate
npx prisma db push

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

### 体验登录

未配置 GitHub OAuth 时，可使用 **"体验登录"** (Credentials provider) 输入召唤师名称即可进入。

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
| **Database** | PostgreSQL via Neon |
| **ORM** | Prisma 7 + `@prisma/adapter-pg` |
| **File Upload** | UploadThing |
| **Package Manager** | npm |

---

## Project Structure

```text
nexus-forum/
├── prisma/
│   └── schema.prisma              # User, Post, Comment, Vote models
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 3-panel root layout (server component)
│   │   ├── page.tsx               # Home feed (infinite scroll)
│   │   ├── globals.css            # Theme: semantic tokens, light/dark
│   │   ├── submit/page.tsx        # Create post
│   │   ├── post/[id]/page.tsx     # Post detail + comments
│   │   ├── profile/page.tsx       # User profile + settings link
│   │   ├── settings/              # Account settings (avatar, name, rank)
│   │   ├── esports/page.tsx       # Esports category feed
│   │   ├── patches/page.tsx       # Patch notes category feed
│   │   ├── trending/page.tsx      # Trending (top upvoted) feed
│   │   └── api/auth/[...nextauth]/ # NextAuth route
│   ├── actions/                   # Server Actions (comment, post, user, vote)
│   ├── components/
│   │   ├── layout/                # Navbar, Sidebar, RightPanel, SidebarClient
│   │   ├── auth/                  # AuthProvider
│   │   ├── feed/                  # PostCard, Feed, InfiniteFeed, VoteButtons,
│   │   │                          #   CommentCard, CommentInput, CommentSection,
│   │   │                          #   CreatePostForm
│   │   ├── theme/                 # ThemeProvider, ThemeToggle
│   │   └── ui/                    # shadcn/ui primitives
│   ├── lib/
│   │   ├── prisma.ts              # DB client (Neon, sslmode=verify-full)
│   │   ├── auth.ts                # NextAuth options (GitHub + 体验登录)
│   │   ├── labels.ts              # tagLabel() / rankLabel() i18n mappings
│   │   ├── mappers.ts             # Prisma → UI type converters + timeAgo()
│   │   ├── types.ts               # TypeScript interfaces
│   │   ├── constants.ts           # PAGE_SIZE, shared constants
│   │   └── utils.ts               # cn() helper
│   ├── data/                      # Mock data (categories, stats, nav)
│   └── generated/prisma/          # Generated Prisma client
├── CLAUDE.md                      # AI coding guidance
└── README.md
```

---

## Design System

Tailwind v4 语义化双主题 token 系统，定义在 `src/app/globals.css`。通过 `next-themes` 切换 `.dark` class。

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `--background` | `#f4f4f5` | `#0a0a0a` | Page background |
| `--card` / `--popover` | `#ffffff` | `#161618` | Cards, panels, dropdowns |
| `--foreground` / `--card-foreground` | `#18181b` | `#fafafa` | Primary text |
| `--muted` / `--accent` / `--secondary` | `#f4f4f5` | `#27272a` | Inset fills, hover states |
| `--muted-foreground` | `#71717a` | `#a1a1aa` | Secondary text |
| `--border` / `--input` | `#e4e4e7` | `#26262a` | Borders, dividers |
| `--primary` / `--ring` | `#ef5616` | `#ff5c1a` | Orange accent, focus ring |
| `--destructive` | `#e5484d` | `#f0494e` | Errors, destructive actions |

**布局约定**: Navbar (`bg-card/80`)、Sidebar (`bg-card`)、PostCard 等结构面板置于 `bg-background` 页面之上。输入框使用 `bg-background` 在 `bg-card` 面板中形成内凹效果。状态徽章使用双模式配色（如 `text-amber-700 dark:text-amber-300`）。

---

## i18n

全站 UI 已汉化。数据库中的标签（`#PatchNotes`）和段位（`Challenger`）以英文存储，通过 `src/lib/labels.ts` 映射为中文显示：

| 英文键 | 中文显示 |
| --- | --- |
| `#PatchNotes` | 版本公告 |
| `#Esports` | 电子竞技 |
| `#Gameplay` | 玩法攻略 |
| `Challenger` | 最强王者 |
| `Gold` | 黄金 |

---

## Version History

### v1.2 — i18n 汉化 + 基础设施修复

- ✅ 全站 UI 汉化：导航、按钮、提示、错误信息翻译为中文
- ✅ 新增 `src/lib/labels.ts`：`tagLabel()` / `rankLabel()` 数据键 → 中文映射
- ✅ 修复数据库连接超时：改用 Neon 直连端点 + `sslmode=verify-full`
- ✅ 修复分类页面标题（esports/patches 显示正确中文分类名）
- ✅ 修复主题脚本 React 19 兼容性（原生 `<script>` in `<head>`）

### v1.1 — Cloud Database Migration

- ✅ Migrated from local SQLite to **Neon Postgres** (PostgreSQL)
- ✅ Prisma 7 + `@prisma/adapter-pg` + `pg` driver with SSL
- ✅ Added infinite scroll (cursor-based pagination)
- ✅ UploadThing image upload integration
- ✅ GitHub OAuth login
- ✅ NEXUS clean redesign: semantic Light/Dark theme tokens

### v1.0 — Core Forum MVP

- ✅ 3-panel responsive layout (Navbar + Sidebar + Feed + Right Panel)
- ✅ NextAuth v4 (GitHub OAuth + Demo Login)
- ✅ CRUD: create posts, post detail page, comment system
- ✅ Upvote/downvote with real Prisma persistence
- ✅ Profile page with editable LoL identity (rank, LP, server)
- ✅ Settings page with database-synced updates
- ✅ Right Panel "Player Dossier" with live stats + mock Riot API sync
- ✅ shadcn/ui primitives (Button, Card, Avatar, DropdownMenu, Sheet, etc.)

---

## Scripts

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm start         # Start production server
npm run lint      # ESLint
```
