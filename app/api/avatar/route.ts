import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name") || "User"
  const size = searchParams.get("size") || "256"
  const background = searchParams.get("background") || "random"

  // Используем сервис UI Avatars для генерации аватаров
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=${size}&background=${background}&color=fff&bold=true&format=svg`

  return NextResponse.redirect(avatarUrl)
}

