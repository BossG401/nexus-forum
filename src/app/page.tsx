import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { authOptions } from "@/lib/auth"
import { Feed } from "@/components/feed/Feed"
import { mockCategories } from "@/data/mock-categories"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const categoryId = params.category

  // Resolve category ID to tag name for DB-level filtering
  const categoryTag = categoryId
    ? mockCategories.find((c) => c.id === categoryId)?.name ?? null
    : null

  // Fetch posts from database, optionally filtered by category
  const dbPosts = await prisma.post.findMany({
    where: categoryTag ? { tag: categoryTag } : {},
    include: { author: true },
    orderBy: { createdAt: "desc" },
  })

  // Fetch current user's votes for all displayed posts
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

  const allPosts = dbPosts.map((p) =>
    mapPrismaPost({ ...p, userVote: voteMap.get(p.id) ?? null }),
  )

  return <Feed posts={allPosts} activeCategory={categoryId} />
}
