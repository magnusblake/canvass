import prisma from "./prisma"
import type { Project, Story } from "./types"

export async function getAllProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
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

  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    author: project.author.name,
    authorId: project.author.id,
    likes: project._count.likes,
    views: project.views,
    featured: project.featured,
    category: project.category === "TWO_D" ? "2d" : "3d",
    tags: project.tags,
    createdAt: project.createdAt.toISOString(),
  }))
}

export async function getProjectById(id: string): Promise<Project | null> {
  const project = await prisma.project.findUnique({
    where: { id },
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

  if (!project) return null

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    author: project.author.name,
    authorId: project.author.id,
    likes: project._count.likes,
    views: project.views,
    featured: project.featured,
    category: project.category === "TWO_D" ? "2d" : "3d",
    tags: project.tags,
    createdAt: project.createdAt.toISOString(),
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: {
      featured: true
    },
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

  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    author: project.author.name,
    authorId: project.author.id,
    likes: project._count.likes,
    views: project.views,
    featured: project.featured,
    category: project.category === "TWO_D" ? "2d" : "3d",
    tags: project.tags,
    createdAt: project.createdAt.toISOString(),
  }))
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: {
      category: category === "2d" ? "TWO_D" : "THREE_D"
    },
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

  return projects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    author: project.author.name,
    authorId: project.author.id,
    likes: project._count.likes,
    views: project.views,
    featured: project.featured,
    category: project.category === "TWO_D" ? "2d" : "3d",
    tags: project.tags,
    createdAt: project.createdAt.toISOString(),
  }))
}

export async function getAllStories(): Promise<Story[]> {
  const stories = await prisma.story.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return stories.map(story => ({
    id: story.id,
    title: story.title,
    content: story.content,
    imageUrl: story.imageUrl,
    link: story.link,
    createdAt: story.createdAt.toISOString(),
  }))
}