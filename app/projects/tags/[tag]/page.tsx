import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import ProjectGrid from "@/components/project-grid";
import { Button } from "@/components/ui/button";
import { Tag, ChevronLeft } from "lucide-react";

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  
  return {
    title: `Проекты с тегом "${tag}" | Canvas`,
    description: `Просмотр проектов с тегом "${tag}" на платформе Canvas`,
  };
}

async function getProjectsByTag(tag: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || ''}/api/projects?tag=${encodeURIComponent(tag)}`,
    { next: { revalidate: 3600 } }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects by tag');
  }
  
  return response.json();
}

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  const projects = await getProjectsByTag(tag);
  
  if (!projects || projects.length === 0) {
    notFound();
  }
  
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
            <Tag className="mr-2 h-6 w-6" />
            Проекты с тегом "{tag}"
          </h1>
        </div>
        
        <div className="mb-8">
          <p className="text-muted-foreground mb-4">
            Найдено {projects.length} {projects.length === 1 ? 'проект' : 
              projects.length >= 2 && projects.length <= 4 ? 'проекта' : 'проектов'} с тегом "{tag}".
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/all-projects">
                Все проекты
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/best-projects">
                Лучшие проекты
              </Link>
            </Button>
          </div>
        </div>
        
        <ProjectGrid projects={projects} />
      </div>
    </main>
  );
}