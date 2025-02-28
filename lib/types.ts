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
  avatarUrl: string
  coverImageUrl: string
  email: string
  subscriptionType: "standard" | "premium"
  bio: string
  about: string
  followers: number
  following: number
  skills: string[]
  socialLinks: {
    instagram?: string
    twitter?: string
    behance?: string
    dribbble?: string
  }
  registrationDate: string
  awards: Award[]
}

export interface Award {
  id: string
  name: string
  description: string
  imageUrl: string
  dateReceived: string
}

export interface Subscription {
  id: string
  userId: string
  userName: string
  userAvatarUrl: string
}

