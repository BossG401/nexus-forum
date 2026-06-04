import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MessageCircle, Clock, Swords, ExternalLink } from "lucide-react"
import { getServerSession } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VoteButtons } from "@/components/feed/VoteButtons"
import { CommentSection } from "@/components/feed/CommentSection"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost, mapPrismaComment } from "@/lib/mappers"
import { authOptions } from "@/lib/auth"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

const rankColors: Record<string, string> = {
  Challenger: "text-neon-gold neon-text-gold",
  Grandmaster: "text-red-400",
  Master: "text-purple-400",
  Diamond: "text-neon-blue",
  Platinum: "text-teal-400",
  Gold: "text-yellow-500",
}

const tagColors: Record<string, string> = {
  "neon-blue": "border-neon-blue/40 text-neon-blue",
  "neon-purple": "border-neon-purple/40 text-neon-purple",
  "neon-gold": "border-neon-gold/40 text-neon-gold",
}

// ── Simple content renderer: handles # / ## / - / | / plain text ──
function PostBody({ content }: { content: string }) {
  const paragraphs = content.split("\n\n")

  return (
    <div className="prose-custom space-y-3">
      {paragraphs.map((block, i) => {
        const lines = block.split("\n")

        // Table detection
        if (lines.length >= 3 && lines.every((l) => l.trim().startsWith("|"))) {
          const rows = lines.map((l) =>
            l
              .trim()
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((c) => c.trim()),
          )

          const isHeaderRow = rows.length >= 2 && rows[1]?.every((c) => /^[-:]+$/.test(c))

          return (
            <div key={i} className="overflow-x-auto my-4 rounded-sm border border-cyber-border">
              <table className="w-full text-sm">
                {isHeaderRow && (
                  <thead>
                    <tr className="bg-cyber-surface/50">
                      {rows[0].map((cell, ci) => (
                        <th
                          key={ci}
                          className="px-3 py-2 text-left text-xs font-display font-semibold text-neon-blue uppercase tracking-wider border-b border-cyber-border"
                        >
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {(isHeaderRow ? rows.slice(2) : rows).map((row, ri) => (
                    <tr key={ri} className="border-b border-cyber-border/50 last:border-b-0">
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-1.5 text-slate-400">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        // Paragraph type detection
        return (
          <div key={i}>
            {lines.map((line, li) => {
              if (line.startsWith("# ")) {
                return (
                  <h2
                    key={li}
                    className="text-xl font-display font-bold text-neon-gold tracking-wide mt-6 mb-2"
                  >
                    {line.slice(2)}
                  </h2>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h3
                    key={li}
                    className="text-base font-display font-semibold text-neon-blue uppercase tracking-wider mt-4 mb-1.5"
                  >
                    {line.slice(3)}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={li} className="text-slate-300 ml-4 list-disc marker:text-neon-blue/50">
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={li} className="font-bold text-slate-200">
                    {line.slice(2, -2)}
                  </p>
                )
              }
              if (line.trim() === "") return <br key={li} />
              return (
                <p key={li} className="text-slate-300 leading-relaxed">
                  {line}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ── Page ──
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const dbPost = await prisma.post.findUnique({
    where: { id },
    include: { author: true },
  })

  if (!dbPost) {
    notFound()
  }

  // Fetch current user's vote on this post
  const session = await getServerSession(authOptions)
  let userVote: "upvote" | "downvote" | null = null
  if (session?.user?.id) {
    const vote = await prisma.vote.findUnique({
      where: { userId_postId: { userId: session.user.id, postId: id } },
    })
    userVote = (vote?.type as "upvote" | "downvote") ?? null
  }

  const post = mapPrismaPost({ ...dbPost, userVote })

  // Fetch real comments for this post
  const dbComments = await prisma.comment.findMany({
    where: { postId: id },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  })

  const comments = dbComments.map(mapPrismaComment)
  const score = post.upvotes - post.downvotes

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-neon-blue transition-colors mb-6 font-display tracking-wider uppercase group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Feed
      </Link>

      {/* ── Expanded Post Card ── */}
      <article className="glass-subtle rounded-lg overflow-hidden mb-8">
        <div className="flex">
          {/* Vote Column */}
          <VoteButtons
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.userVote}
            size="lg"
          />

          {/* Content */}
          <div className="flex-1 min-w-0 p-4">
            {/* Header: tag + time */}
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] leading-tight px-1.5 py-0 rounded-sm font-semibold uppercase tracking-wider",
                  tagColors[post.tagAccent],
                )}
              >
                {post.tag}
              </Badge>
              <span className="flex items-center gap-1 text-[11px] text-slate-600">
                <Clock size={11} />
                {post.createdAt}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-display font-bold text-slate-100 leading-snug mb-3">
              {post.title}
            </h1>

            {/* Mobile vote display */}
            <div className="sm:hidden flex items-center gap-3 mb-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Swords size={13} />
                {score}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={13} />
                {post.commentCount}
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="h-8 w-8 ring-1 ring-white/10">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback className="bg-cyber-surface text-slate-400 text-[10px]">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-300 font-medium">{post.author.name}</span>
              <span
                className={cn(
                  "text-[10px] font-semibold font-display uppercase tracking-wider",
                  rankColors[post.author.rank],
                )}
              >
                {post.author.rank}
              </span>
            </div>

            <Separator className="bg-cyber-border mb-5" />

            {/* Post image */}
            {post.imageUrl && (
              <div className="mb-5 overflow-hidden rounded-sm border border-cyber-border/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt="Post screenshot"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Full post body */}
            <PostBody content={post.fullContent ?? post.content} />

            {/* Interaction bar */}
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-cyber-border/50">
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MessageCircle size={14} />
                {post.commentCount} comments
              </span>
              <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-neon-blue transition-colors">
                <ExternalLink size={12} />
                Share
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* ── Comments Section ── */}
      <CommentSection comments={comments} postId={id} />
    </div>
  )
}
