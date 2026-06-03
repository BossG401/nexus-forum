# NEXUS — Hardcore LoL Esports Forum

## Complete Project Summary & Step-by-Step Learning Guide

---

## 1. Project Overview

**NEXUS** is a full-stack, dark-themed League of Legends esports forum built with modern web technologies. It delivers an immersive cyberpunk/esports experience with neon accents, glassmorphism cards, glowing typography, and a tactical "Player Dossier" right sidebar.

### Design Philosophy

| Principle | Implementation |
|-----------|---------------|
| **Immersion** | Every pixel feels like a League client — dark backgrounds (`#070A12`), neon blue/purple/gold accents, monospace tactical labels |
| **Glassmorphism** | Cards use `backdrop-blur` + semi-transparent backgrounds + subtle borders for a "holographic HUD" feel |
| **Glow System** | Custom CSS utilities (`.glow-blue`, `.glow-purple`, `.glow-gold`) apply `box-shadow` and `text-shadow` for neon effects |
| **Tactical UX** | Labels use `/// PREFIX` notation, monospace `font-display` (Rajdhani), and `tracking-[0.2em]` uppercase — evoking a military/competitive UI |
| **Real-time Feel** | Optimistic UI updates (voting), loading skeletons, spinner states, and a mock "Riot API sync" button that randomizes stats |

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 16 | App Router, React Server Components, Server Actions |
| **UI Library** | React | 19 | `useOptimistic`, `useTransition`, client interactivity |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS with custom `@theme` tokens |
| **Component Kit** | shadcn/ui | latest | Headless Radix primitives styled with Tailwind |
| **Icons** | Lucide React | latest | Consistent icon system (290+ icons) |
| **ORM** | Prisma | 7 | Type-safe database queries, migrations, schema management |
| **Database** | SQLite (via better-sqlite3) | — | Zero-config local database, file-based (`dev.db`) |
| **Auth** | NextAuth.js | v4.24 | JWT sessions, GitHub + Credentials providers, Prisma adapter |
| **Language** | TypeScript | 5.x | End-to-end type safety from DB schema to UI props |

---

## 3. Core Architecture & File Structure

