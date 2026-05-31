"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Globe, Trophy, Save, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateProfile } from "@/actions/user"

interface SettingsFormProps {
  defaultName: string
  defaultServer: string
  defaultRank: string
  regions: string[]
  ranks: string[]
}

const selectClasses =
  "w-full input-tech focus:input-tech-focus rounded-sm px-3 py-2 text-sm text-slate-200 font-mono appearance-none cursor-pointer bg-cyber-dark/80"

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Summoner Name */}
      <div>
        <label className="flex items-center gap-2 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
          <User size={12} className="text-neon-blue" />
          Summoner Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hide on bush"
          maxLength={50}
          required
          className="input-tech focus:input-tech-focus text-slate-200 placeholder:text-slate-600"
        />
      </div>

      {/* Region Select */}
      <div>
        <label className="flex items-center gap-2 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
          <Globe size={12} className="text-neon-gold" />
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
          {/* Custom dropdown chevron */}
          <Globe
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Rank Select */}
      <div>
        <label className="flex items-center gap-2 text-xs text-slate-400 font-display tracking-wider uppercase mb-2">
          <Trophy size={12} className="text-neon-purple" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-sm border text-sm font-display tracking-wider ${
            message.type === "success"
              ? "bg-green-400/10 border-green-400/30 text-green-400"
              : "bg-red-400/10 border-red-400/30 text-red-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
          {message.text}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center justify-between pt-2 border-t border-cyber-border/50">
        <span className="text-[10px] text-slate-600 font-display tracking-wider">
          Changes take effect immediately
        </span>
        <Button
          type="submit"
          disabled={saving || !name.trim()}
          className="flex items-center gap-2 bg-neon-purple text-white hover:bg-neon-purple/90 hover:glow-purple transition-all font-semibold font-display uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
