import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { ChevronLeft, Calendar, User, Tag } from "lucide-react"
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/data"
import Header from "@/components/header"
import BlogComments from "@/components/blog-comments"
import ShareButton from "@/components/share-button"
import TagBadge from "@/components/tag-badge"

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogPosts();
    return posts
      .filter(post => post.slug) // Make sure slug is defined
      .map(post => ({
        slug: post.slug
      }));
  } catch (error) {
    console.error('Error generating static params for blog posts:', error);
    return []; // Return empty array to avoid generating pages on error
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      return {
        title: "Статья не найдена",
      }
    }

    return {
      title: `${post.title} | Blog Canvas`,
      description: post.excerpt,
    }
  } catch (error) {
    console.error('Error generating metadata for blog post:', params.slug, error);
    return {
      title: "Ошибка загрузки статьи",
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
      notFound();
    }

    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm mb-6 hover:text-primary transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Назад к блогу
          </Link>

          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {post.category}
                </span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  {format(new Date(post.createdAt), 'dd MMMM yyyy', { locale: ru })}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
                    <Image
                      src={post.authorImage || `/api/avatar?name=${encodeURIComponent(post.author)}`}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href={`/profile/${post.authorId}`}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {post.author}
                  </Link>
                </div>
                
                <div className="ml-auto">
                  <ShareButton 
                    title={post.title}
                    text={post.excerpt}
                    url={`/blog/${post.slug}`}
                    variant="outline"
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />

            <div className="border-t pt-6 mt-8">
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="text-sm font-medium mr-2 flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  Теги:
                </span>
                {post.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={post.authorImage || `/api/avatar?name=${encodeURIComponent(post.author)}`}
                      alt={post.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">Автор статьи</h3>
                    <Link
                      href={`/profile/${post.authorId}`}
                      className="text-primary hover:underline"
                    >
                      {post.author}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <BlogComments postId={post.id} />
          </article>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error rendering blog post page:', error);
    notFound();
  }
}