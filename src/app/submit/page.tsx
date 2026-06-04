"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Terminal, Hash, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createPost } from "@/actions/post"
import { cn } from "@/lib/utils"

const TAG_OPTIONS = [
  { name: "#PatchNotes", accent: "neon-blue" }, { name: "#Esports", accent: "neon-gold" },
  { name: "#LookingForGroup", accent: "neon-purple" }, { name: "#Gameplay", accent: "neon-blue" },
  { name: "#Memes", accent: "neon-purple" }, { name: "#Champions", accent: "neon-gold" }, { name: "#Strategy", accent: "neon-blue" },
] as const
const accentMap: Record<string, string> = {
  "neon-blue": "border-neon-blue/35 bg-neon-blue/[0.08] text-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.1)]",
  "neon-gold": "border-neon-gold/35 bg-neon-gold/[0.08] text-neon-gold shadow-[0_0_12px_rgba(212,168,67,0.1)]",
  "neon-purple": "border-neon-purple/35 bg-neon-purple/[0.08] text-neon-purple shadow-[0_0_12px_rgba(168,85,247,0.1)]",
}

export default function SubmitPage() {
  const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [fullContent, setFullContent] = useState("")
  const [tag, setTag] = useState("#Gameplay"); const [tagAccent, setTagAccent] = useState("neon-blue")
  const [submitting, setSubmitting] = useState(false); const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!title.trim() || !content.trim()) return; setSubmitting(true); setError(null)
    try { const fd = new FormData(); fd.append("title", title); fd.append("content", content); fd.append("fullContent", fullContent); fd.append("tag", tag); fd.append("tagAccent", tagAccent); await createPost(fd) }
    catch (err) { setError(err instanceof Error ? err.message : "Failed to create post"); setSubmitting(false) }
  }

  return (
    <div className="max-w-3xl animate-slide-in-brutal">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] text-slate-400/60 hover:text-neon-blue transition-all duration-200 mb-4 font-display font-bold tracking-widest uppercase group">
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-200" />BACK TO FEED
      </Link>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
        <h1 className="text-xl font-display font-black neon-text-blue tracking-[0.4em] uppercase">DEPLOY DISPATCH</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="flex items-center gap-1.5 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-1.5"><Hash size={10} className="opacity-60" />TITLE</label>
          <Input type="text" placeholder="ENTER TACTICAL TITLE..." value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required
            className="input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-400/50 h-10 clip-chamfer text-xs font-display uppercase tracking-wider" />
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-1.5"><Palette size={10} className="opacity-60" />SECTOR</label>
          <div className="flex flex-wrap gap-1.5">
            {TAG_OPTIONS.map((t) => (
              <button key={t.name} type="button" onClick={() => { setTag(t.name); setTagAccent(t.accent) }}
                className={cn("px-3 py-1.5 clip-tag text-[10px] font-display font-black uppercase tracking-widest border transition-all duration-200 active:scale-95 active:skew-x-[-2deg]",
                  tag === t.name ? accentMap[t.accent] : "border-white/[0.06] text-slate-400/60 hover:border-white/[0.12] hover:text-slate-300 hover:bg-white/[0.02]")}>{t.name}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-1.5"><Terminal size={10} className="opacity-60" />SUMMARY <span className="text-slate-400/50 normal-case tracking-normal font-mono text-[8px]">(shown in feed)</span></label>
          <textarea placeholder=">_ Write a short preview..." value={content} onChange={(e) => setContent(e.target.value)} rows={3} maxLength={500} required
            className="w-full input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-400/50 resize-none font-mono text-xs clip-chamfer px-3 py-2.5 leading-relaxed" />
          <p className="text-[8px] text-slate-400/55 text-right mt-1 font-mono tracking-wider">{content.length}/500</p>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-1.5"><Terminal size={10} className="opacity-60" />FULL ANALYSIS <span className="text-slate-400/50 normal-case tracking-normal font-mono text-[8px]">(markdown, optional)</span></label>
          <textarea placeholder="# Header\n\n## Sub-section\n\n- Bullet\n\n**Bold** text" value={fullContent} onChange={(e) => setFullContent(e.target.value)} rows={12}
            className="w-full input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-400/50 resize-y font-mono text-xs clip-chamfer px-3 py-2.5 leading-relaxed" />
        </div>
        {error && <div className="bg-neon-crimson/[0.06] border border-neon-crimson/25 clip-chamfer px-3 py-2.5 text-xs text-neon-crimson/80 font-display font-bold tracking-wider animate-fade-in">// {error}</div>}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.04]">
          <span className="text-[8px] text-slate-400/50 font-mono tracking-wider">DEPLOY IMMEDIATELY</span>
          <Button type="submit" disabled={submitting || !title.trim() || !content.trim()}
            className={cn("flex items-center gap-2 h-9 px-5 clip-tag bg-neon-blue text-cyber-dark font-display font-black uppercase tracking-widest text-[10px]",
              "hover:bg-neon-blue-hot hover:glow-blue-intense active:scale-95 active:skew-x-[-3deg] transition-all duration-200",
              "disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100 disabled:active:skew-x-0")}>
            {submitting ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyber-dark/60 border-t-transparent" />DEPLOYING...</> : <><Send size={13} strokeWidth={2.5} />DEPLOY</>}
          </Button>
        </div>
      </form>
    </div>
  )
}

