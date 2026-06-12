"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { mapPrismaPost } from "@/lib/mappers"
import { PAGE_SIZE } from "@/lib/constants"
import type { Post } from "@/lib/types"

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("请先登录后再发帖")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const fullContent = formData.get("fullContent") as string
  const tag = formData.get("tag") as string
  const tagAccent = (formData.get("tagAccent") as string) ?? "neon-blue"
  const imageUrl = (formData.get("imageUrl") as string) || null

  if (!title?.trim() || !content?.trim() || !tag?.trim()) {
    throw new Error("标题、内容和分类不能为空")
  }

  await prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      fullContent: fullContent?.trim() || null,
      imageUrl,
      tag: tag.trim(),
      tagAccent,
      authorId: session.user.id,
    },
  })

  revalidatePath("/")
  redirect("/")
}

export async function getMorePosts(
  cursor?: string,
  categoryTag?: string | null,
): Promise<{ posts: Post[]; nextCursor: string | null; hasMore: boolean }> {
  const session = await getServerSession(authOptions)

  const where = categoryTag ? { tag: categoryTag } : {}

  const dbPosts = await prisma.post.findMany({
    where,
    include: { author: true },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })

  const hasMore = dbPosts.length === PAGE_SIZE
  const nextCursor = hasMore ? dbPosts[dbPosts.length - 1].id : null

  // Fetch current user's votes for this batch
  const postIds = dbPosts.map((p) => p.id)
  const userVotes = session?.user?.id
    ? await prisma.vote.findMany({
        where: { userId: session.user.id, postId: { in: postIds } },
      })
    : []

  const voteMap = new Map(
    userVotes.map((v) => [v.postId, v.type as "upvote" | "downvote"]),
  )

  const posts = dbPosts.map((p) =>
    mapPrismaPost({ ...p, userVote: voteMap.get(p.id) ?? null }),
  )

  return { posts, nextCursor, hasMore }
}
