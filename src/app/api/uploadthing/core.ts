import { createUploadthing, type FileRouter } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  /**
   * Post screenshot upload — game screenshots, tier graphs, match results.
   * Image only, max 4 MB, single file.
   */
  postImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        throw new Error("UNAUTHORIZED: Sign in to upload images.")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Return the URL so the client can embed it in the post
      return { url: file.ufsUrl }
    }),

  /**
   * User avatar upload — profile picture update.
   * Image only, max 2 MB, single file.
   */
  userAvatar: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        throw new Error("UNAUTHORIZED: Sign in to update your avatar.")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
