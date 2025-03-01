import Link from "next/link"
import { cn } from "@/lib/utils"

interface TagBadgeProps {
  tag: string
  className?: string
}

export default function TagBadge({ tag, className }: TagBadgeProps) {
  return (
    <Link
      href={`/projects/tags/${encodeURIComponent(tag)}`}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        className,
      )}
    >
      {tag}
    </Link>
  )
}

