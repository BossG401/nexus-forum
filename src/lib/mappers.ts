import type { Post, Comment, PostRank } from "@/lib/types"

// ── 相对时间格式化（中文无复数，逻辑更简单）──
function timeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "刚刚"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} 天前`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} 周前`
  const months = Math.floor(days / 30)
  return `${months} 个月前`
}

// ── Prisma User → UI Author shape ──
interface PrismaAuthor {
  name: string | null
  image: string | null
  lolRank: string | null
}

function mapAuthor(author: PrismaAuthor): Post["author"] {
  return {
    name: author.name ?? "未知召唤师",
    avatarUrl: author.image ?? "/avatars/default.svg",
    rank: (author.lolRank as PostRank) ?? "Gold",
  }
}

// ── Prisma Post → UI Post ──
interface PrismaPostInput {
  id: string
  title: string
  content: string
  fullContent: string | null
  imageUrl: string | null
  tag: string
  tagAccent: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: Date
  author: PrismaAuthor
  userVote?: "upvote" | "downvote" | null
}

export function mapPrismaPost(p: PrismaPostInput): Post {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    fullContent: p.fullContent ?? undefined,
    imageUrl: p.imageUrl ?? null,
    tag: p.tag,
    tagAccent: p.tagAccent as Post["tagAccent"],
    upvotes: p.upvotes,
    downvotes: p.downvotes,
    commentCount: p.commentCount,
    createdAt: timeAgo(new Date(p.createdAt)),
    author: mapAuthor(p.author),
    userVote: p.userVote ?? null,
  }
}

// ── Prisma Comment → UI Comment ──
interface PrismaCommentInput {
  id: string
  content: string
  createdAt: Date
  postId: string
  author: PrismaAuthor
}

export function mapPrismaComment(c: PrismaCommentInput): Comment {
  return {
    id: c.id,
    postId: c.postId,
    content: c.content,
    createdAt: timeAgo(new Date(c.createdAt)),
    author: mapAuthor(c.author),
    upvotes: 0, // no vote system on comments yet
  }
}
