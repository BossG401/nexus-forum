import { Flame } from "lucide-react"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { authOptions } from "@/lib/auth"
import { Feed } from "@/components/feed/Feed"

export default async function TrendingPage() {
  const dbPosts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { upvotes: "desc" },
    take: 20,
  })

  const session = await getServerSession(authOptions)
  const postIds = dbPosts.map((p) => p.id)
  const userVotes = session?.user?.id
    ? await prisma.vote.findMany({
        where: {
          userId: session.user.id,
          postId: { in: postIds },
        },
      })
    : []

  const voteMap = new Map(userVotes.map((v) => [v.postId, v.type as "upvote" | "downvote"]))

  const posts = dbPosts.map((p) =>
    mapPrismaPost({ ...p, userVote: voteMap.get(p.id) ?? null }),
  )

  return (
    <div className="max-w-3xl">
      <Feed posts={posts} />
      {posts.length === 0 && (
        <div className="mt-3 rounded-2xl border border-border bg-card p-10 text-center animate-fade-in">
          <Flame size={24} className="mx-auto mb-3 text-primary" />
          <p className="text-base font-semibold text-foreground">Nothing trending yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Popular discussions will surface here as the community votes.
          </p>
        </div>
      )}
    </div>
  )
}
