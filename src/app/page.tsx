import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { authOptions } from "@/lib/auth"
import { InfiniteFeed } from "@/components/feed/InfiniteFeed"
import { PAGE_SIZE } from "@/lib/constants"
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

  // Fetch first page of posts from database, optionally filtered by category
  const dbPosts = await prisma.post.findMany({
    where: categoryTag ? { tag: categoryTag } : {},
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
  })

  const hasMore = dbPosts.length === PAGE_SIZE
  const nextCursor = hasMore ? dbPosts[dbPosts.length - 1].id : null

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

  const posts = dbPosts.map((p) =>
    mapPrismaPost({ ...p, userVote: voteMap.get(p.id) ?? null }),
  )

  return (
    <InfiniteFeed
      key={categoryId ?? "all"}
      initialPosts={posts}
      initialHasMore={hasMore}
      initialCursor={nextCursor}
      categoryId={categoryId}
    />
  )
}
