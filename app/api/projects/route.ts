import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")
  const featured = searchParams.get("featured") === "true"

  let query = {}

  if (category && category !== "all") {
    query = {
      ...query,
      category: category === "2d" ? "TWO_D" : "THREE_D"
    }
  }

  if (featured) {
    query = {
      ...query,
      featured: true
    }
  }

  try {
    const projects = await prisma.project.findMany({
      where: query,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        _count: {
          select: { likes: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(projects.map(project => ({
      ...project,
      likes: project._count.likes,
      author: project.author.name,
      authorId: project.author.id,
      authorImage: project.author.image
    })))
  } catch (error) {
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

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        image,
        category: category === "2d" ? "TWO_D" : "THREE_D",
        tags,
        authorId: user.id
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}