"use client"

import { useRef, useState } from "react"
import { LogIn, SendHorizontal } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { createComment } from "@/actions/comment"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUserStats } from "@/data/mock-user-stats"
import { cn } from "@/lib/utils"

interface CommentInputProps {
  postId: string
}

export function CommentInput({ postId }: CommentInputProps) {
  const { data: session, status } = useSession()
  const [value, setValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!value.trim() || submitting) return
    setSubmitting(true)

    try {
      await createComment(postId, value.trim())
      setValue("")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setSubmitting(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit()
    }
  }

  if (status === "loading") {
    return (
      <div className="flex gap-3 animate-pulse">
        <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
        </div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex gap-3">
        <Avatar className="mt-1 h-8 w-8 shrink-0 opacity-60 ring-1 ring-border">
          <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">?</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="rounded-xl border border-border bg-muted px-4 py-5 text-center text-sm text-muted-foreground">
            <LogIn size={16} className="mr-1.5 inline-block" />
            Sign in to comment.
          </div>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => signIn()}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <LogIn size={15} />
              Sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <Avatar className="mt-1 h-8 w-8 shrink-0 ring-1 ring-border">
        <AvatarImage src={session.user.image ?? mockUserStats.avatarUrl} alt={session.user.name ?? ""} />
        <AvatarFallback className="bg-secondary text-xs font-semibold text-secondary-foreground">
          {(session.user.name ?? "S").charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Write a comment..."
          rows={4}
          disabled={submitting}
          className={cn(
            "w-full resize-none rounded-xl border bg-background px-4 py-3 text-sm leading-6 text-foreground outline-none transition-all placeholder:text-muted-foreground disabled:opacity-50",
            focused ? "border-primary/45 ring-3 ring-primary/15" : "border-border",
          )}
        />

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Ctrl + Enter to post</span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || submitting}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/70 border-t-transparent" />
            ) : (
              <SendHorizontal size={15} />
            )}
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
