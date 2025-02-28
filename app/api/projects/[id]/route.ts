import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Increment view count
    await prisma.project.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    const project = await prisma.project.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...project,
      likes: project._count.likes,
      author: project.author.name,
      authorId: project.author.id,
      authorImage: project.author.image
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { title, description, category, tags, featured } = body

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { author: true }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.author.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedProject = await prisma.project.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category: category === "2d" ? "TWO_D" : "THREE_D",
        tags,
        featured
      }
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { author: true }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.author.email !== session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.project.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}