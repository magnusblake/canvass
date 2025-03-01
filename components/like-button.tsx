"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

interface LikeButtonProps {
  projectId: string
  initialLikes: number
}

export default function LikeButton({ projectId, initialLikes }: LikeButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push("/login")
      return
    }

    setIsLiking(true)

    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.liked) {
          setLikes((prev) => prev + 1)
          toast.success("Добавлено в избранное")
        } else {
          setLikes((prev) => prev - 1)
          toast.success("Удалено из избранного")
        }
        
        // Refresh the page to update any other components
        router.refresh()
      } else {
        toast.error("Не удалось выполнить действие")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Button
      variant="default"
      className="w-full bg-primary hover:bg-primary/90"
      onClick={handleLike}
      disabled={isLiking}
    >
      <Heart className="h-4 w-4 mr-2" />
      {isLiking ? "Обработка..." : `Нравится (${likes})`}
    </Button>
  )
}