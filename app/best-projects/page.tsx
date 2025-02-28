import { getAllProjects } from "@/lib/data"
import BestProjects from "@/components/best-projects"
import Header from "@/components/header"

export default function BestProjectsPage() {
  const projects = getAllProjects().filter((project) => project.featured)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Лучшие проекты</h1>
        <BestProjects projects={projects} />
      </div>
    </main>
  )
}

