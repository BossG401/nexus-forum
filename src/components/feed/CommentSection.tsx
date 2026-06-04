import { MessageSquare } from "lucide-react"
import type { Comment } from "@/lib/types"
import { CommentCard } from "./CommentCard"
import { CommentInput } from "./CommentInput"

interface CommentSectionProps { comments: Comment[]; postId: string }

export function CommentSection({ comments, postId }: CommentSectionProps) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
        <h2 className="text-base font-display font-black neon-text-blue tracking-[0.4em] uppercase">TACTICAL COMMS</h2>
        <span className="text-[9px] text-slate-400/60 font-mono tracking-wider">({comments.length})</span>
      </div>
      <div className="glass-subtle clip-chamfer p-2.5 mb-2.5">
        {comments.length > 0 ? (
          <div className="stagger-children">
            {comments.map((c, i) => <div key={c.id} style={{ "--stagger": i } as React.CSSProperties}><CommentCard comment={c} /></div>)}
          </div>
        ) : (
          <p className="text-slate-400/50 text-xs text-center py-10 font-display font-black tracking-[0.4em] uppercase">// NO INTEL — ENGAGE FIRST</p>
        )}
      </div>
      <div className="glass-subtle clip-chamfer p-3"><CommentInput postId={postId} /></div>
    </section>
  )
}
