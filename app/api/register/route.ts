import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { createUser, getUserByEmail } from "@/lib/data"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

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

    // Создаем пользователя
    const user = await createUser({
      name,
      email,
      password: hashedPassword
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}