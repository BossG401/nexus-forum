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
      <div className="mb-4 flex items-center gap-2">
        <MessageSquare size={20} className="text-primary" />
        <h2 className="text-xl font-semibold tracking-tight text-foreground">评论</h2>
        <span className="text-sm text-muted-foreground">({comments.length})</span>
      </div>

      <div className="mb-4 rounded-2xl border border-border bg-card p-3">
        {comments.length > 0 ? (
          <div className="divide-y divide-border">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            还没有评论，来抢沙发吧。
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <CommentInput postId={postId} />
      </div>
    </section>
  )
}
