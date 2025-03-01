import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import db from "@/lib/db"
import { projectFromDb } from "@/lib/data"

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const stmt = db.prepare(`
      SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
      FROM projects p
      LEFT JOIN users u ON p.authorId = u.id
      LEFT JOIN likes l ON p.id = l.projectId
      INNER JOIN saved_projects sp ON p.id = sp.projectId
      WHERE sp.userId = ?
      GROUP BY p.id
      ORDER BY sp.createdAt DESC
    `)

    const rows = stmt.all(session.user.id)
    const projects = rows.map(projectFromDb)

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching saved projects:", error)
    return NextResponse.json({ error: "Failed to fetch saved projects" }, { status: 500 })
  }
}

