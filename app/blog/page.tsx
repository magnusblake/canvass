import Link from "next/link"
import Image from "next/image"
import { getAllBlogPosts, getFeaturedBlogPosts } from "@/lib/data"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Блог | Canvas",
  description: "Новости и статьи от команды Canvas для дизайнеров",
}

export default async function BlogPage() {
  const allPosts = await getAllBlogPosts()
  const featuredPosts = await getFeaturedBlogPosts()
  
  // Extract unique categories
  const categories = Array.from(new Set(allPosts.map(post => post.category)))

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Блог Canvas</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Новости, статьи и советы от нашей команды для дизайнеров
          </p>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Рекомендуемые статьи</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredPosts.slice(0, 2).map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-lg border shadow-sm flex flex-col h-full transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block px-2 py-1 bg-primary text-white text-xs rounded-full mb-2">
                          {post.category}
                        </span>
                        <h3 className="font-semibold text-xl text-white">{post.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Category Tabs and All Posts */}
          <section>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Все статьи</h2>
              
              <Tabs defaultValue="all" className="w-full md:w-auto mt-4 md:mt-0">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="all">Все</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {allPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="grid md:grid-cols-[250px_1fr] gap-0">
                    <div className="relative aspect-[4/3] md:aspect-auto md:h-full">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-1 bg-muted text-xs rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                            locale: ru,
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center text-primary font-medium">
                        Читать статью <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}