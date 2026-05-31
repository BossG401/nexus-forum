import Link from "next/link"
import { MessageCircle, Clock, Swords } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { VoteButtons } from "./VoteButtons"
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

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const score = post.upvotes - post.downvotes

  return (
    <article
      className={cn(
        "group relative",
        "glass-subtle rounded-lg overflow-hidden",
        "transition-all duration-200",
        "hover:-translate-y-1 hover:border-l-2 hover:border-l-[#C8A951]",
        "hover:shadow-[0_0_20px_rgba(200,169,81,0.08),0_4px_20px_rgba(0,0,0,0.3)]"
      )}
    >
      <div className="flex">
        {/* ── Vote Column ── */}
        <VoteButtons
          postId={post.id}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          userVote={post.userVote}
        />

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0 p-4">
          {/* Header: tag + time */}
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] leading-tight px-1.5 py-0 rounded-sm font-semibold uppercase tracking-wider",
                tagColors[post.tagAccent]
              )}
            >
              {post.tag}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-slate-600">
              <Clock size={11} />
              {post.createdAt}
            </span>
          </div>

          {/* Title — clickable link to detail page */}
          <Link href={`/post/${post.id}`} className="block">
            <h3 className="text-base font-display font-semibold text-slate-100 group-hover:text-neon-gold transition-colors leading-snug mb-1.5 hover:underline decoration-neon-gold/30 underline-offset-2">
              {post.title}
            </h3>
          </Link>

          {/* Content preview */}
          <p className="text-sm text-slate-400 leading-relaxed line-clamp-2 mb-3">
            {post.content}
          </p>

          {/* Footer: author + interactions */}
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7 ring-1 ring-white/10">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback className="bg-cyber-surface text-slate-400 text-[10px]">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-slate-300 truncate max-w-[120px]">
                  {post.author.name}
                </span>
                <span className={cn("text-[10px] font-semibold font-display uppercase tracking-wider", rankColors[post.author.rank])}>
                  {post.author.rank}
                </span>
              </div>
            </div>

            {/* Interaction counts */}
            <div className="flex items-center gap-3">
              {/* Mobile vote display */}
              <span className="sm:hidden flex items-center gap-1 text-xs text-slate-500">
                <Swords size={13} />
                {score}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MessageCircle size={13} />
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
