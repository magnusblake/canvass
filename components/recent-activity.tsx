"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ActivityItem {
  id: string
  type: "project" | "like" | "comment"
  content: string
  date: string
  projectId?: string
  projectTitle?: string
  projectImage?: string
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Последняя активность</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-card rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 rounded-full p-2">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">{activity.date}</p>
                <p className="mb-2">{activity.content}</p>
                {activity.type === "project" &&
                  activity.projectId &&
                  activity.projectTitle &&
                  activity.projectImage && (
                    <Link href={`/project/${activity.projectId}`} className="flex items-center space-x-2 group">
                      <div className="relative w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={activity.projectImage || "/placeholder.svg"}
                          alt={activity.projectTitle}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <span className="text-sm font-medium group-hover:underline">{activity.projectTitle}</span>
                    </Link>
                  )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

