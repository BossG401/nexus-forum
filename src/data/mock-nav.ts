import { Home, Radio, Newspaper, Flame } from "lucide-react"
import { NavLink } from "@/lib/types"

export const mockNavLinks: NavLink[] = [
  { label: "首页", href: "/", icon: Home },
  { label: "电竞", href: "/esports", icon: Radio },
  { label: "版本", href: "/patches", icon: Newspaper },
  { label: "热门", href: "/trending", icon: Flame },
]
