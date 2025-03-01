import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getProjectById, toggleLike } from "@/lib/data"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await getProjectById(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const result = await toggleLike(session.user.id, params.id)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to like project" }, { status: 500 })
  }
}