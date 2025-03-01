import Header from "@/components/header"
import BestProjects from "@/components/best-projects"
import AllProjects from "@/components/all-projects"
import HeroSlider from "@/components/hero-slider"
import Stories from "@/components/stories"
import { getAllProjects, getAllStories } from "@/lib/data"

export default async function Home() {
  const projects = await getAllProjects()
  const stories = await getAllStories()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Stories stories={stories} />
        <HeroSlider />
        <div className="my-12" />
        <BestProjects projects={projects.filter((p) => p.featured)} />
        <div className="my-12" />
        <AllProjects projects={projects} />
      </div>
    </main>
  )
}

