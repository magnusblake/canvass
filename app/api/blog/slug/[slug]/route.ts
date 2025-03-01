import { getBlogPostBySlug } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const post = await getBlogPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching blog post by slug:", error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}