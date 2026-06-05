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

const selectCls = "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground appearance-none cursor-pointer outline-none transition-colors focus:border-primary/45 focus:ring-3 focus:ring-primary/15"

export function SettingsForm({ defaultName, defaultServer, defaultRank, defaultImage, regions, ranks }: SettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(defaultName)
  const [server, setServer] = useState(defaultServer)
  const [lolRank, setLolRank] = useState(defaultRank)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(defaultImage)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dzKey, setDzKey] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!name.trim()) return; setSaving(true); setMsg(null)
    try { const fd = new FormData(); fd.append("name", name); fd.append("server", server); fd.append("lolRank", lolRank); if (avatarUrl) fd.append("image", avatarUrl); await updateProfile(fd); setMsg({ type: "success", text: "Profile saved successfully." }); router.refresh() }
    catch (err) { setMsg({ type: "error", text: err instanceof Error ? err.message : "Save failed." }) } finally { setSaving(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Avatar Upload ── */}
      <div>
        <label className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Upload size={14} className="text-muted-foreground" />Avatar
        </label>
        <div className="flex items-start gap-4">
          {/* Current / preview avatar */}
          <Avatar className="h-16 w-16 shrink-0 ring-1 ring-border">
            <AvatarImage src={avatarUrl ?? undefined} alt={name} />
            <AvatarFallback className="bg-secondary text-lg font-semibold text-secondary-foreground">
              {name ? name.slice(0, 2).toUpperCase() : "AG"}
            </AvatarFallback>
          </Avatar>

          {/* Upload dropzone (compact) */}
          <div className="min-w-0 flex-1">
            {avatarUrl && avatarUrl !== defaultImage ? (
              /* Preview mode — new image uploaded */
              <div className="flex items-center gap-2">
                <span className="flex-1 truncate text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  New avatar ready
                </span>
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(defaultImage); setDzKey(k => k + 1) }}
                  className="flex items-center gap-1 rounded-lg border border-destructive/30 px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <X size={12} />Reset
                </button>
              </div>
            ) : (
              <UploadDropzone
                key={dzKey}
                endpoint="userAvatar"
                appearance={{
                  container: cn(
                    "flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2",
                    "bg-background hover:border-primary/40 hover:bg-accent",
                    "transition-colors cursor-pointer",
                  ),
                  uploadIcon: "text-muted-foreground",
                  label: "text-sm font-medium text-foreground",
                  allowedContent: "hidden",
                  button: cn(
                    "rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground",
                    "hover:bg-primary/90 transition-colors",
                  ),
                }}
                content={{
                  label: ({ ready, isUploading }) => {
                    if (isUploading) return "Uploading…"
                    if (!ready) return "Loading…"
                    return "Drop or click to upload"
                  },
                  button: "Select",
                  uploadIcon: ({ isUploading }) => {
                    if (isUploading) return <Loader2 size={18} className="animate-spin text-primary" />
                    return <Upload size={18} />
                  },
                }}
                onBeforeUploadBegin={(files) => {
                  setUploadError(null)
                  return files
                }}
                onClientUploadComplete={(res) => {
                  const url = res?.[0]?.ufsUrl
                  if (url) setAvatarUrl(url)
                  else setUploadError("No URL returned")
                }}
                onUploadError={(err) => {
                  setUploadError(err.message || "Upload failed")
                }}
              />
            )}
            {uploadError && (
              <p className="mt-1 text-xs text-destructive">{uploadError}</p>
            )}
            <p className="mt-1.5 text-xs text-muted-foreground">
              PNG / JPG / WEBP — max 2 MB
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground"><User size={14} className="text-muted-foreground" />Summoner name</label>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Hide on bush" maxLength={50} required
          className="h-10 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground" />
      </div>
      <div>
        <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Globe size={14} className="text-muted-foreground" />Region / server</label>
        <div className="relative">
          <select value={server} onChange={(e) => setServer(e.target.value)} className={selectCls}>
            <option value="" className="bg-card text-muted-foreground">Select region</option>
            {regions.map((r) => <option key={r} value={r} className="bg-card text-foreground">{r}</option>)}
          </select>
          <Globe size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      <div>
        <label className="mb-2.5 flex items-center gap-2 text-sm font-medium text-muted-foreground"><Trophy size={14} className="text-muted-foreground" />Rank / tier</label>
        <div className="relative">
          <select value={lolRank} onChange={(e) => setLolRank(e.target.value)} className={selectCls}>
            <option value="" className="bg-card text-muted-foreground">Select rank</option>
            {ranks.map((r) => <option key={r} value={r} className="bg-card text-foreground">{r}</option>)}
          </select>
          <Trophy size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      {msg && (
        <div className={cn("flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium animate-fade-in",
          msg.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-destructive/30 bg-destructive/10 text-destructive")}>
          {msg.type === "success" ? <CheckCircle size={15} /> : <AlertTriangle size={15} />}{msg.text}
        </div>
      )}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-muted-foreground">Changes apply immediately</span>
        <Button type="submit" disabled={saving || !name.trim()}
          className="flex h-9 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent" />Saving…</> : <><Save size={15} strokeWidth={2.4} />Save</>}
        </Button>
      </div>
    </form>
  )
}
