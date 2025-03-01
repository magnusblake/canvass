import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

// Пути, которые не требуют аутентификации
const publicPaths = [
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/session",
  "/best-projects",
  "/all-projects",
  "/search",
]

// Префиксы путей, которые не требуют аутентификации
const publicPathPrefixes = [
  "/project/",
  "/profile/",
  "/api/projects",
  "/_next",
  "/favicon",
  "/logo",
  "/images",
  "/uploads",
  "/hero-slide",
  "/placeholder",
]

const secretKey = process.env.JWT_SECRET || "this-is-a-secret-key-that-should-be-changed"
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Проверяем, является ли путь публичным
  if (publicPaths.includes(pathname) || publicPathPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  // Получаем сессионный токен из куки
  const token = request.cookies.get("session")?.value

  // Если нет токена, перенаправляем на страницу входа
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  try {
    // Проверяем токен
    await jwtVerify(token, key)
    return NextResponse.next()
  } catch (error) {
    // Если токен недействителен, перенаправляем на страницу входа
    const url = new URL("/login", request.url)
    url.searchParams.set("redirect", encodeURI(request.url))
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

