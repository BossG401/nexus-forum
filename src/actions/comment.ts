"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createComment(postId: string, content: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Authentication required to comment")
  }

  if (!content?.trim()) {
    throw new Error("Comment cannot be empty")
  }

  await prisma.comment.create({
    data: {
      content: content.trim(),
      postId,
      authorId: session.user.id,
    },
  })

  // Increment comment count on the post
  await prisma.post.update({
    where: { id: postId },
    data: { commentCount: { increment: 1 } },
  })

  revalidatePath(`/post/${postId}`)
}
