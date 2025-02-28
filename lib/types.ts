export interface Story {
  id: string
  imageUrl: string
  title: string
  content: string
  link: string
  createdAt: string
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  author: string
  authorId: string
  likes: number
  views: number
  featured: boolean
  category: "2d" | "3d"
  tags: string[]
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  bio?: string | null
  createdAt: string
  projects?: Project[]
}