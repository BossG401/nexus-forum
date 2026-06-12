import NextAuth, { type NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
    // Dummy credentials provider for testing without OAuth
    CredentialsProvider({
      name: "体验登录",
      credentials: {
        username: { label: "召唤师名称", type: "text", placeholder: "Hide on bush" },
      },
      async authorize(credentials) {
        if (!credentials?.username) return null

        // Find or create a demo user — for testing / local dev only
        let user = await prisma.user.findFirst({
          where: { name: credentials.username },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: credentials.username,
              email: `${credentials.username.replace(/\s+/g, "_").toLowerCase()}@nexus.local`,
              image: "/avatars/faker.png",
              lolRank: "Challenger",
              lp: 1234,
              server: "IONIA",
            },
          })
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
