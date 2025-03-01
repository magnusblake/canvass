import { NextResponse } from "next/server"
import { createCanvas } from "canvas"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name") || "User"
  const size = parseInt(searchParams.get("size") || "200")
  
  // Создаем инициалы из имени
  const nameParts = name.split(" ")
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase()
  
  // Генерируем случайный цвет фона на основе имени
  const hash = name.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)
  
  const hue = hash % 360
  const bgColor = `hsl(${hue}, 65%, 60%)`
  
  // Создаем канвас
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext("2d")
  
  // Рисуем круглый фон
  ctx.fillStyle = bgColor
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
  ctx.fill()
  
  // Добавляем инициалы
  ctx.font = `bold ${size / 2.5}px Arial`
  ctx.fillStyle = "#ffffff"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(initials, size / 2, size / 2)
  
  // Конвертируем канвас в буфер
  const buffer = canvas.toBuffer("image/png")
  
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  })
}