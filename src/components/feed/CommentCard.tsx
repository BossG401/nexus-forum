import { ArrowBigUp, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment } from "@/lib/types"
import { cn } from "@/lib/utils"

const rankStyles: Record<string, string> = {
  Challenger: "text-amber-600 dark:text-amber-300",
  Grandmaster: "text-rose-600 dark:text-rose-300",
  Master: "text-violet-600 dark:text-violet-300",
  Diamond: "text-sky-600 dark:text-sky-300",
  Platinum: "text-teal-600 dark:text-teal-300",
  Gold: "text-yellow-600 dark:text-yellow-300",
}

interface CommentCardProps {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  return (
    <div className="flex gap-3 py-4 first:pt-1 last:pb-1">
      <Avatar className="mt-0.5 h-8 w-8 shrink-0 ring-1 ring-border">
        <AvatarImage src={comment.author.avatarUrl} alt={comment.author.name} />
        <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
          {comment.author.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{comment.author.name}</span>
          <span className={cn("text-xs font-medium", rankStyles[comment.author.rank])}>
            {comment.author.rank}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={12} />
            {comment.createdAt}
          </span>
        </div>

        <p className="whitespace-pre-line text-sm leading-6 text-foreground/80">{comment.content}</p>

        <button className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary">
          <ArrowBigUp size={15} strokeWidth={1.7} />
          {comment.upvotes}
        </button>
      </div>
    </div>
  )
}
