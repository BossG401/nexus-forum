import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock, ExternalLink, MessageCircle } from "lucide-react"
import { getServerSession } from "next-auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CommentSection } from "@/components/feed/CommentSection"
import { VoteButtons } from "@/components/feed/VoteButtons"
import { authOptions } from "@/lib/auth"
import { mapPrismaComment, mapPrismaPost } from "@/lib/mappers"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"

const rankStyles: Record<string, string> = {
  Challenger: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Grandmaster: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  Master: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  Diamond: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  Platinum: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
  Gold: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30",
}

const tagStyles: Record<string, string> = {
  "neon-blue": "bg-muted text-foreground border-border",
  "neon-purple": "bg-violet-500/12 text-violet-700 dark:text-violet-300 border-violet-500/25",
  "neon-gold": "bg-primary/12 text-primary border-primary/25",
}

function PostBody({ content }: { content: string }) {
  const paragraphs = content.split("\n\n")

  return (
    <div className="space-y-4 text-[15px] leading-7 text-foreground/80">
      {paragraphs.map((block, blockIndex) => {
        const lines = block.split("\n")

        if (lines.length >= 3 && lines.every((line) => line.trim().startsWith("|"))) {
          const rows = lines.map((line) =>
            line
              .trim()
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((cell) => cell.trim()),
          )
          const isHeaderRow = rows.length >= 2 && rows[1]?.every((cell) => /^[-:]+$/.test(cell))

          return (
            <div key={blockIndex} className="my-5 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                {isHeaderRow ? (
                  <thead>
                    <tr className="bg-muted">
                      {rows[0].map((cell, cellIndex) => (
                        <th key={cellIndex} className="border-b border-border px-4 py-2 text-left font-semibold text-foreground">
                          {cell}
                        </th>
                      ))}
                    </tr>
                  </thead>
                ) : null}
                <tbody>
                  {(isHeaderRow ? rows.slice(2) : rows).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border last:border-b-0">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-muted-foreground">
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

        return (
          <div key={blockIndex} className="space-y-2">
            {lines.map((line, lineIndex) => {
              if (line.startsWith("# ")) {
                return (
                  <h2 key={lineIndex} className="mt-7 text-2xl font-semibold tracking-tight text-foreground">
                    {line.slice(2)}
                  </h2>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h3 key={lineIndex} className="mt-5 text-lg font-semibold text-foreground">
                    {line.slice(3)}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={lineIndex} className="ml-5 list-disc marker:text-primary">
                    {line.slice(2)}
                  </li>
                )
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p key={lineIndex} className="font-semibold text-foreground">
                    {line.slice(2, -2)}
                  </p>
                )
              }
              if (line.trim() === "") return <br key={lineIndex} />
              return <p key={lineIndex}>{line}</p>
            })}
          </div>
        )
      })}
    </div>
  )
}

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

  if (!dbPost) notFound()

  const session = await getServerSession(authOptions)
  let userVote: "upvote" | "downvote" | null = null

  if (session?.user?.id) {
    const vote = await prisma.vote.findUnique({
      where: { userId_postId: { userId: session.user.id, postId: id } },
    })
    userVote = (vote?.type as "upvote" | "downvote") ?? null
  }

  const post = mapPrismaPost({ ...dbPost, userVote })
  const dbComments = await prisma.comment.findMany({
    where: { postId: id },
    include: { author: true },
    orderBy: { createdAt: "asc" },
  })
  const comments = dbComments.map(mapPrismaComment)

  return (
    <div className="max-w-3xl">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to discussions
      </Link>

      <article className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex">
          <VoteButtons
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.userVote}
            size="lg"
          />

          <div className="min-w-0 flex-1 p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge
                variant="outline"
                className={cn("h-6 rounded-full px-2.5 text-xs font-medium", tagStyles[post.tagAccent])}
              >
                {post.tag}
              </Badge>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.createdAt}
              </span>
            </div>

            <h1 className="text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-3xl">
              {post.title}
            </h1>

            <div className="mt-4 flex items-center gap-2.5">
              <Avatar className="h-9 w-9 ring-1 ring-border">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{post.author.name}</span>
              <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", rankStyles[post.author.rank])}>
                {post.author.rank}
              </span>
            </div>

            {post.imageUrl ? (
              <div className="my-6 overflow-hidden rounded-xl border border-border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.imageUrl} alt="Post attachment" className="max-h-[520px] w-full object-cover" />
              </div>
            ) : (
              <div className="my-6 border-t border-border" />
            )}

            <PostBody content={post.fullContent ?? post.content} />

            <div className="mt-7 flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MessageCircle size={16} />
                {post.commentCount} comments
              </span>
              <button className="flex items-center gap-1.5 rounded-full px-2 py-1 transition-colors hover:bg-accent hover:text-foreground">
                <ExternalLink size={15} />
                Share
              </button>
            </div>
          </div>
        </div>
      </article>

      <CommentSection comments={comments} postId={id} />
    </div>
  )
}
