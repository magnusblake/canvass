import type { Project } from "@/lib/types"
import ProjectGrid from "./project-grid"

interface SimilarProjectsProps {
  projects: Project[]
}

export default function SimilarProjects({ projects }: SimilarProjectsProps) {
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Похожие проекты</h2>
      <ProjectGrid projects={projects} />
    </div>
  )
}