```
nexus-forum/
├── prisma/
│   ├── schema.prisma              # Database schema: User, Post, Comment, Vote, Account, Session
│   └── dev.db                     # SQLite database file (gitignored)
│
├── src/
│   ├── app/                       # Next.js App Router (file-system routing)
│   │   ├── layout.tsx             # Root layout — fetches categories + user data, renders 3-panel grid
│   │   ├── page.tsx               # Home feed — fetches posts + user votes from DB
│   │   ├── globals.css            # Tailwind v4 theme, cyberpunk design tokens, glass/glow utilities
│   │   ├── submit/
│   │   │   └── page.tsx           # Create Post page (client component with form)
│   │   ├── post/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Post detail page (server component, fetches post + comments)
│   │   ├── profile/
│   │   │   └── page.tsx           # User profile page (server component, auth-gated)
│   │   ├── settings/
│   │   │   ├── page.tsx           # Settings page (server component, fetches user)
│   │   │   └── SettingsForm.tsx   # Client form with server action
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth]/
│   │               └── route.ts   # NextAuth API route handler
│   │
│   ├── actions/                   # Server Actions (database mutations)
│   │   ├── post.ts                # createPost(formData)
│   │   ├── comment.ts             # createComment(postId, content)
│   │   ├── vote.ts                # votePost(postId, type) — toggle logic
│   │   └── user.ts                # updateProfile(formData)
│   │
│   ├── components/
│   │   ├── layout/                # Shell components
│   │   │   ├── Navbar.tsx         # Top bar — client component, uses userStats prop + useSession()
│   │   │   ├── Sidebar.tsx        # Category list — client component, neon active indicators
│   │   │   ├── SidebarClient.tsx  # Thin wrapper — reads URL searchParams, passes to Sidebar
│   │   │   └── RightPanel.tsx     # Player Dossier — client component with mock Riot sync
│   │   ├── feed/                  # Feed-specific components
│   │   │   ├── PostCard.tsx       # Individual post card with VoteButtons integration
│   │   │   ├── VoteButtons.tsx    # Upvote/downvote with useOptimistic()
│   │   │   ├── CommentSection.tsx # Comment list + CommentInput
│   │   │   ├── CommentInput.tsx   # Textarea + submit with server action
│   │   │   └── FeedPlaceholder.tsx# Loading skeletons
│   │   ├── common/                # Reusable primitives
│   │   │   ├── GlassCard.tsx      # Glassmorphism card wrapper
│   │   │   ├── GlowBadge.tsx      # Neon-glowing badge
│   │   │   └── NeonIcon.tsx       # Icon with neon color
│   │   ├── auth/
│   │   │   └── AuthProvider.tsx   # NextAuth SessionProvider wrapper
│   │   └── ui/                    # shadcn/ui auto-generated components
│   │
│   ├── data/                      # Mock data (seed/default values)
│   │   ├── mock-categories.ts     # 7 forum categories with accent colors
│   │   ├── mock-user-stats.ts     # Default gaming stats for RightPanel fallback
│   │   ├── mock-trending.ts       # Trending topics
│   │   └── mock-nav.ts            # Navbar links
│   │
│   ├── lib/                       # Utilities & configuration
│   │   ├── auth.ts                # NextAuth v4 config (providers, callbacks, adapter)
│   │   ├── prisma.ts              # Prisma client singleton with SQLite adapter
│   │   ├── types.ts               # TypeScript interfaces (Post, Comment, UserStats, Category, etc.)
│   │   ├── mappers.ts             # Prisma DB models → UI types (timeAgo, mapPrismaPost, etc.)
│   │   └── utils.ts               # shadcn cn() utility (Tailwind class merging)
│   │
│   └── generated/prisma/          # Auto-generated Prisma client (gitignored)
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

### Server vs. Client Component Separation

```
                    ┌──────────────────────────────────┐
                    │         layout.tsx (server)        │
                    │  fetches: categories, userStats    │
                    │  passes props down to children     │
                    └──────┬──────────┬─────────────────┘
                           │          │
              ┌────────────▼───┐  ┌──▼──────────────────┐
              │ Navbar.tsx      │  │  RightPanel.tsx      │
              │ "use client"    │  │  "use client"        │
              │ props: userStats│  │  props: userStats    │
              │ + useSession()  │  │  + local state       │
              └─────────────────┘  └─────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  page.tsx (server)  —  fetches posts from Prisma       │
