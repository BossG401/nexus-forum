"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export type VoteResult = {
  upvotes: number
  downvotes: number
  userVote: "upvote" | "downvote" | null
}

export async function votePost(postId: string, type: "upvote" | "downvote"): Promise<VoteResult> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Authentication required to vote")
  }

  const userId = session.user.id

  // Check for existing vote by this user on this post
  const existing = await prisma.vote.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  })

  const post = await prisma.post.findUniqueOrThrow({
    where: { id: postId },
    select: { upvotes: true, downvotes: true },
  })

  let upvotes = post.upvotes
  let downvotes = post.downvotes
  let userVote: "upvote" | "downvote" | null = null

  if (existing) {
    if (existing.type === type) {
      // Toggle off — remove the vote
      await prisma.vote.delete({ where: { id: existing.id } })
      if (type === "upvote") upvotes--
      else downvotes--
      userVote = null
    } else {
      // Switch vote — update type and adjust both counts
      await prisma.vote.update({
        where: { id: existing.id },
        data: { type },
      })
      if (type === "upvote") {
        upvotes++
        downvotes--
      } else {
        downvotes++
        upvotes--
      }
      userVote = type
    }
  } else {
    // New vote
    await prisma.vote.create({
      data: { type, userId, postId },
    })
    if (type === "upvote") upvotes++
    else downvotes++
    userVote = type
  }

  // Update post counts
  await prisma.post.update({
    where: { id: postId },
    data: { upvotes, downvotes },
  })

  revalidatePath("/")
  revalidatePath(`/post/${postId}`)

  return { upvotes, downvotes, userVote }
}
