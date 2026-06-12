# NEXUS — 英雄联盟社区论坛

面向英雄联盟玩家的现代社区论坛 —— 讨论赛事、版本公告、玩法攻略与玩家故事。基于 Next.js 16 App Router，支持 Light/Dark 双主题。

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)

---

## 页面布局

```text
┌─────────────────────────────────────────────────────────┐
│  ⚡ NEXUS  │  🔍 搜索…  │  + 发帖  │ 🔔 │ 👤 │  ← 导航栏  │
├──────────┬────────────────────────┬──────────────────────┤
│          │                        │  ┌────────────────┐  │
│  侧边栏   │   帖子流 / 内容区       │  │ 玩家档案        │  │
│  280px   │   （主区域）            │  │ 段位, LP, 胜率  │  │
│          │                        │  │ KDA, 常用英雄   │  │
│  分类导航  │                        │  │ [同步战绩]      │  │
│          │                        │  └────────────────┘  │
├──────────┴────────────────────────┴──────────────────────┤
│                 三栏响应式网格布局                          │
│   lg: 两栏（侧边栏 + 主区域）  xl: 三栏（+ 右侧面板）       │
└─────────────────────────────────────────────────────────┘
```

---

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/BossG401/nexus-forum.git
cd nexus-forum

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 从 Vercel 拉取 .env 或手动创建，需包含：
#   POSTGRES_PRISMA_URL=postgresql://...?sslmode=verify-full
#   GITHUB_CLIENT_ID=...
#   GITHUB_CLIENT_SECRET=...
#   NEXTAUTH_SECRET=...
#   UPLOADTHING_SECRET=...

# 4. 推送数据库结构
npx prisma generate
npx prisma db push

# 5. 启动开发服务器
npm run dev
# → http://localhost:3000
```

### 体验登录

未配置 GitHub OAuth 时，可使用 **"体验登录"**（Credentials 方式），输入召唤师名称即可进入。

---

## 技术栈

| 层级 | 技术 |
| --- | --- |
| **框架** | Next.js 16（App Router，React 19） |
| **语言** | TypeScript |
| **样式** | Tailwind CSS v4 + `tw-animate-css` |
| **UI 库** | shadcn/ui（New York 风格） |
| **图标** | Lucide React |
| **认证** | NextAuth v4（GitHub + 体验登录） |
| **数据库** | PostgreSQL（Neon 托管） |
| **ORM** | Prisma 7 + `@prisma/adapter-pg` |
| **文件上传** | UploadThing |
| **包管理器** | npm |

---

## 项目结构

```text
nexus-forum/
├── prisma/
│   └── schema.prisma              # User、Post、Comment、Vote 数据模型
├── src/
│   ├── app/
│   │   ├── layout.tsx             # 三栏根布局（服务端组件）
│   │   ├── page.tsx               # 首页帖子流（无限滚动）
│   │   ├── globals.css            # 主题：语义化 token，亮/暗双模式
│   │   ├── submit/page.tsx        # 发布帖子
│   │   ├── post/[id]/page.tsx     # 帖子详情 + 评论区
│   │   ├── profile/page.tsx       # 个人主页 + 设置入口
│   │   ├── settings/              # 账号设置（头像、名称、段位）
│   │   ├── esports/page.tsx       # 电竞分类
│   │   ├── patches/page.tsx       # 版本公告分类
│   │   ├── trending/page.tsx      # 热门帖子（按点赞排序）
│   │   └── api/auth/[...nextauth]/ # NextAuth 路由
│   ├── actions/                   # 服务端操作（评论、帖子、用户、投票）
│   ├── components/
│   │   ├── layout/                # 导航栏、侧边栏、右侧面板、侧边栏客户端
│   │   ├── auth/                  # 认证 Provider
│   │   ├── feed/                  # 帖子卡片、帖子流、无限滚动、投票按钮、
│   │   │                          #   评论卡片、评论输入、评论区、发帖表单
│   │   ├── theme/                 # 主题 Provider、主题切换按钮
│   │   └── ui/                    # shadcn/ui 基础组件
│   ├── lib/
│   │   ├── prisma.ts              # 数据库客户端（Neon，sslmode=verify-full）
│   │   ├── auth.ts                # NextAuth 配置（GitHub + 体验登录）
│   │   ├── labels.ts              # tagLabel() / rankLabel() 汉化映射
│   │   ├── mappers.ts             # Prisma → UI 类型转换 + timeAgo()
│   │   ├── types.ts               # TypeScript 接口定义
│   │   ├── constants.ts           # PAGE_SIZE 等共享常量
│   │   └── utils.ts               # cn() 工具函数
│   ├── data/                      # 模拟数据（分类、统计、导航）
│   └── generated/prisma/          # 生成的 Prisma 客户端
├── CLAUDE.md                      # AI 编程指南
└── README.md
```

---

## 设计系统

Tailwind v4 语义化双主题 token 系统，定义在 `src/app/globals.css`。通过 `next-themes` 切换 `.dark` class。

| Token | 亮色 | 暗色 | 用途 |
| --- | --- | --- | --- |
| `--background` | `#f4f4f5` | `#0a0a0a` | 页面背景 |
| `--card` / `--popover` | `#ffffff` | `#161618` | 卡片、面板、下拉菜单 |
| `--foreground` / `--card-foreground` | `#18181b` | `#fafafa` | 主文字 |
| `--muted` / `--accent` / `--secondary` | `#f4f4f5` | `#27272a` | 内凹填充、悬停态 |
| `--muted-foreground` | `#71717a` | `#a1a1aa` | 次要文字 |
| `--border` / `--input` | `#e4e4e7` | `#26262a` | 边框、分割线 |
| `--primary` / `--ring` | `#ef5616` | `#ff5c1a` | 橙色强调色、聚焦环 |
| `--destructive` | `#e5484d` | `#f0494e` | 错误、危险操作 |

