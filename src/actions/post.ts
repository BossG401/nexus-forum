"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function createPost(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Authentication required to create a post")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const fullContent = formData.get("fullContent") as string
  const tag = formData.get("tag") as string
  const tagAccent = (formData.get("tagAccent") as string) ?? "neon-blue"

  if (!title?.trim() || !content?.trim() || !tag?.trim()) {
    throw new Error("Title, content, and tag are required")
  }

  await prisma.post.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      fullContent: fullContent?.trim() || null,
      tag: tag.trim(),
      tagAccent,
      authorId: session.user.id,
    },
  })

  revalidatePath("/")
  redirect("/")
}
