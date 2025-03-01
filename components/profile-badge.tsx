import { FaCrown } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface ProfileBadgeProps {
  type: "premium" | "standard"
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function ProfileBadge({ type, size = "md", className }: ProfileBadgeProps) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        type === "premium" 
          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300" 
          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        size === "sm" && "text-[10px] px-1.5 py-0.5",
        size === "lg" && "text-sm px-2.5 py-1",
        className
      )}
    >
      {type === "premium" && <FaCrown className="mr-1" />}
      {type === "premium" ? "Премиум" : "Стандарт"}
    </span>
  )
}