import Image from "next/image"
import Link from "next/link"
import { Heart, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import type { Project } from "@/lib/types"
import SaveButton from "./save-button"
import LikeButton from "./like-button"

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="group relative overflow-hidden rounded-lg border shadow-sm">
          <Link href={`/project/${project.id}`} className="block">
            <div className="relative aspect-[4/3]">
              <Image
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-lg text-white truncate">{project.title}</h3>
                <span className="text-sm text-white/80">
                  {project.author} • {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true, locale: ru })}
                </span>
              </div>
            </div>
          </Link>

          <div className="absolute top-3 left-3 flex space-x-2">
            <SaveButton projectId={project.id} />
            <LikeButton projectId={project.id} initialLikes={project.likes} variant="icon" />
          </div>
        </div>
      ))}
    </div>
  )
}

