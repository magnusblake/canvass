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
  premium?: boolean
  country?: string
  interests?: string[]
  banner?: string | null
  vkLink?: string | null
  behanceLink?: string | null
  telegramLink?: string | null
  followers?: User[]
  following?: User[]
  awards?: Award[]
}

export interface Award {
  id: string
  userId: string
  title: string
  description: string
  image: string
  date: string
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  authorId: string;
  authorImage?: string;
  category: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  inn: string;
  verified: boolean;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  description: string;
  requirements: string;
  responsibilities: string;
  location: string;
  type: 'full-time' | 'part-time' | 'remote' | 'freelance';
  salary: string | null;
  category: string;
  experience: 'junior' | 'middle' | 'senior';
  tags: string[];
  companyId: string;
  companyName?: string;
  companyLogo?: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

export interface JobApplication {
  id: string;
  jobId: string;
  userId: string;
  resumeUrl: string | null;
  coverLetter: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}