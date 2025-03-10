import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import { getUserById } from "./data"

const secretKey = process.env.JWT_SECRET || "this-is-a-secret-key-that-should-be-changed"
const key = new TextEncoder().encode(secretKey)

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string | null
}

export interface Session {
  user: SessionUser
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key)

  return token
}

export async function getSession(): Promise<Session | null> {
  // Ensure this code only runs in environments where it's appropriate
  // Client-side usage
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Failed to get session on client:', error);
    }
    return null;
  } 
  
  // Server-side usage
  try {
    // Use dynamicImport for next/headers to avoid static analysis issues
    const cookieStore = cookies();
    const token = cookieStore.get('session')?.value;

    if (!token) return null;

    const verified = await jwtVerify(token, key);
    return verified.payload as unknown as Session;
  } catch (error) {
    // Fail gracefully if cookies() causes issues during static generation
    console.error('Failed to verify session token:', error);
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return null
    }

    const user = await getUserById(session.user.id)

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}