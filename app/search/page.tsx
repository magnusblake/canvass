import { Suspense } from "react"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"
import db from "@/lib/db" // Заменяем импорт prisma на db
import Link from "next/link"
import Image from "next/image"

interface SearchPageProps {
  searchParams: { q?: string }
}

export const metadata = {
  title: "Поиск проектов | Canvas",
  description: "Найдите интересные дизайнерские проекты на Canvas",
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Поиск проектов</h1>

          <form className="relative mb-8">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              name="q"
              placeholder="Введите поисковый запрос..."
              defaultValue={query}
              className="pl-10 py-6 text-lg"
            />
            <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              Искать
            </Button>
          </form>

          <Suspense fallback={<div>Загрузка результатов...</div>}>
            <SearchResults query={query} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

async function SearchResults({ query }: { query: string }) {
  if (!query) {
    return <div className="text-center text-muted-foreground py-8">Введите запрос для поиска проектов</div>
  }

  // Используем SQL LIKE для поиска
  const likeTerm = `%${query}%`

  // Выполняем поиск по базе данных с помощью SQLite
  const projects = db
    .prepare(`
    SELECT p.*, u.name as authorName, COUNT(l.id) as likes
    FROM projects p
    LEFT JOIN users u ON p.authorId = u.id
    LEFT JOIN likes l ON p.id = l.projectId
    WHERE p.title LIKE ? OR p.description LIKE ? OR p.tags LIKE ?
    GROUP BY p.id
    ORDER BY p.createdAt DESC
    LIMIT 20
  `)
    .all(likeTerm, likeTerm, likeTerm)

  if (projects.length === 0) {
    return <div className="text-center text-muted-foreground py-8">По запросу "{query}" ничего не найдено</div>
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-4">Результаты поиска: {projects.length}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="group block overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-semibold text-lg text-white truncate">{project.title}</h3>
                <span className="text-sm text-white/80">{project.authorName}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

