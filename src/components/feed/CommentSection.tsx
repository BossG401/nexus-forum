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
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={18} className="text-neon-blue" />
        <h2 className="text-lg font-bold font-display neon-text-blue tracking-[0.2em] uppercase">
          /// TACTICAL COMMS
        </h2>
        <span className="text-xs text-slate-600 font-display tracking-wider ml-1">
          ({comments.length})
        </span>
      </div>

      {/* Comment list */}
      <div className="glass-subtle rounded-lg p-4 mb-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))
        ) : (
          <p className="text-slate-500 text-sm text-center py-8 font-display tracking-wider uppercase">
            /// No tactical intel yet — be the first to engage
          </p>
        )}
      </div>

      {/* Terminal input */}
      <div className="glass-subtle rounded-lg p-4">
        <CommentInput postId={postId} />
      </div>
    </section>
  )
}
