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
  "neon-blue": "border-neon-blue/30 text-neon-blue bg-neon-blue/[0.06]",
  "neon-purple": "border-neon-purple/30 text-neon-purple bg-neon-purple/[0.06]",
  "neon-gold": "border-neon-gold/30 text-neon-gold bg-neon-gold/[0.06]",
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
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-[3px]",
        "hover:border-l-[2px] hover:border-l-neon-gold/60",
        "hover:shadow-[0_0_24px_rgba(200,169,81,0.06),0_8px_32px_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.12)]",
        "active:translate-y-0 active:shadow-none"
      )}
    >
      <div className="flex">
        {/*─── Vote Column ───*/}
        <VoteButtons
          postId={post.id}
          upvotes={post.upvotes}
          downvotes={post.downvotes}
          userVote={post.userVote}
        />

        {/*─── Main Content ───*/}
        <div className="flex-1 min-w-0 p-5">
          {/* Header: tag + time */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] leading-tight px-2 py-0.5 rounded-sm font-display font-bold uppercase tracking-wider transition-all duration-200",
                tagColors[post.tagAccent]
              )}
            >
              {post.tag}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-slate-500/70">
              <Clock size={10} className="opacity-60" />
              {post.createdAt}
            </span>
          </div>

          {/* Title — clickable link to detail page */}
          <Link href={`/post/${post.id}`} className="block group/title">
            <h3 className="text-[15px] font-display font-semibold text-slate-100 group-hover:text-neon-gold transition-colors duration-300 leading-snug mb-2 group-hover/title:underline decoration-neon-gold/25 underline-offset-3 decoration-1">
              {post.title}
            </h3>
          </Link>

          {/* Content preview */}
          <p className="text-[13px] text-slate-400/80 leading-relaxed line-clamp-2 mb-4">
            {post.content}
          </p>

          {/* Footer: author + interactions */}
          <div className="flex items-center justify-between">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              <Avatar className="h-7 w-7 ring-1 ring-white/[0.06] transition-all duration-200 group-hover:ring-white/[0.1]">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback className="bg-cyber-surface text-slate-400 text-[10px]">
                  {post.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] text-slate-300 truncate max-w-[120px] font-medium">
                  {post.author.name}
                </span>
                <span className={cn(
                  "text-[10px] font-display font-bold uppercase tracking-wider",
                  rankColors[post.author.rank]
                )}>
                  {post.author.rank}
                </span>
              </div>
            </div>

            {/* Interaction counts */}
            <div className="flex items-center gap-3.5">
              {/* Mobile vote display */}
              <span className="sm:hidden flex items-center gap-1 text-xs text-slate-500/70">
                <Swords size={12} className="opacity-60" />
                {score}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-500/70 transition-colors duration-200 group-hover:text-slate-400">
                <MessageCircle size={12} className="opacity-60" />
                {post.commentCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
