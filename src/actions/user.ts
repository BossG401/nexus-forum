"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("请先登录")
  }

  const name = (formData.get("name") as string)?.trim()
  const server = (formData.get("server") as string)?.trim()
  const lolRank = (formData.get("lolRank") as string)?.trim()
  const image = (formData.get("image") as string)?.trim() || null

  if (!name) {
    throw new Error("召唤师名称不能为空")
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      server: server || null,
      lolRank: lolRank || null,
      image,
    },
  })

  revalidatePath("/settings")
  revalidatePath("/profile")
  revalidatePath("/")

  return { success: true }
}
