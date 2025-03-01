import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getBlogPostById, getBlogComments, createBlogComment } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const comments = await getBlogComments(params.id)

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching blog comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 })
    }

    const comment = await createBlogComment({
      content,
      postId: params.id,
      userId: session.user.id
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}