│    └─► PostCard (client)  —  contains VoteButtons       │
│          └─► VoteButtons (client)  —  useOptimistic()   │
│                └─► calls votePost() server action        │
└─────────────────────────────────────────────────────────┘
```

**Rule of thumb**: Server Components fetch data and pass serializable props to Client Components. Client Components handle interactivity (clicks, forms, optimistic UI) and call Server Actions for mutations.

---

## 4. The Step-by-Step Development Journey

### Phase 1: Setup & Initialization

**Goal**: Scaffold a Next.js project with the full toolchain.

**What we did**:
1. Created a Next.js 16 project with `create-next-app` using TypeScript, Tailwind CSS, ESLint, App Router, and `src/` directory
2. Initialized shadcn/ui with the "New York" style and Slate base color
3. Installed shadcn components: `button`, `card`, `badge`, `input`, `separator`, `avatar`, `dropdown-menu`, `sheet`, `scroll-area`, `tooltip`, `skeleton`
4. Installed Lucide React for icons
5. Installed Prisma with `@prisma/adapter-better-sqlite3` for SQLite support
6. Installed NextAuth v4 with `@next-auth/prisma-adapter`

**Why this stack**:
- **Next.js App Router** gives us React Server Components (zero client JS for data fetching) and Server Actions (mutations without API routes)
- **shadcn/ui** gives beautifully styled, accessible components that we control (no npm dependency — source is in our repo)
- **Prisma + SQLite** gives type-safe database access with zero configuration — no Docker, no cloud DB. The schema is the single source of truth
- **NextAuth v4** with JWT strategy avoids database session lookups on every request

---

### Phase 2: App Shell & Global Layout

**Goal**: Build the 3-panel layout skeleton with the cyberpunk theme.

**What we did**:
1. **Customized `globals.css`** with Tailwind v4 `@theme` blocks:
   - Cyber color palette: `cyber-darker (#070A12)`, `cyber-dark (#0B0F19)`, `cyber-surface (#131A2B)`, `cyber-border (#1E2D45)`
   - Neon accents: `neon-blue (#00D4FF)`, `neon-purple (#A855F7)`, `neon-gold (#C8A951)`
   - Utility classes: `.glass` / `.glass-strong` (glassmorphism), `.glow-blue/purple/gold` (neon box-shadow), `.neon-text-*` (glowing text)
   - Custom dark scrollbar
   - Fonts: Inter (body) + Rajdhani (display/monospace)

2. **Built `layout.tsx`** — the root server component:
   - Responsive 3-column grid: `grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[260px_1fr_320px]`
   - Fetches real post counts per category via `prisma.post.groupBy()`
   - Derives `UserStats` by merging real DB identity with mock gaming stat defaults

3. **Built `Navbar.tsx`** — fixed top bar:
   - Logo "NEXUS" with neon-blue Zap icon
   - Desktop nav links with active glow bar
   - Search input (styling only, no backend)
   - Auth dropdown: avatar + name + rank, Profile/Settings links, Sign Out
   - Mobile: hamburger → Sheet drawer with Sidebar inside
   - **Key pattern**: Receives `userStats` prop from the server layout — bypasses stale JWT session data

4. **Built `Sidebar.tsx`** — category navigation:
   - 7 categories with Lucide icons and neon accent colors
   - Active category highlighted with left-border neon gradient
   - Real post counts from database (via `groupBy`)
   - URL-based filtering: `router.push("/?category=patch-notes")`

5. **Built `RightPanel.tsx`** — Player Dossier:
   - Three auth states: loading skeletons → CLASSIFIED overlay → full dossier
   - **Rank Showcase**: Glowing rank name (Challenger = gold glow, Diamond = blue, etc.), LP display, segmented win/loss progress bar, KDA & Hours stat tiles
   - **Recent Performance**: Champion cards with KDA glow thresholds, mini win-rate bars
   - **Force Sync button**: Interactive mock Riot API sync with 3-state lifecycle (idle → syncing → success)

**Why this approach**:
- The 3-panel layout with CSS Grid gives us responsive breakpoints without JavaScript
- Sticky positioning with `overflow-hidden/y-auto` creates independent scroll zones
- Passing data as props from server → client keeps components pure and testable
- The `useSearchParams()` pattern for category filtering enables shareable URLs

---

### Phase 3: Core UI Components

**Goal**: Create reusable, theme-consistent UI primitives.

**What we did**:
1. **`GlassCard.tsx`** — Wrapper with `backdrop-blur-md`, semi-transparent background, subtle border, and optional hover glow
2. **`GlowBadge.tsx`** — shadcn Badge with neon text glow and box shadow based on `variant` prop
3. **`NeonIcon.tsx`** — Lucide icon wrapper that applies neon color classes

**Why**:
- Extracting primitives prevents theme drift — every card looks consistent
- Components are composable: `<GlassCard><GlowBadge>...</GlowBadge></GlassCard>`
- The `cn()` utility from shadcn merges Tailwind classes without conflicts

---

### Phase 4: Mock Data & Interactive Routing

**Goal**: Populate the UI with realistic placeholder data before database integration.

**What we did**:
1. Created `mock-categories.ts` — 7 categories (#PatchNotes, #Esports, #LookingForGroup, #Gameplay, #Memes, #Champions, #Strategy)
2. Created `mock-user-stats.ts` — "Hide on bush" (Faker), Challenger I, 1234 LP, 68.5% WR, 5.2 KDA
3. Created `mock-nav.ts` — Home, Esports, Patches, Trending links with Lucide icons
4. Created `mock-trending.ts` — 5 trending topic cards
5. Built `FeedPlaceholder.tsx` — skeleton cards with pulse animation

**Why**:
- Mock data lets us build and test the UI independently of the database
- When we later integrate Prisma, we replace the data source without touching components
- The TypeScript interfaces (`lib/types.ts`) serve as the contract between data and UI layers
- All mock objects are typed with the same interfaces the database mappers produce

---

### Phase 5: Database (Prisma/SQLite) & Authentication (NextAuth)

**Goal**: Set up the real data layer and user authentication.

**What we did**:

#### Database Schema (`prisma/schema.prisma`)
```prisma
model User {
  id       String  @id @default(cuid())
  name     String?
  email    String? @unique
  image    String?
  lolRank  String?   // "Challenger", "Diamond", etc.
  lp       Int?      // League Points
  server   String?   // "IONIA", "KR", etc.
  posts    Post[]
  comments Comment[]
  votes    Vote[]
}

model Post {
  id           String   @id @default(cuid())
  title        String
  content      String     // markdown
  fullContent  String?    // extended markdown
  tag          String     // "#PatchNotes"
  tagAccent    String     @default("neon-blue")
  upvotes      Int        @default(0)
  downvotes    Int        @default(0)
  commentCount Int        @default(0)
  createdAt    DateTime   @default(now())
  author       User       @relation(fields: [authorId], references: [id])
  authorId     String
  comments     Comment[]
  votes        Vote[]
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
}

model Vote {
  id     String @id @default(cuid())
  type   String // "upvote" or "downvote"
  user   User   @relation(fields: [userId], references: [id])
  userId String
  post   Post   @relation(fields: [postId], references: [id])
  postId String
  @@unique([userId, postId])  // One vote per user per post
}
```

#### Prisma Client Setup (`src/lib/prisma.ts`)
```typescript
import { PrismaClient } from "../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
```

**Key detail**: The singleton pattern (`globalForPrisma`) prevents multiple PrismaClient instances during Next.js hot reloads in development.

#### Authentication (`src/lib/auth.ts`)
- **GitHub Provider**: OAuth with client ID/secret from environment
- **Credentials Provider** ("Demo Login"): Finds or creates a user by summoner name — for local testing without OAuth
- **JWT Strategy**: Session data encoded in a signed JWT cookie — no database lookup per request
- **Callbacks**:
  - `jwt()`: Stores `user.id` in the JWT token
  - `session()`: Copies `token.sub` (user ID) to `session.user.id`
- **Critical fix**: Removed `pages: { signIn: "/" }` which was routing `signIn()` back to the homepage instead of NextAuth's built-in sign-in page

#### AuthProvider
```typescript
// src/components/auth/AuthProvider.tsx
"use client"
import { SessionProvider } from "next-auth/react"
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

**Why this architecture**:
- **Prisma adapter for SQLite**: Using `@prisma/adapter-better-sqlite3` gives us a synchronous, fast, file-based database — perfect for development
- **JWT sessions**: Faster than database sessions (no query per request), stateless, and sufficient for our use case
- **Credentials provider**: Enables "Demo Login" for quick testing — creates a user with `Challenger` rank and `IONIA` server as defaults
- **Session callback**: Adding `user.id` to the session is essential — every server action needs to know WHO is making the request

---

### Phase 6: Real Data Mutations (Server Actions)

**Goal**: Replace mock data with real database reads and writes.

**What we did**:

#### Data Mappers (`src/lib/mappers.ts`)
Before we could display database data, we needed a translation layer:

```typescript
// Prisma User → UI Author
function mapAuthor(author: PrismaAuthor): Post["author"] {
  return {
    name: author.name ?? "Unknown Summoner",
    avatarUrl: author.image ?? "/avatars/default.png",
    rank: (author.lolRank as PostRank) ?? "Gold",
  }
}

// Prisma Post → UI Post
export function mapPrismaPost(p: PrismaPostInput): Post {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    tag: p.tag,
    upvotes: p.upvotes,
    downvotes: p.downvotes,
    commentCount: p.commentCount,
    createdAt: timeAgo(new Date(p.createdAt)),
    author: mapAuthor(p.author),
    userVote: p.userVote ?? null,
  }
}
```

**Why mappers**: Prisma returns Date objects and nullable fields. The UI expects formatted strings (`"3 hours ago"`) and non-nullable fields. Mappers are the single point of transformation.

#### Home Feed (`src/app/page.tsx`)
```typescript
// Server Component — fetches data directly from Prisma
const dbPosts = await prisma.post.findMany({
  where: categoryTag ? { tag: categoryTag } : {},
  include: { author: true },
  orderBy: { createdAt: "desc" },
})

// Get current user's votes to show their vote state
const session = await getServerSession(authOptions)
const userVotes = session?.user?.id
  ? await prisma.vote.findMany({
      where: { userId: session.user.id, postId: { in: postIds } },
    })
  : []

const voteMap = new Map(userVotes.map((v) => [v.postId, v.type]))
const allPosts = dbPosts.map((p) => mapPrismaPost({ ...p, userVote: voteMap.get(p.id) ?? null }))
```

**Key pattern**: `getServerSession(authOptions)` directly in the server component — no API call needed. The session cookie is available to the server, so we can check auth and fetch user-specific data (their votes) in a single render pass.

#### Create Post (`src/actions/post.ts`)
```typescript
"use server"

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Authentication required")

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  // ... validation ...

  await prisma.post.create({
    data: {
      title,
      content,
      tag,
      tagAccent,
      fullContent,
      authorId: session.user.id,
    },
  })

  revalidatePath("/")  // Clear Next.js cache for the feed
  redirect("/")         // Navigate back to home
}
```

**Why Server Actions**: Instead of creating an API route (`/api/posts`), we declare `"use server"` in a function and call it directly from a client form. No fetch(), no error handling boilerplate, no CORS concerns. The function runs on the server with full access to Prisma and the session.

#### Create Comment (`src/actions/comment.ts`)
```typescript
export async function createComment(postId: string, content: string) {
  const session = await getServerSession(authOptions)
  // ... auth check ...

  await prisma.comment.create({
    data: { content, postId, authorId: session.user.id },
  })

  // Update denormalized count for fast reads
  await prisma.post.update({
    where: { id: postId },
    data: { commentCount: { increment: 1 } },
  })

  revalidatePath(`/post/${postId}`)
}
```

**Why denormalized `commentCount`**: We store the count on the Post model to avoid counting comments on every feed render. The `increment` operation is atomic — safe under concurrent writes. This is a standard read-optimization pattern.

#### Submit Page (`src/app/submit/page.tsx`)
- Client component with a form
- 7-tag category selector with neon accent colors
- Summary blurb (500 char limit) + full markdown textarea
- Submit button with spinner during form submission
- Calls `createPost(formData)` directly — no fetch, no API route

#### Profile Page (`src/app/profile/page.tsx`)
- Server component with auth guard via `getServerSession`
- Fetches user with `include: { posts: { include: { author: true } } }`
- Maps posts through `mapPrismaPost()` and renders with `PostCard`

---

### Phase 7: Interactive Polish (Voting & Categories)

**Goal**: Add real-time-feeling interactions and URL-based filtering.

#### Voting System (`src/actions/vote.ts`)
```typescript
export async function votePost(postId: string, type: "upvote" | "downvote") {
  const session = await getServerSession(authOptions)
  // ... auth check ...

  const existing = await prisma.vote.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  })

  if (!existing) {
    // No vote → create new vote
    await prisma.vote.create({ data: { type, userId, postId } })
    await prisma.post.update({ where: { id: postId },
      data: type === "upvote" ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } },
    })
  } else if (existing.type === type) {
    // Same type → toggle off (remove vote)
    await prisma.vote.delete({ where: { id: existing.id } })
    await prisma.post.update({ where: { id: postId },
      data: type === "upvote" ? { upvotes: { decrement: 1 } } : { downvotes: { decrement: 1 } },
    })
  } else {
    // Different type → switch vote
    await prisma.vote.update({ where: { id: existing.id }, data: { type } })
    await prisma.post.update({ where: { id: postId },
      data: {
        upvotes: type === "upvote" ? { increment: 1 } : { decrement: 1 },
        downvotes: type === "downvote" ? { increment: 1 } : { decrement: 1 },
      },
    })
  }

  revalidatePath("/")
  // Return new counts so the client can update optimistically
}
```

**Toggle logic**: Three states — no vote, vote, switch vote. The `@@unique([userId, postId])` constraint ensures one vote per user per post at the database level.

#### Optimistic UI (`src/components/feed/VoteButtons.tsx`)
```typescript
const [optimistic, addOptimistic] = useOptimistic(
  { upvotes, downvotes, userVote },
  (state, action) => {
    if (state.userVote === action.type) {
      // Toggle off
      return { ...state, userVote: null,
        upvotes: action.type === "upvote" ? state.upvotes - 1 : state.upvotes,
        downvotes: action.type === "downvote" ? state.downvotes - 1 : state.downvotes,
      }
    }
    // New vote or switch
    // ... calculate new counts ...
  }
)

