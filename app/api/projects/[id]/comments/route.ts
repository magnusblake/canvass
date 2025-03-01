import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getProjectById } from "@/lib/data";
import db from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// GET-запрос для получения комментариев проекта
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const project = await getProjectById(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const stmt = db.prepare(`
      SELECT c.*, u.name as userName, u.image as userImage, u.premium as userPremium
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.projectId = ?
      ORDER BY c.createdAt DESC
    `);

    const comments = stmt.all(params.id);
    
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// POST-запрос для добавления комментария
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await getProjectById(params.id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO comments (id, content, projectId, userId)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, content, params.id, session.user.id);

    // Получаем данные о созданном комментарии
    const commentStmt = db.prepare(`
      SELECT c.*, u.name as userName, u.image as userImage, u.premium as userPremium
      FROM comments c
      JOIN users u ON c.userId = u.id
      WHERE c.id = ?
    `);

    const comment = commentStmt.get(id);
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}