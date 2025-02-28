"use client"

import Image from "next/image"
import type { Award } from "@/lib/types"
import { motion } from "framer-motion"

export default function AwardsList({ awards }: { awards: Award[] }) {
  if (awards.length === 0) {
    return <p className="text-center text-muted-foreground">У пользователя пока нет наград.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {awards.map((award, index) => (
        <motion.div
          key={award.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-card rounded-lg p-4 flex items-center space-x-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex-shrink-0">
              <Image
                src={award.imageUrl || "/placeholder.svg"}
                alt={award.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-sm sm:text-base">{award.name}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{award.description}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Получено: {new Date(award.dateReceived).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

