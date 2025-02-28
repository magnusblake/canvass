import Header from "@/components/header"
import BestProjects from "@/components/best-projects"
import AllProjects from "@/components/all-projects"
import HeroSlider from "@/components/hero-slider"
import Stories from "@/components/stories"
import RecommendedUsers from "@/components/recommended-users"
import { getAllProjects, getAllStories, getRecommendedUsers } from "@/lib/data"

export default function Home() {
  const projects = getAllProjects()
  const stories = getAllStories()
  const recommendedUsers = getRecommendedUsers()

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Stories stories={stories} />
        <HeroSlider />
        <div className="my-12" />
        <BestProjects projects={projects.filter((p) => p.featured)} />
        <div className="my-12" />
        <RecommendedUsers users={recommendedUsers} />
        <div className="my-12" />
        <AllProjects projects={projects} />
      </div>
    </main>
  )
}