const handleVote = (type) => {
  startTransition(() => {
    addOptimistic({ type })
    votePost(postId, type)  // Fire-and-forget server action
  })
}
```

**Why `useOptimistic`**: The UI updates instantly (no waiting for server round-trip). If the server rejects (e.g., auth error), React automatically rolls back to the previous state. `startTransition` marks the update as low-priority — it won't block user input.

#### Category Filtering
**Server side** (`page.tsx`):
```typescript
const categoryTag = searchParams.get("category")
const dbPosts = await prisma.post.findMany({
  where: categoryTag ? { tag: categoryTag } : {},
  // ...
})
```

**Client side** (`SidebarClient.tsx`):
```typescript
const searchParams = useSearchParams()
const activeCategory = searchParams.get("category")

const handleCategoryChange = (categoryId: string) => {
  if (activeCategory === categoryId) {
    router.push("/")              // Toggle off — show all
  } else {
    router.push(`/?category=${categoryId}`)  // Filter
  }
}
```

**Why URL-based state**: The category filter is stored in the URL (`?category=gameplay`). This means:
- Filters survive page refreshes
- URLs are shareable
- The server can read `searchParams` directly (no client state needed)
- Browser back/forward buttons work naturally

#### Sidebar Count Fix
**Problem**: Sidebar showed hardcoded mock counts (234, 1.6k, 432) instead of real database counts.

**Solution**: Made `layout.tsx` async, added:
```typescript
const counts = await prisma.post.groupBy({
  by: ["tag"],
  _count: { id: true },
})
const countMap = new Map(counts.map((c) => [c.tag, c._count.id]))
const categories = mockCategories.map((cat) => ({
  ...cat,
  postCount: countMap.get(cat.name) ?? 0,
}))
```
Passed the merged categories as props through `SidebarClient` → `Sidebar`.

#### Settings Page
**Problem**: Clicking "Settings" triggered a native `alert("Settings coming soon")`.

**Solution**:
1. Changed Navbar dropdown item to `<Link href="/settings">`
2. Created `/settings/page.tsx` — server component that fetches user and passes defaults to form
3. Created `SettingsForm.tsx` — client component with Summoner Name, Region (16 servers), Rank (Iron→Challenger) selectors
4. Created `updateProfile()` server action — updates Prisma, revalidates all relevant routes

#### Data Syncing Fix
**Problem**: After saving settings, Navbar dropdown and RightPanel still showed old data.

**Root cause**: The Navbar used `useSession()` (stale JWT) and the RightPanel received `mockUserStats`.

**Solution**:
1. `layout.tsx` now fetches `getServerSession()` + `prisma.user.findUnique()`, derives `UserStats`, passes to both Navbar and RightPanel
2. Navbar dropdown reads from `userStats` prop (fresh DB data) instead of `session.user`
3. RightPanel uses `useState` with `useEffect` to keep identity fields in sync with server prop while preserving locally-randomized gaming stats

#### Force Sync Button (Mock Riot API)
**Problem**: The "FORCE SYNC DATA" button was a dead `<button>` with no `onClick`.

**Solution**: Three-state interactive button:
- **idle** → clicking triggers sync
- **syncing** (2s) → `Loader2` spinner, "Syncing with Riot Server...", disabled, pulsing blue background
- **success** (2.5s) → `CheckCircle`, green border/text, "Riot account synced successfully!"
- Stats randomized: LP (100–1500), Win Rate (45–65%), KDA (2.0–8.0)

---

## 5. Key Next.js Concepts Learned

### Server Components (RSC)

Server Components run on the server at request time. They can be `async`, directly access databases and filesystems, and never ship JavaScript to the client.

```typescript
// This entire component runs on the server
export default async function HomePage() {
  const posts = await prisma.post.findMany()  // Direct DB access
  return <PostList posts={posts} />            // Serializes to client
}
```

**Key insight**: The `async` component fetches data at the component level — no `useEffect`, no `useState`, no loading spinners (unless you add Suspense). The rendered HTML includes the data.

### Client Components

Client Components run in the browser. They're needed for interactivity (onClick, onChange, useState, useEffect, useOptimistic, browser APIs).

```typescript
"use client"  // <-- This directive marks the boundary

