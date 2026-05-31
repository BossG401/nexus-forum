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

const rankColors: Record<string, string> = {
  Challenger: "text-neon-gold neon-text-gold",
  Grandmaster: "text-red-400",
  Master: "text-purple-400",
  Diamond: "text-neon-blue",
  Platinum: "text-teal-400",
  Gold: "text-yellow-500",
}

const tagAccentBorder: Record<string, string> = {
  "neon-blue": "border-neon-blue/40 text-neon-blue",
  "neon-gold": "border-neon-gold/40 text-neon-gold",
  "neon-purple": "border-neon-purple/40 text-neon-purple",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  // Fetch the full user record from Prisma for LoL stats
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
    <div className="max-w-3xl">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-neon-blue transition-colors mb-6 font-display tracking-wider uppercase group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Feed
      </Link>

      {/* Profile Header */}
      <GlassCard className="p-6 mb-8">
        <div className="flex items-start gap-5">
          <Avatar className="h-20 w-20 ring-2 ring-neon-gold/50">
            <AvatarImage src={dbUser.image ?? "/avatars/default.png"} alt={dbUser.name ?? "Summoner"} />
            <AvatarFallback className="bg-neon-blue/20 text-neon-blue text-2xl font-bold font-display">
              {(dbUser.name ?? "S").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-display text-slate-100 tracking-wide">
              {dbUser.name ?? "Unknown Summoner"}
            </h1>

            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {dbUser.lolRank && (
                <span className={cn("text-sm font-semibold font-display uppercase tracking-wider", rankColors[dbUser.lolRank] ?? "text-slate-400")}>{dbUser.lolRank}</span>
              )}
              {dbUser.lp && (
                <span className="text-xs text-slate-400 font-display tracking-wider">
                  {dbUser.lp} LP
                </span>
              )}
              {dbUser.server && (
                <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">
                  {dbUser.server}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Hash size={12} />
                {mappedPosts.length} dispatch{mappedPosts.length !== 1 ? "es" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Shield size={12} />
                ID: {dbUser.id.slice(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Posts */}
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={18} className="text-neon-blue" />
        <h2 className="text-lg font-bold font-display neon-text-blue tracking-[0.2em] uppercase">
          /// My Dispatches
        </h2>
        <span className="text-xs text-slate-600 font-display tracking-wider ml-1">
          ({mappedPosts.length})
        </span>
      </div>

      {mappedPosts.length > 0 ? (
        <div className="space-y-4">
          {mappedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center">
          <p className="text-slate-500 font-display tracking-wider uppercase text-sm">
            /// No Dispatches Yet
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Your tactical analyses will appear here.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-sm bg-neon-blue/10 border border-neon-blue/30 text-neon-blue text-xs font-display font-semibold uppercase tracking-wider hover:bg-neon-blue/20 transition-all"
          >
            <Swords size={12} />
            Draft First Dispatch
          </Link>
        </GlassCard>
      )}
    </div>
  )
}

function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(" ")
}
