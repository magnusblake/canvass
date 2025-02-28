"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Heart, Eye } from "lucide-react"
import type { Project } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export default function BestProjects({ projects }: { projects: Project[] }) {
  const router = useRouter()
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "2d" | "3d">("all")
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "week">("all")
  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const filteredProjects = projects.filter((project) => {
    if (filter !== "all" && project.category !== filter) {
      return false
    }

    if (timeFilter !== "all") {
      const now = new Date()
      const projectDate = new Date(project.createdAt)

      if (timeFilter === "month") {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        if (projectDate < monthAgo) return false
      } else if (timeFilter === "week") {
        const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        if (projectDate < weekAgo) return false
      }
    }

    return true
  })

  const scroll = useCallback((direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.offsetWidth : current.offsetWidth

      current.scrollBy({ left: scrollAmount, behavior: "smooth" })

      // Update scroll buttons visibility after scrolling
      setTimeout(() => {
        if (current) {
          setCanScrollLeft(current.scrollLeft > 0)
          setCanScrollRight(current.scrollLeft < current.scrollWidth - current.clientWidth)
        }
      }, 300)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, offsetWidth } = carouselRef.current
        const newIndex = Math.round(scrollLeft / offsetWidth)
        setActiveIndex(newIndex)
      }
    }

    carouselRef.current?.addEventListener("scroll", handleScroll)
    return () => carouselRef.current?.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
      }
    }

    const current = carouselRef.current
    if (current) {
      current.addEventListener("scroll", handleScroll)
      // Call it once to set initial state
      handleScroll()
    }

    return () => {
      if (current) {
        current.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

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
    <section className="mb-16">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-bold">Лучшие проекты</h2>

        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-center">
          <Tabs
            value={filter}
            onValueChange={(value) => setFilter(value as "all" | "2d" | "3d")}
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

          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as "all" | "month" | "week")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Выберите период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">За все время</SelectItem>
              <SelectItem value="month">За месяц</SelectItem>
              <SelectItem value="week">За неделю</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              router.push({
                pathname: "/best-projects",
                query: { category: filter, time: timeFilter },
              })
            }
          >
            Посмотреть все
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => scroll("left")}
            aria-label="Предыдущий проект"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div
          ref={carouselRef}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] snap-start"
            >
              <div
                className="relative overflow-hidden rounded-lg shadow-lg group cursor-pointer"
                onClick={() => handleProjectClick(project.id)}
              >
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
                {index === 0 && (
                  <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    #1
                  </div>
                )}
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

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => scroll("right")}
            aria-label="Следующий проект"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </section>
  )
}

