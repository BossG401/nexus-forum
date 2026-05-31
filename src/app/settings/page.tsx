import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, User, Globe, Trophy, Terminal } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "./SettingsForm"

const REGIONS = ["KR", "NA", "EUW", "EUNE", "CN", "VN", "JP", "BR", "LAN", "LAS", "OCE", "RU", "TR", "SG", "PH", "TW"]
const RANKS = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"]

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Fetch the user's current data from Prisma
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!dbUser) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="max-w-2xl">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-neon-blue transition-colors mb-6 font-display tracking-wider uppercase group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Feed
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield size={22} className="text-neon-purple" />
        <h1 className="text-2xl font-bold font-display neon-text-purple tracking-[0.2em] uppercase">
          /// Settings
        </h1>
      </div>

      {/* Profile identity card */}
      <div className="glass-subtle rounded-lg p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Terminal size={14} className="text-neon-purple" />
          <h2 className="text-sm font-display font-semibold text-slate-300 tracking-[0.2em] uppercase">
            Summoner Identity
          </h2>
        </div>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
          Update your summoner profile. Changes will be reflected immediately across NEXUS — your Navbar,
          Profile page, and tactical dispatches.
        </p>

        <SettingsForm
          defaultName={dbUser.name ?? ""}
          defaultServer={dbUser.server ?? ""}
          defaultRank={dbUser.lolRank ?? ""}
          regions={REGIONS}
          ranks={RANKS}
        />
      </div>
    </div>
  )
}
