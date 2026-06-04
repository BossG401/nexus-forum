"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Globe, Trophy, Save, CheckCircle, AlertTriangle, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UploadDropzone } from "@/lib/uploadthing"
import { updateProfile } from "@/actions/user"
import { cn } from "@/lib/utils"

interface SettingsFormProps {
  defaultName: string
  defaultServer: string
  defaultRank: string
  defaultImage: string | null
  regions: string[]
  ranks: string[]
}

const selectCls = "w-full input-tech focus:input-tech-focus clip-chamfer px-3.5 py-2.5 text-xs text-slate-200 font-mono uppercase tracking-wider appearance-none cursor-pointer bg-cyber-dark/80 transition-all duration-200"

export function SettingsForm({ defaultName, defaultServer, defaultRank, defaultImage, regions, ranks }: SettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(defaultName)
  const [server, setServer] = useState(defaultServer)
  const [lolRank, setLolRank] = useState(defaultRank)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(defaultImage)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dzKey, setDzKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim()) return; setSaving(true); setMsg(null)
    try { const fd = new FormData(); fd.append("name", name); fd.append("server", server); fd.append("lolRank", lolRank); if (avatarUrl) fd.append("image", avatarUrl); await updateProfile(fd); setMsg({ type: "success", text: "Profile synced successfully." }); router.refresh() }
    catch (err) { setMsg({ type: "error", text: err instanceof Error ? err.message : "Sync failed." }) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Avatar Upload ── */}
      <div>
        <label className="flex items-center gap-2 text-[9px] text-slate-400/70 font-display font-bold tracking-widest uppercase mb-3">
          <Upload size={10} className="text-neon-gold/60" />AGENT AVATAR
        </label>
        <div className="flex items-start gap-4">
          {/* Current / preview avatar */}
          <Avatar className="h-16 w-16 ring-2 ring-neon-gold/30 shadow-[0_0_16px_rgba(212,168,67,0.15)] clip-chamfer shrink-0">
            <AvatarImage src={avatarUrl ?? undefined} alt={name} />
            <AvatarFallback className="bg-cyber-surface text-neon-gold text-lg font-display font-black">
              {name ? name.slice(0, 2).toUpperCase() : "AG"}
            </AvatarFallback>
          </Avatar>

          {/* Upload dropzone (compact) */}
          <div className="flex-1 min-w-0">
            {avatarUrl && avatarUrl !== defaultImage ? (
              /* Preview mode — new image uploaded */
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neon-green font-mono tracking-wider truncate flex-1">
                  NEW AVATAR READY
                </span>
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(defaultImage); setDzKey(k => k + 1) }}
                  className="flex items-center gap-1 px-2 py-1 text-[9px] text-neon-crimson/70 hover:text-neon-crimson font-mono tracking-wider border border-neon-crimson/20 hover:border-neon-crimson/40 transition-colors"
                >
                  <X size={10} />RESET
                </button>
              </div>
            ) : (
              <UploadDropzone
                key={dzKey}
                endpoint="userAvatar"
                className="ut-allowed-content:hidden [&_.ut-uploading-icon]:text-neon-gold [&_.ut-label]:text-neon-gold [&_.ut-label]:font-display [&_.ut-label]:tracking-widest"
                appearance={{
                  container: cn(
                    "flex items-center gap-2 py-2 px-3 border border-dashed border-cyber-border",
                    "bg-cyber-dark/40 hover:border-neon-gold/40 hover:bg-cyber-surface/60",
                    "transition-all duration-200 cursor-crosshair",
                  ),
                  uploadIcon: "text-neon-gold/50",
                  label: "text-[10px] font-display font-bold text-neon-gold tracking-widest uppercase",
                  allowedContent: "hidden",
                  button: cn(
                    "bg-neon-gold/10 border border-neon-gold/30",
                    "text-neon-gold font-display font-bold text-[9px] tracking-widest uppercase",
                    "px-3 py-1 hover:bg-neon-gold/20",
                    "transition-all duration-200",
                  ),
                }}
                content={{
                  label: ({ ready, isUploading }) => {
                    if (isUploading) return "UPLOADING..."
                    if (!ready) return "INITIALIZING..."
                    return "DROP OR CLICK"
                  },
                  button: "SELECT",
                  uploadIcon: ({ isUploading }) => {
                    if (isUploading) return <Loader2 size={18} className="animate-spin text-neon-gold" />
                    return <Upload size={18} />
                  },
                }}
                onBeforeUploadBegin={(files) => {
                  setUploading(true)
                  setUploadError(null)
                  return files
                }}
                onClientUploadComplete={(res) => {
                  setUploading(false)
                  const url = res?.[0]?.ufsUrl
                  if (url) setAvatarUrl(url)
                  else setUploadError("No URL returned")
                }}
                onUploadError={(err) => {
                  setUploading(false)
                  setUploadError(err.message || "Upload failed")
                }}
              />
            )}
            {uploadError && (
              <p className="text-[9px] text-neon-crimson/70 font-mono mt-1">{uploadError}</p>
            )}
            <p className="text-[8px] text-slate-400/40 font-mono mt-1.5 tracking-wider">
              PNG / JPG / WEBP — MAX 2 MB
            </p>
          </div>
        </div>
      </div>

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
