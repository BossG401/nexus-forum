import { Home, Radio, Newspaper, Flame } from "lucide-react"
import { NavLink } from "@/lib/types"

export const mockNavLinks: NavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Esports", href: "/esports", icon: Radio },
  { label: "Patches", href: "/patches", icon: Newspaper },
  { label: "Trending", href: "/trending", icon: Flame },
]
