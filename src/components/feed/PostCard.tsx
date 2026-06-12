import Link from "next/link"
import { Clock, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { rankLabel, tagLabel } from "@/lib/labels"
import type { Post } from "@/lib/types"
import { VoteButtons } from "./VoteButtons"

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

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div className="flex">
        <VoteButtons
          postId={post.id}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          userVote={post.userVote}
        />

        <div className="min-w-0 flex-1 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Badge
              variant="outline"
              className={cn(
                "h-6 rounded-full px-2.5 text-xs font-medium",
                tagStyles[post.tagAccent],
              )}
            >
              {tagLabel(post.tag)}
            </Badge>
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-muted-foreground" />
              {post.createdAt}
            </span>
          </div>

          <Link href={`/post/${post.id}`} className="block">
            <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h2>
          </Link>

          <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-muted-foreground">
            {post.content}
          </p>

          {post.imageUrl ? (
            <Link href={`/post/${post.id}`} className="mt-4 block overflow-hidden rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.imageUrl} alt="" className="max-h-[420px] w-full object-cover" />
            </Link>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar className="h-8 w-8 ring-1 ring-border">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="truncate text-sm font-medium text-foreground">
                  {post.author.name}
                </span>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    rankStyles[post.author.rank],
                  )}
                >
                  {rankLabel(post.author.rank)}
                </span>
              </div>
            </div>

            <Link
              href={`/post/${post.id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <MessageCircle size={16} />
              {post.commentCount} 条评论
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
