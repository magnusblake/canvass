import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import prisma from "@/lib/prisma"
import { Heart, Eye, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
import db from "@/lib/db"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export async function generateStaticParams() {
  const users = db.prepare('SELECT id FROM users').all()
  return users.map(user => ({
    id: user.id
  }))
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
  })

  if (!user) {
    return {
      title: "Пользователь не найден | Canvas",
    }
  }

  return {
    title: `${user.name} | Canvas`,
    description: `Профиль дизайнера ${user.name} на платформе Canvas`,
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { likes: true },
          },
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  const totalProjects = user.projects.length
  const totalLikes = user.projects.reduce((acc, project) => acc + project._count.likes, 0)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <div className="bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={user.image || `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                <p className="text-muted-foreground mb-4">Дизайнер</p>

                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold">{totalProjects}</span>
                    <span className="text-sm text-muted-foreground">Проектов</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <span className="text-xl font-bold">{totalLikes}</span>
                    <span className="text-sm text-muted-foreground">Лайков</span>
                  </div>
                </div>

                {user.bio && (
                  <div className="w-full mb-6">
                    <h2 className="font-medium mb-2">О себе</h2>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                  </div>
                )}

                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  На платформе с {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="projects">
              <TabsList className="mb-6">
                <TabsTrigger value="projects">Все проекты</TabsTrigger>
                <TabsTrigger value="featured">Избранные</TabsTrigger>
              </TabsList>

              <TabsContent value="projects">
                {user.projects.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {user.projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/project/${project.id}`}
                        className="group block overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="relative aspect-[4/3]">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-3 right-3 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                            <div className="flex items-center text-sm text-white">
                              <Heart className="h-4 w-4 mr-1" />
                              {project._count.likes}
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    У пользователя пока нет проектов
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured">
                {user.projects.filter((p) => p.featured).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {user.projects
                      .filter((p) => p.featured)
                      .map((project) => (
                        <Link
                          key={project.id}
                          href={`/project/${project.id}`}
                          className="group block overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
                        >
                          <div className="relative aspect-[4/3]">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute top-3 right-3 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                              <div className="flex items-center text-sm text-white">
                                <Heart className="h-4 w-4 mr-1" />
                                {project._count.likes}
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
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    У пользователя нет избранных проектов
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}