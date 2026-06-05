import { PrismaClient } from "@/generated/prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

// Vercel Postgres 连接字符串拼接 sslmode（避免 pg driver 的安全警告）
const _raw = process.env.POSTGRES_PRISMA_URL!
const connectionString = _raw.includes("?")
  ? `${_raw}&sslmode=require`
  : `${_raw}?sslmode=require`

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString,
    // Vercel Postgres uses PgBouncer in transaction mode — a single
    // connection avoids contention at the PgBouncer layer.
    max: 1,
    // Don't let the pool close connections on its own; PgBouncer
    // manages the idle lifecycle.  Zero means "never idle out".
    idleTimeoutMillis: 0,
    // Don't wait forever for a connection that the server already closed.
    connectionTimeoutMillis: 15_000,
  })

  // When PgBouncer or the server closes a connection, the pool may
  // still hold a reference to it.  Log the event so it's visible in
  // production, and let the pool re-create the connection on the next query.
  pool.on("error", (err: Error) => {
    console.warn("[prisma] pool error (connection may have been closed by server):", err.message)
  })

  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter, log: ["warn", "error"] })
}

declare global {
  // eslint-disable-next-line no-var
  var __prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// 避免 Next.js 开发环境下热更新导致数据库连接数耗尽
const _prisma = globalThis.__prisma ?? prismaClientSingleton()

// ✅ 命名导出，匹配 layout.tsx 的 `import { prisma } from "@/lib/prisma"`
export const prisma = _prisma

if (process.env.NODE_ENV !== "production") globalThis.__prisma = _prisma
