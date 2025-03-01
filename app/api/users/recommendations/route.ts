import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Получаем рекомендации пользователей, на которых можно подписаться
    // Исключаем текущего пользователя и тех, на кого он уже подписан
    const stmt = db.prepare(`
      SELECT u.id, u.name, u.image, u.bio, u.premium
      FROM users u
      WHERE u.id != ?
      AND NOT EXISTS (
        SELECT 1 FROM followers f 
        WHERE f.followerId = ? AND f.followingId = u.id
      )
      ORDER BY RANDOM()
      LIMIT 5
    `)

    const recommendations = stmt.all(session.user.id, session.user.id)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 })
  }
}

