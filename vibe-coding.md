# Project: Hardcore LoL Esports Forum (Vibe Coding Prompt)

## 1. Project Overview
We are building a modern, hardcore gaming forum primarily dedicated to League of Legends (LoL) players. The platform features a Reddit-style discussion system and proudly displays users' real gaming stats, ranks, and playtime.

## 2. Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Lucide Icons.
- **Backend:** Spring Boot (Java/Kotlin), Spring Security (OAuth2), Spring Data JPA.
- **Database:** PostgreSQL.
- **Authentication:** OAuth 2.0 (WeChat/QQ/GitHub/Discord integration concepts).

## 3. UI/UX Vibe (Design Language)
- **Theme:** Dark Esports Style (Cyberpunk/Neon accents). 
- **Colors:** Deep dark backgrounds (e.g., `#0B0F19` or `slate-950`), accented with vibrant neon colors (Electric Blue, Neon Purple, or Hextech Gold) for buttons, borders, and active states.
- **Vibe:** Sleek, competitive, and highly modern. Glassmorphism for cards, glow effects for high-rank badges.
- **Mode:** STRICTLY Dark Mode.

## 4. Core Features
### A. Tencent LoL Account Integration (Crucial Mock)
*Note to AI Developer: The user targets Chinese LoL servers (Tencent). There is NO official public API for this. Therefore, you MUST build a robust Mock Service for the following:*
- **Account Binding:** Simulate a UI to bind QQ/WeChat to fetch LoL summoner data.
- **Stats Display:** Mock real playtime (hours), current Rank (e.g., Challenger, Diamond), KDA, and Win Rate.
- **UI Element:** Beautiful user profile cards showing these stats next to their forum posts.

### B. Reddit-Style Forum System
- **Layout:** Feed-based thread list (like Reddit).
- **Post Details:** Markdown support for rich text rendering.
- **Comments:** Nested / Tree-like comment structure (recursive components).
- **Interactions:** Upvote/Downvote system for both posts and comments.
- **Tags/Categories:** Filter by tags (e.g., #PatchNotes, #Esports, #LookingForGroup).

## 5. Development Flow: FRONTEND FIRST
*Rule: We are taking a Frontend-First approach. Do NOT write Spring Boot backend code until the Frontend UI is fully completed and approved.*

- **Phase 1: Setup & Layout.** Initialize Next.js, Tailwind, and shadcn/ui. Build the layout skeleton (Navbar, Sidebar, and Right panel for user stats).
- **Phase 2: The Vibe.** Implement the Dark Esports UI. Create dummy data for posts and LoL stats to make the UI look alive.
- **Phase 3: Core Components.** Build the Reddit-style feed, the nested comment tree, and the impressive LoL Stats Profile Card.
- **Phase 4: Backend Prep.** Only after UI is perfect, design the PostgreSQL schema and outline the Spring Boot REST API structure.

## 6. AI Developer Instructions (Claude Rules)
1. **Think Before Coding:** Always output a short plan of which files you are creating/modifying before writing code.
2. **Beautiful UI out-of-the-box:** Don't write plain HTML. Heavily utilize Tailwind utilities for hover states, transitions, glows (`shadow-cyan-500/50`), and modern aesthetics.
3. **No Placeholders in UI:** Provide complete React components with realistic mock data (e.g., Faker data for comments, "Faker#T1" for mock LoL names) so the user can see the final vision immediately.
4. **Iterative Execution:** Stop and ask for user feedback after completing each Phase.
