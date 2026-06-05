import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Swords, Shield, Hash } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { PostCard } from "@/components/feed/PostCard"
import { cn } from "@/lib/utils"

const rankStyles: Record<string, string> = {
  Challenger: "text-amber-600 dark:text-amber-300 font-bold",
  Grandmaster: "text-rose-600 dark:text-rose-300 font-semibold",
  Master: "text-violet-600 dark:text-violet-300 font-semibold",
  Diamond: "text-sky-600 dark:text-sky-300 font-semibold",
  Platinum: "text-teal-600 dark:text-teal-300",
  Gold: "text-yellow-600 dark:text-yellow-400",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions); if (!session?.user?.id) redirect("/api/auth/signin")
  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { posts: { include: { author: true }, orderBy: { createdAt: "desc" } } } })
  if (!dbUser) redirect("/api/auth/signin")
  const mappedPosts = dbUser.posts.map(mapPrismaPost)

  return (
    <div className="max-w-3xl animate-fade-in-up">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to feed
      </Link>

      <div className="mb-5 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <Avatar className="h-18 w-18 ring-1 ring-border">
            <AvatarImage src={dbUser.image ?? "/avatars/default.png"} alt={dbUser.name ?? "Summoner"} />
            <AvatarFallback className="bg-secondary text-xl font-semibold text-secondary-foreground">{(dbUser.name ?? "S").slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">{dbUser.name ?? "Unknown"}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2.5">
              {dbUser.lolRank && <span className={cn("text-sm", rankStyles[dbUser.lolRank] ?? "text-muted-foreground")}>{dbUser.lolRank}</span>}
              {dbUser.lp !== null && dbUser.lp !== undefined && <span className="text-xs text-muted-foreground">{dbUser.lp} LP</span>}
              {dbUser.server && <Badge variant="outline" className="rounded-full border-border text-xs text-muted-foreground">{dbUser.server}</Badge>}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Hash size={13} />{mappedPosts.length} posts</span>
              <span className="flex items-center gap-1"><Shield size={13} />ID: {dbUser.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">My Posts</h2>
        <span className="text-sm text-muted-foreground">({mappedPosts.length})</span>
      </div>

      {mappedPosts.length > 0 ? (
        <div className="space-y-3 stagger-children">{mappedPosts.map((post, i) => <div key={post.id} style={{ "--stagger": i } as React.CSSProperties}><PostCard post={post} /></div>)}</div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-10 text-center animate-fade-in">
          <p className="text-base font-semibold text-foreground">No posts yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Your posts will appear here.</p>
          <Link href="/submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"><Swords size={15} />Create your first post</Link>
        </div>
      )}
    </div>
  )
}
