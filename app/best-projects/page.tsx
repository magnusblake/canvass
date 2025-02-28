import { getAllProjects } from "@/lib/data"
import BestProjects from "@/components/best-projects"
import Header from "@/components/header"

export const metadata = {
  title: "Лучшие проекты | Canvas",
  description: "Избранные дизайнерские проекты на платформе Canvas",
}

export default async function BestProjectsPage() {
  const projects = await getAllProjects()
  const featuredProjects = projects.filter((project) => project.featured)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Лучшие проекты</h1>
        <BestProjects projects={featuredProjects} />
      </div>
    </main>
  )
}