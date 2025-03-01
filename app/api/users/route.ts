import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const users = await db.query("SELECT id FROM users")
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching user IDs:", error)
    return NextResponse.json({ error: "Failed to fetch user IDs" }, { status: 500 })
  }
}