export function VoteButtons({ postId, upvotes, downvotes }) {
  const [optimistic, addOptimistic] = useOptimistic(/* ... */)
  return <button onClick={() => addOptimistic(/* ... */)}>▲</button>
}
```

**Key insight**: The `"use client"` directive creates a boundary. Everything imported by a client component also becomes a client component. That's why we keep server data fetching at the page/layout level and pass data down as props.

### Server Actions

Server Actions are functions that run on the server but can be called from client components like regular async functions.

```typescript
// src/actions/vote.ts
"use server"
export async function votePost(postId: string, type: "upvote" | "downvote") {
  const session = await getServerSession(authOptions)
  // ... database mutation ...
  revalidatePath("/")
}
```

```typescript
// Client component
import { votePost } from "@/actions/vote"
// Called directly — no fetch, no API route
await votePost(postId, "upvote")
```

**Key insight**: Server Actions replace traditional API routes for mutations. They're progressively enhanced — they work without JavaScript (via form `action` attribute) and with JavaScript (via direct function calls). The `revalidatePath()` call tells Next.js to purge its cache and re-render affected pages.

### NextAuth Session Flow

```
1. User clicks "Demo Login" → NextAuth creates/verifies user
2. NextAuth issues a JWT cookie containing { sub: userId }
3. In Server Components: getServerSession(authOptions) reads the cookie
   and decodes the JWT — no database query needed
