import { getAllProjects } from "@/lib/data"
import AllProjects from "@/components/all-projects"
import Header from "@/components/header"

export default function AllProjectsPage() {
  const projects = getAllProjects()

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

