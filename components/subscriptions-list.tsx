"use client"

import Image from "next/image"
import type { Subscription } from "@/lib/types"
import Link from "next/link"
import { motion } from "framer-motion"

export default function SubscriptionsList({ subscriptions }: { subscriptions: Subscription[] }) {
  if (subscriptions.length === 0) {
    return <p className="text-center text-muted-foreground">Список пуст.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subscriptions.map((subscription, index) => (
        <motion.div
          key={subscription.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
        >
          <Link href={`/profile/${subscription.userId}`}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-card rounded-lg p-4 flex items-center space-x-4 hover:bg-muted transition-colors shadow-md hover:shadow-lg"
            >
              <div className="flex-shrink-0">
                <Image
                  src={subscription.userAvatarUrl || `/placeholder.svg?height=40&width=40`}
                  alt={subscription.userName}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-sm sm:text-base truncate">{subscription.userName}</h3>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

