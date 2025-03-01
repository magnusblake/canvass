import "next-auth"
import { User } from "@/contexts/AuthContext"

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