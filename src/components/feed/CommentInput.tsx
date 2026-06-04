"use client"

import { useState, useRef } from "react"
import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SendHorizontal, Terminal, LogIn } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createComment } from "@/actions/comment"
import { mockUserStats } from "@/data/mock-user-stats"
import { cn } from "@/lib/utils"

interface CommentInputProps { postId: string }

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
    try { await createComment(postId, value.trim()); setValue(""); router.refresh() }
    catch (err) { console.error(err) }
    finally { setSubmitting(false); inputRef.current?.focus() }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleSubmit() }
  }

  if (status === "loading") {
    return (
      <div className="flex gap-3 animate-pulse">
        <div className="h-7 w-7 bg-white/[0.05] clip-diamond shrink-0 mt-1" />
        <div className="flex-1 space-y-2"><div className="h-2 bg-white/[0.05] w-20" /><div className="h-16 bg-white/[0.05] clip-chamfer" /></div>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex gap-3">
        <Avatar className="h-7 w-7 ring-1 ring-white/[0.06] clip-diamond shrink-0 mt-1 opacity-50">
          <AvatarFallback className="bg-cyber-surface text-slate-500 text-[8px] font-display font-bold">?</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <Terminal size={10} className="text-slate-400/50" />
            <span className="text-[8px] text-slate-400/50 font-display font-bold tracking-widest uppercase">TACTICAL INPUT</span>
          </div>
          <div className="w-full bg-cyber-darker/30 border border-white/[0.06] clip-chamfer px-3 py-5 text-[10px] text-slate-400/50 font-mono text-center select-none">
            <LogIn size={13} className="inline-block mr-1.5" />AUTHENTICATE TO ENGAGE
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-[8px] text-slate-400/50 font-mono tracking-wider">AUTH REQUIRED</span>
            <button onClick={() => signIn()} className="flex items-center gap-1.5 px-3 py-1.5 clip-tag bg-neon-blue/[0.06] border border-neon-blue/20 text-neon-blue text-[9px] font-display font-black uppercase tracking-widest hover:bg-neon-blue/[0.12] hover:border-neon-blue/35 hover:glow-blue active:scale-95 transition-all duration-200">
              <LogIn size={10} />CONNECT
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7 ring-1 ring-neon-gold/20 clip-diamond shrink-0 mt-1">
        <AvatarImage src={session.user.image ?? mockUserStats.avatarUrl} alt={session.user.name ?? ""} />
        <AvatarFallback className="bg-neon-gold/10 text-neon-gold text-[8px] font-display font-bold">{(session.user.name ?? "S").charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <Terminal size={10} className={cn("transition-colors duration-200", focused ? "text-neon-blue/60" : "text-slate-400/50")} />
          <span className={cn("text-[8px] font-display font-bold tracking-widest uppercase transition-colors duration-200", focused ? "text-slate-300/60" : "text-slate-400/45")}>TACTICAL INPUT</span>
        </div>
        <textarea ref={inputRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder=">_ Draft tactical analysis..." rows={3} disabled={submitting}
          className={cn("w-full bg-cyber-darker/60 border clip-chamfer px-3 py-2.5 text-xs text-slate-200 placeholder:text-slate-400/50 resize-none font-mono transition-all duration-200 focus:outline-none",
            focused ? "border-neon-blue/30 shadow-[0_0_16px_rgba(0,212,255,0.06)]" : "border-white/[0.06]", "disabled:opacity-40")} />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[7px] text-slate-400/45 font-mono tracking-wider">CTRL+ENTER TO DEPLOY</span>
          <button onClick={handleSubmit} disabled={!value.trim() || submitting}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 clip-tag text-[9px] font-display font-black uppercase tracking-widest",
              "bg-neon-blue/[0.06] border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/[0.12] hover:border-neon-blue/35 hover:glow-blue active:scale-95 active:skew-x-[-2deg] transition-all duration-200",
              "disabled:opacity-30 disabled:cursor-not-allowed")}>
            {submitting ? <><span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-neon-blue/60 border-t-transparent" />DEPLOYING</>
              : <><SendHorizontal size={10} />DEPLOY</>}
          </button>
        </div>
      </div>
    </div>
  )
}
