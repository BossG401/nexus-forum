import { ScrollText } from "lucide-react"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { authOptions } from "@/lib/auth"
import { Feed } from "@/components/feed/Feed"

export default async function PatchesPage() {
  const dbPosts = await prisma.post.findMany({
    where: { tag: "#PatchNotes" },
    include: { author: true },
    orderBy: { createdAt: "desc" },
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
        <div className="glass-subtle clip-chamfer p-8 text-center mt-3 animate-fade-in corner-marks">
          <ScrollText size={24} className="text-neon-blue/50 mx-auto mb-2" />
          <p className="text-slate-400/60 font-display font-black tracking-[0.5em] uppercase text-xs">PATCH ARCHIVE</p>
          <p className="text-slate-400/50 text-[10px] mt-2 font-mono">Detailed patch breakdowns and meta analysis loading...</p>
        </div>
      )}
    </div>
  )
}
