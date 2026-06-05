import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CreatePostForm } from "@/components/feed/CreatePostForm"

export default function SubmitPage() {
  return (
    <div className="max-w-3xl animate-fade-in-up">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ArrowLeft size={16} />
        Back to feed
      </Link>

      <CreatePostForm />
    </div>
  )
}
