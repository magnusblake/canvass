import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import bcrypt from "bcrypt"
import { createUser, getUserByEmail } from "@/lib/data"
import { createSession } from "@/lib/auth"

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Проверяем, существует ли пользователь
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создаем URL стандартного аватара
    const defaultAvatarUrl = `/api/avatar?name=${encodeURIComponent(name)}`

    // Создаем пользователя
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      image: defaultAvatarUrl,
      premium: false,
    })

    // Создаем JWT-токен для сессии
    const token = await createSession({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      premium: user.premium,
    })

    // Устанавливаем куки
    cookies().set({
      name: "session",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        premium: user.premium,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

