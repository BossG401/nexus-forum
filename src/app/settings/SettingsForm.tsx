"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Globe, Trophy, Save, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/actions/user"
import { cn } from "@/lib/utils"

interface SettingsFormProps {
  defaultName: string
  defaultServer: string
  defaultRank: string
  regions: string[]
  ranks: string[]
}

const selectClasses =
  "w-full input-tech focus:input-tech-focus rounded-lg px-3.5 py-2.5 text-sm text-slate-200 font-mono appearance-none cursor-pointer bg-cyber-dark/80 transition-all duration-200"

export function SettingsForm({ defaultName, defaultServer, defaultRank, regions, ranks }: SettingsFormProps) {
  const router = useRouter()
  const [name, setName] = useState(defaultName)
  const [server, setServer] = useState(defaultServer)
  const [lolRank, setLolRank] = useState(defaultRank)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setSaving(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("server", server)
      formData.append("lolRank", lolRank)

      await updateProfile(formData)
      setMessage({ type: "success", text: "Summoner profile updated successfully." })
      router.refresh()
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Summoner Name */}
      <div>
        <label className="flex items-center gap-2 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
          <User size={11} className="text-neon-blue/70" />
          Summoner Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hide on bush"
          maxLength={50}
          required
          className="input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600/50 h-10 rounded-lg text-sm"
        />
      </div>

      {/* Region Select */}
      <div>
        <label className="flex items-center gap-2 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
          <Globe size={11} className="text-neon-gold/70" />
          Region / Server
        </label>
        <div className="relative">
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            className={selectClasses}
          >
            <option value="" className="bg-cyber-dark text-slate-500">
              -- Select Region --
            </option>
            {regions.map((r) => (
              <option key={r} value={r} className="bg-cyber-dark text-slate-200">
                {r}
              </option>
            ))}
          </select>
          <Globe
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500/60 pointer-events-none"
          />
        </div>
      </div>

      {/* Rank Select */}
      <div>
        <label className="flex items-center gap-2 text-[11px] text-slate-400/70 font-display tracking-wider uppercase mb-2.5">
          <Trophy size={11} className="text-neon-purple/70" />
          Rank / Tier
        </label>
        <div className="relative">
          <select
            value={lolRank}
            onChange={(e) => setLolRank(e.target.value)}
            className={selectClasses}
          >
            <option value="" className="bg-cyber-dark text-slate-500">
              -- Select Rank --
            </option>
            {ranks.map((r) => (
              <option key={r} value={r} className="bg-cyber-dark text-slate-200">
                {r}
              </option>
            ))}
          </select>
          <Trophy
            size={14}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500/60 pointer-events-none"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={cn(
            "flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-display tracking-wider animate-fade-in",
            message.type === "success"
              ? "bg-green-400/[0.06] border-green-400/25 text-green-400/90"
              : "bg-red-400/[0.06] border-red-400/25 text-red-400/90"
          )}
        >
          {message.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
          {message.text}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
        <span className="text-[10px] text-slate-600/40 font-display tracking-wider">
          Changes take effect immediately
        </span>
        <Button
          type="submit"
          disabled={saving || !name.trim()}
          className={cn(
            "flex items-center gap-2 h-10 px-5 rounded-lg",
            "bg-neon-purple text-white",
            "hover:bg-neon-purple/90 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
            "active:scale-[0.97]",
            "transition-all duration-200",
            "font-semibold font-display uppercase tracking-wider text-xs",
            "disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
          )}
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save size={14} strokeWidth={2.5} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
