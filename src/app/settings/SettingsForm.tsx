"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Globe, Trophy, Save, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/actions/user"
import { cn } from "@/lib/utils"

interface SettingsFormProps { defaultName: string; defaultServer: string; defaultRank: string; regions: string[]; ranks: string[] }

const selectCls = "w-full input-tech focus:input-tech-focus clip-chamfer px-3.5 py-2.5 text-xs text-slate-200 font-mono uppercase tracking-wider appearance-none cursor-pointer bg-cyber-dark/80 transition-all duration-200"

export function SettingsForm({ defaultName, defaultServer, defaultRank, regions, ranks }: SettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(defaultName); const [server, setServer] = useState(defaultServer); const [lolRank, setLolRank] = useState(defaultRank)
  const [saving, setSaving] = useState(false); const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim()) return; setSaving(true); setMsg(null)
    try { const fd = new FormData(); fd.append("name", name); fd.append("server", server); fd.append("lolRank", lolRank); await updateProfile(fd); setMsg({ type: "success", text: "Profile synced successfully." }); router.refresh() }
    catch (err) { setMsg({ type: "error", text: err instanceof Error ? err.message : "Sync failed." }) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center gap-2 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-2.5"><User size={10} className="text-neon-blue/60" />SUMMONER NAME</label>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hide on bush" maxLength={50} required
          className="input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-400/50 h-10 clip-chamfer text-xs font-display uppercase tracking-wider" />
      </div>
      <div>
        <label className="flex items-center gap-2 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-2.5"><Globe size={10} className="text-neon-gold/60" />REGION / SERVER</label>
        <div className="relative">
          <select value={server} onChange={(e) => setServer(e.target.value)} className={selectCls}>
            <option value="" className="bg-cyber-dark text-slate-400">-- SELECT REGION --</option>
            {regions.map((r) => <option key={r} value={r} className="bg-cyber-dark text-slate-200">{r}</option>)}
          </select>
          <Globe size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400/50 pointer-events-none" />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-2.5"><Trophy size={10} className="text-neon-purple/60" />RANK / TIER</label>
        <div className="relative">
          <select value={lolRank} onChange={(e) => setLolRank(e.target.value)} className={selectCls}>
            <option value="" className="bg-cyber-dark text-slate-400">-- SELECT RANK --</option>
            {ranks.map((r) => <option key={r} value={r} className="bg-cyber-dark text-slate-200">{r}</option>)}
          </select>
          <Trophy size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400/50 pointer-events-none" />
        </div>
      </div>
      {msg && (
        <div className={cn("flex items-center gap-2.5 px-4 py-3 clip-chamfer border text-xs font-display font-bold tracking-wider animate-fade-in",
          msg.type === "success" ? "bg-neon-green/[0.05] border-neon-green/25 text-neon-green/85" : "bg-neon-crimson/[0.05] border-neon-crimson/25 text-neon-crimson/85")}>
          {msg.type === "success" ? <CheckCircle size={13} /> : <AlertTriangle size={13} />}{msg.text}
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <span className="text-[8px] text-slate-400/50 font-mono tracking-wider">CHANGES PROPAGATE IMMEDIATELY</span>
        <Button type="submit" disabled={saving || !name.trim()}
          className={cn("flex items-center gap-2 h-9 px-5 clip-tag bg-neon-purple text-white font-display font-black uppercase tracking-widest text-[10px]",
            "hover:bg-neon-purple-hot hover:glow-purple active:scale-95 active:skew-x-[-3deg] transition-all duration-200", "disabled:opacity-25 disabled:cursor-not-allowed")}>
          {saving ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />SAVING...</> : <><Save size={13} strokeWidth={2.5} />SAVE</>}
        </Button>
      </div>
    </form>
  )
}
