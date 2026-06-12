import { PrismaClient } from "@/generated/prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

// Neon Postgres 连接字符串：使用 URL 构造器统一设置 sslmode=verify-full，
// 同时处理 .env 中可能已有的 sslmode 空值（如 "&sslmode="）。
// verify-full 避免 pg v9 的 SSL 弃用警告（sslmode=require 将被降级为弱安全语义）。
const _raw = process.env.POSTGRES_PRISMA_URL!
const _url = new URL(_raw)
_url.searchParams.set("sslmode", "verify-full")
const connectionString = _url.toString()

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString,
    // Keep a small pool: enough for concurrent OAuth callbacks,
    // but not so many that local dev drains Neon's connection limits.
    // Neon direct-connection limit is ~20; 5 is safe for dev + build workers.
    max: 5,
    // Release idle connections after 10 s of inactivity.
    // Shorter than Neon's 15 s idle timeout to avoid dead connections.
    idleTimeoutMillis: 10_000,
    // Neon cold starts can take 10-20 s; 30 s gives headroom.
    connectionTimeoutMillis: 30_000,
    // TCP keepalive prevents intermediate firewalls from dropping idle connections
    keepAlive: true,
  })

  // Remove dead connections early: if the server closes one,
  // the pool logs and discards it, then creates a replacement.
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
