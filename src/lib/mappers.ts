import type { Post, Comment, PostRank } from "@/lib/types"

// ── Relative time formatter ──
function timeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months !== 1 ? "s" : ""} ago`
}

// ── Prisma User → UI Author shape ──
interface PrismaAuthor {
  name: string | null
  image: string | null
  lolRank: string | null
}

function mapAuthor(author: PrismaAuthor): Post["author"] {
  return {
    name: author.name ?? "Unknown Summoner",
    avatarUrl: author.image ?? "/avatars/default.png",
    rank: (author.lolRank as PostRank) ?? "Gold",
  }
}

// ── Prisma Post → UI Post ──
interface PrismaPostInput {
  id: string
  title: string
  content: string
  fullContent: string | null
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
