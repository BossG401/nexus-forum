import { ArrowBigUp, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Comment } from "@/lib/types"

const rankColors: Record<string, string> = {
  Challenger: "text-neon-gold neon-text-gold",
  Grandmaster: "text-red-400",
  Master: "text-purple-400",
  Diamond: "text-neon-blue",
  Platinum: "text-teal-400",
  Gold: "text-yellow-500",
}

interface CommentCardProps {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="group flex gap-3 py-3.5 first:pt-0 border-b border-cyber-border/50 last:border-b-0">
      {/* Author avatar */}
      <Avatar className="h-8 w-8 ring-1 ring-white/10 shrink-0 mt-0.5">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback className="bg-cyber-surface text-slate-400 text-[10px] font-display">
          {comment.author.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        {/* Author line: name + rank badge + timestamp */}
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-semibold text-slate-200">
            {comment.author.name}
          </span>
          <span
            className={cn(
              "text-[10px] font-semibold font-display uppercase tracking-wider",
              rankColors[comment.author.rank],
            )}
          >
            {comment.author.rank}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-600">
            <Clock size={10} />
            {comment.createdAt}
          </span>
        </div>

        {/* Comment body */}
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
          {comment.content}
        </p>

        {/* Upvote */}
        <div className="flex items-center gap-1 mt-1.5">
          <button className="flex items-center gap-1 text-slate-600 hover:text-neon-gold transition-colors text-xs">
            <ArrowBigUp size={14} strokeWidth={1.5} />
            <span className="font-display tabular-nums text-[11px]">{comment.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
