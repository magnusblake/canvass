import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProjectById, getAllProjects, getSimilarProjects } from "@/lib/data"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Heart, Eye, Calendar, Tag, ChevronLeft } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import LikeButton from "@/components/like-button"
import CommentsSection from "@/components/comments-section"
import SaveButton from "@/components/save-button"
import TagBadge from "@/components/tag-badge"
import SimilarProjects from "@/components/similar-projects"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map(project => ({
    id: project.id
  }))
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectById(params.id)

  if (!project) {
    return {
      title: "Проект не найден",
    }
  }

  return {
    title: `${project.title} | Canvas`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectById(params.id)
  const similarProjects = await getSimilarProjects(params.id)

  if (!project) {
    notFound()
  }

  const createdDate = new Date(project.createdAt)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Назад
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${project.author}`}
                    alt={project.author}
                    fill
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Link
                    href={`/profile/${project.authorId}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {project.author}
                  </Link>
                  <div className="text-sm text-muted-foreground">Дизайнер</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between border-b pb-2">
                  <div className="flex items-center text-muted-foreground">
                    <Eye className="h-4 w-4 mr-2" />
                    Просмотры
                  </div>
                  <div className="font-medium">{project.views}</div>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <div className="flex items-center text-muted-foreground">
                    <Heart className="h-4 w-4 mr-2" />
                    Лайки
                  </div>
                  <div className="font-medium">{project.likes}</div>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    Дата публикации
                  </div>
                  <div className="font-medium">
                    {formatDistanceToNow(createdDate, { addSuffix: true, locale: ru })}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center text-muted-foreground">
                    <Tag className="h-4 w-4 mr-2" />
                    Категория
                  </div>
                  <div className="font-medium uppercase">{project.category}</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <LikeButton projectId={project.id} initialLikes={project.likes} />
                <div className="flex gap-2">
                  <SaveButton projectId={project.id} className="flex-1" />
                  <Button variant="outline" className="flex-1">
                    Поделиться
                  </Button>
                </div>
              </div>
              
              <div className="mt-12">
                <CommentsSection projectId={project.id} />
              </div>
              
              {similarProjects.length > 0 && (
                <div className="mt-16">
                  <SimilarProjects projects={similarProjects} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}