"use client"

import { useOptimistic, useTransition } from "react"
import { useSession } from "next-auth/react"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { votePost } from "@/actions/vote"
import { cn } from "@/lib/utils"

interface VoteButtonsProps {
  postId: string
  upvotes: number
  downvotes: number
  userVote?: "upvote" | "downvote" | null
  size?: "sm" | "lg"
}

export function VoteButtons({
  postId,
  upvotes,
  downvotes,
  userVote,
  size = "sm",
}: VoteButtonsProps) {
  const { status } = useSession()
  const [isPending, startTransition] = useTransition()
  const [optimistic, addOptimistic] = useOptimistic<
    { upvotes: number; downvotes: number; userVote: "upvote" | "downvote" | null },
    { type: "upvote" | "downvote" }
  >({ upvotes, downvotes, userVote: userVote ?? null }, (state, action) => {
    const previous = state.userVote
    const next = action.type

    if (previous === next) {
      return {
        upvotes: next === "upvote" ? state.upvotes - 1 : state.upvotes,
        downvotes: next === "downvote" ? state.downvotes - 1 : state.downvotes,
        userVote: null,
      }
    }

    if (previous === null) {
      return {
        upvotes: next === "upvote" ? state.upvotes + 1 : state.upvotes,
        downvotes: next === "downvote" ? state.downvotes + 1 : state.downvotes,
        userVote: next,
      }
    }

    return {
      upvotes: next === "upvote" ? state.upvotes + 1 : state.upvotes - 1,
      downvotes: next === "downvote" ? state.downvotes + 1 : state.downvotes - 1,
      userVote: next,
    }
  })

  const score = optimistic.upvotes - optimistic.downvotes
  const iconSize = size === "lg" ? 24 : 21
  const scoreSize = size === "lg" ? "text-base" : "text-sm"
  const padding = size === "lg" ? "w-20 py-5" : "w-16 py-4"

  const handleVote = (type: "upvote" | "downvote") => {
    if (status !== "authenticated" || isPending) return
    startTransition(() => {
      addOptimistic({ type })
      votePost(postId, type).catch(() => {})
    })
  }

  return (
    <div className={cn("flex shrink-0 flex-col items-center gap-1 border-r border-border bg-muted/50", padding)}>
      <button
        onClick={() => handleVote("upvote")}
        disabled={isPending}
        className={cn(
          "rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary active:scale-95",
          optimistic.userVote === "upvote" && "bg-primary/15 text-primary",
          status !== "authenticated" && "cursor-not-allowed opacity-45",
        )}
        title={status !== "authenticated" ? "Sign in to vote" : "Upvote"}
      >
        <ArrowBigUp size={iconSize} strokeWidth={1.8} />
      </button>

      <span
        className={cn(
          "select-none font-semibold tabular-nums",
          scoreSize,
          score > 0 ? "text-primary" : score < 0 ? "text-rose-600 dark:text-rose-300" : "text-muted-foreground",
        )}
      >
        {score > 0 ? `+${score}` : score}
      </span>

      <button
        onClick={() => handleVote("downvote")}
        disabled={isPending}
        className={cn(
          "rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95",
          optimistic.userVote === "downvote" && "bg-accent text-foreground",
          status !== "authenticated" && "cursor-not-allowed opacity-45",
        )}
        title={status !== "authenticated" ? "Sign in to vote" : "Downvote"}
      >
        <ArrowBigDown size={iconSize} strokeWidth={1.8} />
      </button>
    </div>
  )
}
