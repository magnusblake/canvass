import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { followUser } from "@/lib/data"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.id === params.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    const result = await followUser(session.user.id, params.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Follow error:", error)
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 })
  }
}

