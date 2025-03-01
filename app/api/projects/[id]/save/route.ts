import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getProjectById } from "@/lib/data"
import db from "@/lib/db"
import { v4 as uuidv4 } from "uuid"

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await getProjectById(params.id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Проверяем, сохранил ли пользователь уже этот проект
    const checkStmt = db.prepare("SELECT id FROM saved_projects WHERE userId = ? AND projectId = ?")
    const savedProject = checkStmt.get(session.user.id, params.id)

    if (savedProject) {
      // Удаляем из сохраненных
      const deleteStmt = db.prepare("DELETE FROM saved_projects WHERE id = ?")
      deleteStmt.run(savedProject.id)
      return NextResponse.json({ saved: false })
    } else {
      // Добавляем в сохраненные
      const id = uuidv4()
      const insertStmt = db.prepare("INSERT INTO saved_projects (id, userId, projectId) VALUES (?, ?, ?)")
      insertStmt.run(id, session.user.id, params.id)
      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error("Error toggling saved project:", error)
    return NextResponse.json({ error: "Failed to save/unsave project" }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ saved: false })
  }

  try {
    const checkStmt = db.prepare("SELECT id FROM saved_projects WHERE userId = ? AND projectId = ?")
    const savedProject = checkStmt.get(session.user.id, params.id)

    return NextResponse.json({ saved: !!savedProject })
  } catch (error) {
    console.error("Error checking saved status:", error)
    return NextResponse.json({ error: "Failed to check saved status" }, { status: 500 })
  }
}

