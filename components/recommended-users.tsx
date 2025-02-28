"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface RecommendedUsersProps {
  users: User[]
}

export default function RecommendedUsers({ users }: RecommendedUsersProps) {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set())

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Рекомендуемые пользователи</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={user.avatarUrl || `/placeholder.svg?height=48&width=48`}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex-grow">
                <Link href={`/profile/${user.id}`} className="font-semibold hover:underline">
                  {user.name}
                </Link>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{user.followers} подписчиков</span>
              <Button
                variant={followedUsers.has(user.id) ? "outline" : "default"}
                size="sm"
                onClick={() => handleFollow(user.id)}
              >
                {followedUsers.has(user.id) ? "Отписаться" : "Подписаться"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

