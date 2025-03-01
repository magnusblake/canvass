import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import ProjectGrid from "@/components/project-grid";
import Link from "next/link";
import { Bookmark, ChevronLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Сохраненные проекты | Canvas",
  description: "Просмотр сохраненных дизайнерских проектов на платформе Canvas",
};

async function getSavedProjects() {
  const session = await getSession();
  
  if (!session?.user) {
    return [];
  }
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/saved-projects`, {
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch saved projects');
  }
  
  return response.json();
}

export default async function SavedProjectsPage() {
  const session = await getSession();
  
  if (!session?.user) {
    notFound();
  }
  
  const projects = await getSavedProjects();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/" className="text-muted-foreground flex items-center hover:text-foreground transition-colors mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад
          </Link>
          <h1 className="text-3xl font-bold flex items-center">
            <Bookmark className="mr-2 h-6 w-6" />
            Сохраненные проекты
          </h1>
        </div>
        
        {projects.length > 0 ? (
          <ProjectGrid projects={projects} />
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Bookmark className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">У вас пока нет сохраненных проектов</h2>
            <p className="text-muted-foreground mb-8">
              Сохраняйте понравившиеся проекты, чтобы вернуться к ним позже
            </p>
            <Button asChild>
              <Link href="/all-projects">
                Просмотреть проекты
              </Link>
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}