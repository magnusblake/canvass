import Image from "next/image"
import Link from "next/link"
import { Heart, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import { Project } from "@/lib/types"

interface UserGalleryProps {
  projects: Project[]
}

export default function UserGallery({ projects }: UserGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/project/${project.id}`}
          className="group block overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
        >
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
                {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true, locale: ru })}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}