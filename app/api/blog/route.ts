import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getAllBlogPosts, createBlogPost, getFeaturedBlogPosts, getBlogPostsByCategory, getBlogPostsByTag } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get("featured") === "true"
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    
    let posts;
    
    // Use appropriate data function based on query params
    if (featured) {
      posts = await getFeaturedBlogPosts()
    } else if (category) {
      posts = await getBlogPostsByCategory(category)
    } else if (tag) {
      posts = await getBlogPostsByTag(tag)
    } else {
      posts = await getAllBlogPosts()
    }
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // For blog creation, check if user is an admin (This is a placeholder - you'd need to implement admin checks)
  // In a real app, you might have an "isAdmin" field in your user table
  const isAdmin = session.user.id === 'user1' || session.user.id === 'user3'; // Temporarily using premium users as admins

  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { title, content, excerpt, coverImage, category, tags } = body

    if (!title || !content || !excerpt || !coverImage || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const post = await createBlogPost({
      title,
      content,
      excerpt,
      coverImage,
      category,
      tags: tags || [],
      authorId: session.user.id,
      featured: body.featured || false,
      published: body.published !== undefined ? body.published : true
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating blog post:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}