import Link from "next/link"
import Image from "next/image"
import { getAllJobs, getFeaturedJobs } from "@/lib/data"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  Award, 
  Search, 
  Building2, 
  PlusCircle 
} from "lucide-react"
import JobCard from "@/components/job-card"

export const metadata = {
  title: "Вакансии | Canvas",
  description: "Найдите работу своей мечты в сфере дизайна на платформе Canvas",
}

export default async function JobsPage() {
  const allJobs = await getAllJobs()
  const featuredJobs = await getFeaturedJobs()
  
  // Extract unique job types and categories for filtering
  const jobTypes = Array.from(new Set(allJobs.map(job => job.type)))
  const jobCategories = Array.from(new Set(allJobs.map(job => job.category)))
  const jobExperience = Array.from(new Set(allJobs.map(job => job.experience)))
  
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Найдите работу своей мечты</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Лучшие вакансии для дизайнеров, UI/UX специалистов, иллюстраторов и 3D художников
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="#all-jobs">
                  <Search className="mr-2 h-5 w-5" />
                  Найти вакансии
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/companies/register">
                  <Building2 className="mr-2 h-5 w-5" />
                  Разместить вакансию
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Jobs Section */}
      {featuredJobs.length > 0 && (
        <section className="py-16 container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Рекомендуемые вакансии</h2>
            <Button variant="link" asChild>
              <Link href="#all-jobs">
                Показать все
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} featured />
            ))}
          </div>
        </section>
      )}
      
      {/* Main Jobs Section */}
      <section id="all-jobs" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Все вакансии</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <div className="lg:w-1/4">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Фильтры</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Тип работы</h4>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 mb-2">
                        <TabsTrigger value="all">Все типы</TabsTrigger>
                        <TabsTrigger value="full-time">Полная</TabsTrigger>
                      </TabsList>
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="part-time">Частичная</TabsTrigger>
                        <TabsTrigger value="remote">Удалённая</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Категория</h4>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="w-full grid grid-cols-1 mb-2">
                        <TabsTrigger value="all">Все категории</TabsTrigger>
                      </TabsList>
                      <TabsList className="w-full grid grid-cols-1 mb-2">
                        <TabsTrigger value="ui-ux">UI/UX Дизайн</TabsTrigger>
                      </TabsList>
                      <TabsList className="w-full grid grid-cols-1 mb-2">
                        <TabsTrigger value="graphic">Графический дизайн</TabsTrigger>
                      </TabsList>
                      <TabsList className="w-full grid grid-cols-1">
                        <TabsTrigger value="3d">3D Моделирование</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Опыт работы</h4>
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="w-full grid grid-cols-2 mb-2">
                        <TabsTrigger value="all">Все</TabsTrigger>
                        <TabsTrigger value="junior">Junior</TabsTrigger>
                      </TabsList>
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="middle">Middle</TabsTrigger>
                        <TabsTrigger value="senior">Senior</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Listings */}
            <div className="lg:w-3/4">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-muted-foreground">
                    Найдено {allJobs.length} вакансий
                  </p>
                  
                  <Tabs defaultValue="newest">
                    <TabsList>
                      <TabsTrigger value="newest">Новые</TabsTrigger>
                      <TabsTrigger value="relevant">Релевантные</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="space-y-6">
                  {allJobs.length > 0 ? (
                    allJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">Нет доступных вакансий</p>
                      <Button asChild>
                        <Link href="/companies/register">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Разместить первую вакансию
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Вы работодатель?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Разместите вакансию и найдите лучших специалистов в области дизайна
            </p>
            <Button size="lg" asChild>
              <Link href="/companies/register">
                <Building2 className="mr-2 h-5 w-5" />
                Зарегистрировать компанию
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}