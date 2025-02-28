"use client"

import Image from "next/image"
import { Heart, Eye } from "lucide-react"
import { motion } from "framer-motion"
import type { Project } from "@/lib/types"

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className="group cursor-pointer"
        >
          <div className="relative overflow-hidden rounded-lg shadow-lg">
            <div className="relative aspect-[4/3]">
              <Image
                src={project.image || "/placeholder.svg?height=300&width=400"}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-lg text-white truncate">{project.title}</h3>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
              <div className="flex items-center text-sm text-white">
                <Heart className="h-4 w-4 mr-1" />
                {project.likes}
              </div>
              <div className="flex items-center text-sm text-white">
                <Eye className="h-4 w-4 mr-1" />
                {project.views}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

