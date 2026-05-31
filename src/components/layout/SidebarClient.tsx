"use client"

import { useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "./Sidebar"
import type { Category } from "@/lib/types"

interface SidebarClientProps {
  categories: Category[]
}

export function SidebarClient({ categories }: SidebarClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  const handleCategoryChange = useCallback(
    (categoryId: string) => {
      // Toggle: if already active, clear filter
      if (activeCategory === categoryId) {
        router.push("/")
      } else {
        router.push(`/?category=${categoryId}`)
      }
    },
    [router, activeCategory],
  )

  return (
    <Sidebar
      categories={categories}
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
      className="h-full"
    />
  )
}
