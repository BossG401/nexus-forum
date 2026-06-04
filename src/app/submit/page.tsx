import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CreatePostForm } from "@/components/feed/CreatePostForm"

export default function SubmitPage() {
  return (
    <div className="max-w-3xl animate-slide-in-brutal">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[10px] text-slate-400/60 hover:text-neon-blue transition-all duration-200 mb-6 font-display font-bold tracking-widest uppercase group"
      >
        <ArrowLeft
          size={12}
          className="group-hover:-translate-x-1 transition-transform duration-200"
        />
        BACK TO FEED
      </Link>

      <CreatePostForm />
    </div>
  )
}
