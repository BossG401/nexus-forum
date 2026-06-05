import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "./SettingsForm"

const REGIONS = ["KR", "NA", "EUW", "EUNE", "CN", "VN", "JP", "BR", "LAN", "LAS", "OCE", "RU", "TR", "SG", "PH", "TW"]
const RANKS = ["Iron", "Bronze", "Silver", "Gold", "Platinum", "Emerald", "Diamond", "Master", "Grandmaster", "Challenger"]

export default async function SettingsPage() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/api/auth/signin")
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id } }); if (!dbUser) redirect("/api/auth/signin")
  return (
    <div className="max-w-2xl animate-fade-in-up">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to feed
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">Settings</h1>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <Shield size={18} className="text-primary" />
          <h2 className="text-base font-semibold text-foreground">Summoner identity</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Update your summoner profile. Changes apply across NEXUS immediately.
        </p>
        <SettingsForm defaultName={dbUser.name ?? ""} defaultServer={dbUser.server ?? ""} defaultRank={dbUser.lolRank ?? ""} defaultImage={dbUser.image ?? null} regions={REGIONS} ranks={RANKS} />
      </div>
    </div>
  )
}
