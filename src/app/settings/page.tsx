import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, Terminal } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "./SettingsForm"

const REGIONS = ["KR", "NA", "EUW", "EUNE", "CN", "VN", "JP", "BR", "LAN", "LAS", "OCE", "RU", "TR", "SG", "PH", "TW"]
const RANKS = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"]

export default async function SettingsPage() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/api/auth/signin")
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } }); if (!dbUser) redirect("/api/auth/signin")
  return (
    <div className="max-w-2xl animate-slide-in-brutal">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] text-slate-400/60 hover:text-neon-blue transition-all duration-200 mb-8 font-display font-bold tracking-widest uppercase group">
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-200" />BACK TO FEED
      </Link>
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-7 bg-neon-purple shadow-[0_0_12px_rgba(168,85,247,0.4)]" />
        <h1 className="text-xl font-display font-black neon-text-purple tracking-[0.4em] uppercase">SETTINGS</h1>
      </div>
      <div className="glass-subtle clip-chamfer p-6 corner-marks">
        <div className="flex items-center gap-2 mb-5">
          <Terminal size={11} className="text-neon-purple/60" />
          <h2 className="text-[9px] font-display font-black text-neon-purple/55 tracking-[0.4em] uppercase">SUMMONER IDENTITY</h2>
        </div>
        <p className="text-[11px] text-slate-400/60 mb-7 leading-relaxed font-mono">Update your summoner profile. Changes propagate across all NEXUS systems immediately.</p>
        <SettingsForm defaultName={dbUser.name ?? ""} defaultServer={dbUser.server ?? ""} defaultRank={dbUser.lolRank ?? ""} regions={REGIONS} ranks={RANKS} />
      </div>
    </div>
  )
}
