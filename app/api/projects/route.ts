import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { getAllProjects, getProjectsByCategory, getFeaturedProjects, createProject } from "@/lib/data"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured") === "true";
  const tag = searchParams.get("tag");

  try {
    let projects;
    
    if (tag) {
      // Используем SQL LIKE для поиска по тегам (они хранятся как JSON)
      const stmt = db.prepare(`
        SELECT p.*, u.name as authorName, COUNT(l.id) as likeCount 
        FROM projects p
        LEFT JOIN users u ON p.authorId = u.id
        LEFT JOIN likes l ON p.id = l.projectId
        WHERE p.tags LIKE ?
        GROUP BY p.id
        ORDER BY p.createdAt DESC
      `);
      
      const rows = stmt.all(`%${tag}%`);
      projects = rows.map(projectFromDb).filter(project => project.tags.includes(tag));
    } else if (featured) {
      projects = await getFeaturedProjects();
    } else if (category && category !== "all") {
      projects = await getProjectsByCategory(category);
    } else {
      projects = await getAllProjects();
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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
      authorId: session.user.id
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}