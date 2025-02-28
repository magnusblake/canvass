"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Eye, LayoutGrid, Grid2X2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

type CategoryFilter = "all" | "3d" | "2d"
type GridSize = "large" | "small"

export default function AllProjects({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const { user } = useAuth()
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")
  const [gridSize, setGridSize] = useState<GridSize>("small")
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 12
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (categoryFilter !== "all" && project.category !== categoryFilter) {
        return false
      }
      return true
    })
  }, [projects, categoryFilter])

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * projectsPerPage
    return filteredProjects.slice(startIndex, startIndex + projectsPerPage)
  }, [filteredProjects, currentPage])

  const pageCount = Math.ceil(filteredProjects.length / projectsPerPage)

  const toggleGridSize = () => {
    setGridSize((prev) => (prev === "small" ? "large" : "small"))
  }

  const handleLike = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (user) {
      // Implement like functionality here
      console.log("Liked project:", projectId)
    } else {
      router.push("/login")
    }
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  const handleAuthorClick = (e: React.MouseEvent, authorId: string) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/profile/${authorId}`)
  }

  return (
    <section>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold">Все проекты</h2>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center sm:space-x-4">
          <Tabs
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto grid grid-cols-3 gap-2">
              <TabsTrigger value="all" className="flex-1">
                Все
              </TabsTrigger>
              <TabsTrigger value="2d" className="flex-1">
                2D
              </TabsTrigger>
              <TabsTrigger value="3d" className="flex-1">
                3D
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {isDesktop && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleGridSize}
              className="ml-auto"
              aria-label={gridSize === "small" ? "Увеличить размер сетки" : "Уменьшить размер сетки"}
            >
              {gridSize === "small" ? <LayoutGrid className="h-4 w-4" /> : <Grid2X2 className="h-4 w-4" />}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              router.push({
                pathname: "/all-projects",
                query: { category: categoryFilter },
              })
            }
          >
            Посмотреть все
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6",
          gridSize === "large"
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {paginatedProjects.map((project) => (
          <div
            key={project.id}
            className={cn("group cursor-pointer", gridSize === "large" ? "col-span-1" : "col-span-1")}
            onClick={() => handleProjectClick(project.id)}
          >
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <div className="relative aspect-[4/3]">
                <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-lg text-white truncate">{project.title}</h3>
                  <span className="text-sm text-white/80">{project.author}</span>
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
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <div
                  className="relative w-16 h-16 mb-4 cursor-pointer"
                  onClick={(e) => handleAuthorClick(e, project.authorId)}
                >
                  <Image
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${project.author}`}
                    alt={project.author}
                    fill
                    className="rounded-full border-2 border-white"
                  />
                </div>
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full bg-primary hover:bg-primary/90"
                  onClick={(e) => handleLike(e, project.id)}
                  aria-label={`Лайк проекту ${project.title}`}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Предыдущая страница"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="mx-4 flex items-center">
            Страница {currentPage} из {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            aria-label="Следующая страница"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )
}

