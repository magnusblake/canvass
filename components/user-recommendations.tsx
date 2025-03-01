"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { User } from "@/lib/types"
import ProfileBadge from "./premium-badge"
import FollowButton from "./follow-button"
import { useRouter } from "next/navigation"

export default function UserRecommendations() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch("/api/users/recommendations")

        if (response.ok) {
          const data = await response.json()
          setRecommendations(data)
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 bg-card rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Рекомендуемые дизайнеры</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-muted"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="p-6 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Рекомендуемые дизайнеры</h3>
      <div className="space-y-4">
        {recommendations.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Link href={`/profile/${user.id}`} className="relative w-10 h-10 flex-shrink-0">
              <Image
                src={user.image || `/api/avatar?name=${encodeURIComponent(user.name)}`}
                alt={user.name}
                fill
                className="rounded-full object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${user.id}`} className="font-medium hover:text-primary truncate">
                  {user.name}
                </Link>
                {user.premium && <ProfileBadge type="premium" size="sm" />}
              </div>
              {user.bio && <p className="text-xs text-muted-foreground truncate">{user.bio}</p>}
            </div>
            <FollowButton userId={user.id} initialIsFollowing={false} className="h-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

