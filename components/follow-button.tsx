"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

interface FollowButtonProps {
  userId: string
  initialIsFollowing: boolean
  className?: string
}

export default function FollowButton({ userId, initialIsFollowing, className }: FollowButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setIsFollowing(data.followed)

        if (data.followed) {
          toast.success("Вы успешно подписались на пользователя")
        } else {
          toast.success("Вы отписались от пользователя")
        }

        router.refresh()
      } else {
        toast.error("Не удалось выполнить действие")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className={cn(className)}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isLoading ? "Загрузка..." : isFollowing ? "Отписаться" : "Подписаться"}
    </Button>
  )
}

