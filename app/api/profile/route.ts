import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { updateUserProfile } from "@/lib/data"

export async function PUT(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const updatedUser = await updateUserProfile(session.user.id, data)

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

