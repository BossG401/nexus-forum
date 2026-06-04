import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Swords, Shield, Hash, Trophy } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GlassCard } from "@/components/common/GlassCard"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { PostCard } from "@/components/feed/PostCard"
import { cn } from "@/lib/utils"

const rankStyles: Record<string, string> = {
  Challenger: "text-neon-gold-hot neon-text-gold font-black", Grandmaster: "text-neon-crimson neon-text-crimson font-bold",
  Master: "text-neon-purple-hot neon-text-purple font-bold", Diamond: "text-neon-blue-hot neon-text-blue font-bold",
  Platinum: "text-teal-300", Gold: "text-yellow-400",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/api/auth/signin")
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { posts: { include: { author: true }, orderBy: { createdAt: "desc" } } } })
  if (!dbUser) redirect("/api/auth/signin")
  const mappedPosts = dbUser.posts.map(mapPrismaPost)

  return (
    <div className="max-w-3xl animate-slide-in-brutal">
      <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] text-slate-400/60 hover:text-neon-blue transition-all duration-200 mb-8 font-display font-bold tracking-widest uppercase group">
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-200" />BACK TO FEED
      </Link>
      <GlassCard className="p-4 mb-5 clip-chamfer corner-marks">
        <div className="flex items-start gap-4">
          <Avatar className="h-18 w-18 ring-2 ring-neon-gold/35 clip-diamond shadow-[0_0_20px_rgba(212,168,67,0.15)]">
            <AvatarImage src={dbUser.image ?? "/avatars/default.png"} alt={dbUser.name ?? "Summoner"} />
            <AvatarFallback className="bg-neon-blue/10 text-neon-blue text-xl font-display font-black">{(dbUser.name ?? "S").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-display font-black text-slate-100 tracking-[0.2em] uppercase leading-tight">{dbUser.name ?? "UNKNOWN"}</h1>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              {dbUser.lolRank && <span className={cn("text-xs font-display font-black uppercase tracking-widest", rankStyles[dbUser.lolRank] ?? "text-slate-400")}>{dbUser.lolRank}</span>}
              {dbUser.lp !== null && dbUser.lp !== undefined && <span className="text-[10px] text-slate-300/70 font-mono tracking-wider">{dbUser.lp} LP</span>}
              {dbUser.server && <Badge variant="outline" className="text-[8px] border-white/[0.08] text-slate-300/60 clip-tag font-display font-bold tracking-widest">{dbUser.server}</Badge>}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-400/60 font-mono">
              <span className="flex items-center gap-1"><Hash size={10} className="opacity-60" />{mappedPosts.length} DISPATCHES</span>
              <span className="flex items-center gap-1"><Shield size={10} className="opacity-60" />ID: {dbUser.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </GlassCard>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-6 bg-neon-blue shadow-[0_0_12px_rgba(0,212,255,0.4)]" />
          <h2 className="text-base font-display font-black neon-text-blue tracking-[0.4em] uppercase">MY DISPATCHES</h2>
          <span className="text-[9px] text-slate-400/55 font-mono tracking-wider">({mappedPosts.length})</span>
        </div>
        <div className="mt-2 h-[1px] bg-gradient-to-r from-neon-blue/25 to-transparent w-32 ml-4" />
      </div>
      {mappedPosts.length > 0 ? (
        <div className="space-y-1 stagger-children">{mappedPosts.map((post, i) => <div key={post.id} style={{ "--stagger": i } as React.CSSProperties}><PostCard post={post} /></div>)}</div>
      ) : (
        <GlassCard className="p-10 text-center clip-chamfer corner-marks animate-fade-in">
          <p className="text-slate-400/55 font-display font-black tracking-[0.5em] uppercase text-xs">// NO DISPATCHES</p>
          <p className="text-slate-400/50 text-[10px] mt-2 font-mono">Your tactical analyses will appear here.</p>
          <Link href="/submit" className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 clip-tag bg-neon-blue/[0.06] border border-neon-blue/25 text-neon-blue text-[10px] font-display font-black uppercase tracking-widest hover:bg-neon-blue/[0.12] hover:border-neon-blue/40 hover:glow-blue active:scale-95 transition-all duration-200"><Swords size={11} />DEPLOY FIRST DISPATCH</Link>
        </GlassCard>
      )}
    </div>
  )
}
