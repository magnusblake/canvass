import { FaCrown } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface PremiumBadgeProps {
  className?: string
}

export default function PremiumBadge({ className }: PremiumBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium",
        className,
      )}
    >
      <FaCrown className="h-3 w-3" />
      <span>CanvasX</span>
    </div>
  )
}

