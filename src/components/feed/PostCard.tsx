import Link from "next/link"
import { MessageCircle, Clock, Swords } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { VoteButtons } from "./VoteButtons"
import { cn } from "@/lib/utils"
import type { Post } from "@/lib/types"

const rankStyles: Record<string, string> = {
  Challenger: "text-neon-gold-hot neon-text-gold font-black",
  Grandmaster: "text-neon-crimson neon-text-crimson font-bold",
  Master: "text-neon-purple-hot neon-text-purple font-bold",
  Diamond: "text-neon-blue-hot neon-text-blue font-bold",
  Platinum: "text-teal-300",
  Gold: "text-yellow-400",
}

const tagStyles: Record<string, string> = {
  "neon-blue": "border-neon-blue/30 text-neon-blue bg-neon-blue/[0.08] shadow-[0_0_8px_rgba(0,212,255,0.1)]",
  "neon-purple": "border-neon-purple/30 text-neon-purple bg-neon-purple/[0.08] shadow-[0_0_8px_rgba(168,85,247,0.1)]",
  "neon-gold": "border-neon-gold/30 text-neon-gold bg-neon-gold/[0.08] shadow-[0_0_8px_rgba(212,168,67,0.1)]",
}

interface PostCardProps { post: Post }

export function PostCard({ post }: PostCardProps) {
  const score = post.upvotes - post.downvotes
  return (
    <article className="group relative clip-chamfer hover-scanline card-brutal glass-subtle">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-blue/25 pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-blue/25 pointer-events-none z-10" />
      <div className="flex relative z-[1]">
        <VoteButtons postId={post.id} upvotes={post.upvotes} downvotes={post.downvotes} userVote={post.userVote} />
        <div className="flex-1 min-w-0 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={cn("text-[9px] leading-tight px-2 py-0.5 font-display font-black uppercase tracking-widest clip-tag transition-all duration-200", tagStyles[post.tagAccent])}>{post.tag}</Badge>
            <span className="flex items-center gap-1 text-[10px] text-slate-400/70 font-mono"><Clock size={9} className="opacity-60" />{post.createdAt}</span>
          </div>
          <Link href={`/post/${post.id}`} className="block group/title">
            <h3 className="text-base font-display font-bold text-slate-100 group-hover:text-neon-gold-hot transition-all duration-300 leading-snug mb-1 tracking-wide glitch-text">{post.title}</h3>
          </Link>
          <p className="text-sm text-slate-400/80 leading-snug line-clamp-3 mb-2.5 font-mono">{post.content}</p>
          {post.imageUrl && (
            <div className="mb-3 overflow-hidden rounded-sm border border-cyber-border/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt="Post screenshot"
                className="w-full max-h-48 object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 ring-1 ring-white/[0.08] clip-diamond transition-all duration-200 group-hover:ring-neon-blue/20">
                <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
                <AvatarFallback className="bg-cyber-surface text-slate-400 text-[9px] font-display font-bold">{post.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-300 truncate max-w-[140px] font-medium">{post.author.name}</span>
                <span className={cn("text-[9px] font-display font-black uppercase tracking-widest", rankStyles[post.author.rank])}>{post.author.rank}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="sm:hidden flex items-center gap-1 text-[10px] text-slate-400/70 font-mono"><Swords size={11} className="opacity-60" />{score}</span>
              <span className="flex items-center gap-1 text-[10px] text-slate-400/60 font-mono transition-colors duration-200 group-hover:text-slate-300/80"><MessageCircle size={11} className="opacity-60" />{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