**布局约定**：导航栏（`bg-card/80`）、侧边栏（`bg-card`）、帖子卡片等结构面板置于 `bg-background` 页面之上。输入框使用 `bg-background` 在 `bg-card` 面板中形成内凹效果。状态徽章使用双模式配色（如 `text-amber-700 dark:text-amber-300`）。

---

## 汉化说明

全站 UI 已汉化。数据库中的标签（`#PatchNotes`）和段位（`Challenger`）以英文存储，通过 `src/lib/labels.ts` 映射为中文显示：

| 英文键 | 中文显示 |
| --- | --- |
| `#PatchNotes` | 版本公告 |
| `#Esports` | 电子竞技 |
| `#Gameplay` | 玩法攻略 |
| `Challenger` | 最强王者 |
| `Gold` | 黄金 |

---

## 版本历史

### v1.2 — 汉化 + 基础设施修复

- ✅ 全站 UI 汉化：导航、按钮、提示、错误信息翻译为中文
- ✅ 新增 `src/lib/labels.ts`：`tagLabel()` / `rankLabel()` 数据键 → 中文映射
- ✅ 修复数据库连接超时：改用 Neon 直连端点 + `sslmode=verify-full`
- ✅ 修复分类页面标题（电竞、版本公告显示正确中文分类名）
- ✅ 修复主题脚本 React 19 兼容性（原生 `<script>` 置于 `<head>`）

### v1.1 — 云端数据库迁移

- ✅ 从本地 SQLite 迁移至 **Neon Postgres**（PostgreSQL）
- ✅ Prisma 7 + `@prisma/adapter-pg` + `pg` 驱动 + SSL
- ✅ 新增无限滚动（基于游标的分页）
- ✅ UploadThing 图片上传
- ✅ GitHub OAuth 登录
- ✅ NEXUS 简约重设计：语义化 Light/Dark 双主题 token

### v1.0 — 论坛核心功能

- ✅ 三栏响应式布局（导航栏 + 侧边栏 + 帖子流 + 右侧面板）
- ✅ NextAuth v4（GitHub OAuth + 体验登录）
- ✅ CRUD：发帖、帖子详情、评论系统
- ✅ 赞/踩投票（Prisma 持久化）
- ✅ 个人主页（可编辑英雄联盟身份：段位、LP、区服）
- ✅ 设置页面（数据库同步更新）
- ✅ 右侧「玩家档案」面板 + 模拟 Riot API 战绩同步
- ✅ shadcn/ui 基础组件（Button、Card、Avatar、DropdownMenu、Sheet 等）

---

## 常用命令

```bash
npm run dev       # 启动开发服务器（localhost:3000）
npm run build     # 生产构建
npm start         # 启动生产服务器
npm run lint      # ESLint 检查
```
