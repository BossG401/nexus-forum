"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Authentication required")
  }

  const name = (formData.get("name") as string)?.trim()
  const server = (formData.get("server") as string)?.trim()
  const lolRank = (formData.get("lolRank") as string)?.trim()

  if (!name) {
    throw new Error("Summoner Name is required")
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      server: server || null,
      lolRank: lolRank || null,
    },
  })

  revalidatePath("/settings")
  revalidatePath("/profile")
  revalidatePath("/")

  return { success: true }
}
