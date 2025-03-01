import "next-auth"
import type { User } from "@/contexts/AuthContext"

declare module "next-auth" {
  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

