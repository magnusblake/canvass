import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { v4 as uuidv4 } from "uuid"
import fs from 'fs'
import path from 'path'
import { authOptions } from "@/pages/api/auth/[...nextauth]"

// Путь для сохранения загруженных файлов
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

// Создаем директорию, если её нет
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }
} catch (error) {
  console.error('Error creating uploads directory:', error)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    
    // Преобразование File в Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Запись файла на диск
    fs.writeFileSync(filePath, buffer)
    
    // Формирование относительного URL для файла
    const imageUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}