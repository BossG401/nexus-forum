import { MessageSquare } from "lucide-react"
import type { Comment } from "@/lib/types"
import { CommentCard } from "./CommentCard"
import { CommentInput } from "./CommentInput"

interface CommentSectionProps {
  comments: Comment[]
  postId: string
}

export function CommentSection({ comments, postId }: CommentSectionProps) {
  return (
    <section className="mt-10">
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-6">
        <MessageSquare size={16} className="text-neon-blue/80" />
        <h2 className="text-lg font-bold font-display neon-text-blue tracking-[0.25em] uppercase">
          /// Tactical Comms
        </h2>
        <span className="text-xs text-slate-600/40 font-display tracking-wider ml-1">
          ({comments.length})
        </span>
      </div>

      {/* Comment list */}
      <div className="glass-subtle rounded-lg p-5 mb-6">
        {comments.length > 0 ? (
          <div className="stagger-children">
            {comments.map((comment, index) => (
              <div key={comment.id} style={{ "--stagger": index } as React.CSSProperties}>
                <CommentCard comment={comment} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500/50 text-sm text-center py-10 font-display tracking-[0.2em] uppercase">
            /// No tactical intel yet — be the first to engage
          </p>
        )}
      </div>

      {/* Terminal input */}
      <div className="glass-subtle rounded-lg p-5">
        <CommentInput postId={postId} />
      </div>
    </section>
  )
}
