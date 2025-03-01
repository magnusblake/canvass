import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { isProjectLikedByUser } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  // If user is not logged in, return not liked
  if (!session?.user) {
    return NextResponse.json({ liked: false })
  }

  try {
    const liked = await isProjectLikedByUser(session.user.id, params.id)
    
    return NextResponse.json({ liked })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ error: "Failed to check like status" }, { status: 500 })
  }
}