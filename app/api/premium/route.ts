import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { togglePremium } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await togglePremium(session.user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Premium toggle error:", error)
    return NextResponse.json({ error: "Failed to toggle premium status" }, { status: 500 })
  }
}

