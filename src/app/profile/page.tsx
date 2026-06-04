import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, Swords, Shield, Clock, Hash, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GlassCard } from "@/components/common/GlassCard"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { PostCard } from "@/components/feed/PostCard"
import { cn } from "@/lib/utils"

const rankColors: Record<string, string> = {
  Challenger: "text-neon-gold neon-text-gold",
  Grandmaster: "text-red-400",
  Master: "text-purple-400",
  Diamond: "text-neon-blue",
  Platinum: "text-teal-400",
  Gold: "text-yellow-500",
}

const tagAccentBorder: Record<string, string> = {
  "neon-blue": "border-neon-blue/30 text-neon-blue",
  "neon-gold": "border-neon-gold/30 text-neon-gold",
  "neon-purple": "border-neon-purple/30 text-neon-purple",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!dbUser) {
    redirect("/api/auth/signin")
  }

  const mappedPosts = dbUser.posts.map(mapPrismaPost)

  return (
    <div className="max-w-3xl animate-fade-in-up">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500/70 hover:text-neon-blue transition-all duration-200 mb-8 font-display tracking-wider uppercase group"
      >
        <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to Feed
      </Link>

      {/* Profile Header */}
      <GlassCard className="p-7 mb-10 rounded-lg">
        <div className="flex items-start gap-6">
          <Avatar className="h-20 w-20 ring-2 ring-neon-gold/30 shadow-[0_0_16px_rgba(200,169,81,0.12)]">
            <AvatarImage src={dbUser.image ?? "/avatars/default.png"} alt={dbUser.name ?? "Summoner"} />
            <AvatarFallback className="bg-neon-blue/15 text-neon-blue text-2xl font-bold font-display">
              {(dbUser.name ?? "S").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold font-display text-slate-100 tracking-wide leading-tight">
              {dbUser.name ?? "Unknown Summoner"}
            </h1>

            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {dbUser.lolRank && (
                <span className={cn(
                  "text-sm font-display font-bold uppercase tracking-wider",
                  rankColors[dbUser.lolRank] ?? "text-slate-400"
                )}>
                  {dbUser.lolRank}
                </span>
              )}
              {dbUser.lp !== null && dbUser.lp !== undefined && (
                <span className="text-xs text-slate-400/70 font-display tracking-wider">
                  {dbUser.lp} LP
                </span>
              )}
              {dbUser.server && (
                <Badge variant="outline" className="text-[10px] border-white/[0.08] text-slate-400/70 rounded-sm">
                  {dbUser.server}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-5 mt-4 text-xs text-slate-500/60">
              <span className="flex items-center gap-1.5">
                <Hash size={11} className="opacity-60" />
                {mappedPosts.length} dispatch{mappedPosts.length !== 1 ? "es" : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={11} className="opacity-60" />
                ID: {dbUser.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Posts Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <Trophy size={16} className="text-neon-blue/80" />
          <h2 className="text-lg font-bold font-display neon-text-blue tracking-[0.25em] uppercase">
            /// My Dispatches
          </h2>
          <span className="text-xs text-slate-600/40 font-display tracking-wider ml-1">
            ({mappedPosts.length})
          </span>
        </div>
        <div className="mt-2 h-px bg-gradient-to-r from-neon-blue/15 via-neon-blue/5 to-transparent w-28" />
      </div>

      {mappedPosts.length > 0 ? (
        <div className="space-y-3 stagger-children">
          {mappedPosts.map((post, index) => (
            <div key={post.id} style={{ "--stagger": index } as React.CSSProperties}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <GlassCard className="p-14 text-center rounded-lg animate-fade-in">
          <p className="text-slate-500/60 font-display tracking-[0.25em] uppercase text-sm">
            /// No Dispatches Yet
          </p>
          <p className="text-slate-600/40 text-xs mt-2">
            Your tactical analyses will appear here.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-lg bg-neon-blue/[0.06] border border-neon-blue/25 text-neon-blue text-xs font-display font-semibold uppercase tracking-wider hover:bg-neon-blue/[0.12] hover:border-neon-blue/40 hover:shadow-[0_0_16px_rgba(0,212,255,0.08)] active:scale-[0.97] transition-all duration-200"
          >
            <Swords size={12} />
            Draft First Dispatch
          </Link>
        </GlassCard>
      )}
    </div>
  )
}