4. In Client Components: useSession() reads from the SessionProvider
   (populated by an initial server-side fetch)
5. Server Actions use getServerSession() to identify the calling user
```

**Key insight**: `getServerSession()` works in both Server Components and Server Actions because Next.js forwards the request cookies. There's no need to pass the session as a parameter — the server can always read it.

### Cache Revalidation

Next.js aggressively caches server-rendered output. After a mutation, you must tell it to refresh:

```typescript
revalidatePath("/")        // Re-render the home page
revalidatePath("/post/1")  // Re-render a specific post
revalidatePath("/profile") // Re-render the profile page
redirect("/")              // Navigate the client (works in Server Actions)
```

On the client side, `router.refresh()` triggers a re-fetch of the current route's Server Component data without a full page reload.

---

## 6. How to Run Locally

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** 9+

### Setup Steps

```bash
# 1. Clone the repository
git clone <repo-url> nexus-forum
cd nexus-forum

# 2. Install dependencies
npm install

# 3. Push the Prisma schema to SQLite (creates dev.db)
npx prisma db push

# 4. Generate the Prisma client
npx prisma generate

# 5. Set up environment variables
# Create a .env file with:
#   GITHUB_CLIENT_ID=your_github_oauth_client_id
#   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
#   NEXTAUTH_SECRET=your_random_secret_string
#   NEXTAUTH_URL=http://localhost:3000
#
# For local dev without GitHub OAuth, you can leave GITHUB_* empty
# and use the "Demo Login" credentials provider instead.

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Login
1. Click **Connect** in the top-right navbar
2. On the NextAuth sign-in page, enter any summoner name in the "Demo Login" field
3. Click "Sign in with Demo Login"
4. You're now authenticated — the RightPanel unlocks and you can create posts, comment, and vote

### Common Commands

```bash
npm run dev          # Start development server
npx prisma studio    # Open Prisma database GUI (browse/edit data)
npx prisma db push   # Sync schema changes to SQLite
npx tsc --noEmit     # TypeScript type-check without emitting files
```

---

## Appendix: Design Token Reference

| Token | Hex | Usage |
|-------|-----|-------|
| `--cyber-darker` | `#070A12` | Page background |
| `--cyber-dark` | `#0B0F19` | Card backgrounds |
| `--cyber-surface` | `#131A2B` | Elevated surfaces |
| `--cyber-border` | `#1E2D45` | Borders, dividers |
| `--neon-blue` | `#00D4FF` | Primary accent, links, active states |
| `--neon-purple` | `#A855F7` | Secondary accent, settings, magic |
| `--neon-gold` | `#C8A951` | Highlight, Challenger rank, LP |

---

*Generated from the complete NEXUS forum development journey — May/June 2026*
