import { getAllProjects } from "@/lib/data"
import AllProjects from "@/components/all-projects"
import Header from "@/components/header"

export const metadata = {
  title: "Все проекты | Canvas",
  description: "Просмотр всех дизайнерских проектов на платформе Canvas",
}

export default async function AllProjectsPage() {
  const projects = await getAllProjects()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Все проекты</h1>
        <AllProjects projects={projects} />
      </div>
    </main>
  )
}