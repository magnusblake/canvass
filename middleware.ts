import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Пути, которые не требуют аутентификации
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/session',
  '/best-projects',
  '/all-projects',
  '/search',
  '/subscription/checkout',
  '/canvasx',
  '/blog',
  '/jobs',
]

// Префиксы путей, которые не требуют аутентификации
const publicPathPrefixes = [
  '/project/',
  '/profile/',
  '/api/projects',
  '/api/jobs',
  '/api/blog',
  '/api/companies',
  '/jobs/',
  '/blog/',
  '/_next',
  '/favicon',
  '/logo',
  '/images',
  '/uploads',
  '/hero-slide',
  '/placeholder',
]

// Пути, которые всегда должны быть динамическими
const dynamicPaths = [
  '/saved-projects',
  '/subscription/checkout',
  '/canvasx',
  '/profile/settings',
]

// Префиксы путей, которые всегда должны быть динамическими
const dynamicPathPrefixes = [
  '/jobs/',
  '/blog/',
  '/profile/',
]

const secretKey = process.env.JWT_SECRET || 'this-is-a-secret-key-that-should-be-changed'
const key = new TextEncoder().encode(secretKey)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Проверяем, должен ли путь быть рендерен динамически
  if (
    dynamicPaths.includes(pathname) ||
    dynamicPathPrefixes.some(prefix => pathname.startsWith(prefix))
  ) {
    // Устанавливаем заголовки, которые предотвращают кэширование
    // и обеспечивают динамический рендеринг
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    response.headers.set('X-Next-Dynamic-Render', 'true')
    
    // Если это публичный путь, просто возвращаем ответ с заголовками
    if (
      publicPaths.includes(pathname) ||
      publicPathPrefixes.some(prefix => pathname.startsWith(prefix))
    ) {
      return response
    }
    
    // Если это защищенный путь, проверяем аутентификацию
    const token = request.cookies.get('session')?.value
    
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
    
    try {
      await jwtVerify(token, key)
      return response
    } catch (error) {
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }
  
  // Обрабатываем обычные пути как раньше
  // Проверяем, является ли путь публичным
  if (
    publicPaths.includes(pathname) ||
    publicPathPrefixes.some(prefix => pathname.startsWith(prefix))
  ) {
    return NextResponse.next()
  }

  // Получаем сессионный токен из куки
  const token = request.cookies.get('session')?.value

  // Если нет токена, перенаправляем на страницу входа
  if (!token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  try {
    // Проверяем токен
    await jwtVerify(token, key)
    return NextResponse.next()
  } catch (error) {
    // Если токен недействителен, перенаправляем на страницу входа
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', encodeURI(request.url))
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}