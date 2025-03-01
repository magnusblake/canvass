import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { createProject } from "@/lib/data"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import db from "@/lib/db"

export async function GET() {
  try {
    const projects = await db.query(`
      SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
      FROM projects p
      LEFT JOIN users u ON p.authorId = u.id
      LEFT JOIN likes l ON p.id = l.projectId
      GROUP BY p.id
      ORDER BY p.createdAt DESC
    `)

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, image, category, tags } = body

    if (!title || !description || !image || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const project = await createProject({
      title,
      description,
      image,
      category,
      tags: tags || [],
      authorId: session.user.id,
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

