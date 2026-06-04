import { ArrowBigUp, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Comment } from "@/lib/types"

const rankColors: Record<string, string> = {
  Challenger: "text-neon-gold-hot neon-text-gold font-black",
  Grandmaster: "text-neon-crimson font-bold",
  Master: "text-neon-purple-hot font-bold",
  Diamond: "text-neon-blue-hot font-bold",
  Platinum: "text-teal-300",
  Gold: "text-yellow-400",
}

interface CommentCardProps { comment: Comment }

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="group flex gap-2 py-2.5 first:pt-0 border-b border-white/[0.04] last:border-b-0 transition-all duration-200">
      <Avatar className="h-7 w-7 ring-1 ring-white/[0.08] clip-diamond shrink-0 mt-0.5 transition-all duration-200 group-hover:ring-neon-blue/20">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback className="bg-cyber-surface text-slate-400 text-[8px] font-display font-bold">{comment.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className="text-xs font-display font-bold text-slate-200 tracking-wide">{comment.author.name}</span>
          <span className={cn("text-[7px] font-display font-black uppercase tracking-widest", rankColors[comment.author.rank])}>{comment.author.rank}</span>
          <span className="flex items-center gap-0.5 text-[9px] text-slate-400/60 font-mono"><Clock size={8} className="opacity-50" />{comment.createdAt}</span>
        </div>
        <p className="text-xs text-slate-300/80 leading-relaxed whitespace-pre-line font-mono">{comment.content}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <button className="flex items-center gap-1 text-slate-400/60 hover:text-neon-gold transition-all duration-200 text-[10px] active:scale-90 hover:skew-x-[-3deg] px-1 py-0.5 -ml-1">
            <ArrowBigUp size={13} strokeWidth={1.5} />
            <span className="font-display font-bold tabular-nums">{comment.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
