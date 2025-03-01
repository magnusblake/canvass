import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getBlogPostById, updateBlogPost, deleteBlogPost } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    const isAdmin = session.user.id === 'user1' || session.user.id === 'user3'; // Temporary admin check
    if (post.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const updatedPost = await updateBlogPost(params.id, body)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating blog post:", error)
    return NextResponse.json({ error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    const isAdmin = session.user.id === 'user1' || session.user.id === 'user3'; // Temporary admin check
    if (post.authorId !== session.user.id && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteBlogPost(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 })
  }
}