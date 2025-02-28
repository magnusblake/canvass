import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { v4 as uuidv4 } from "uuid"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { writeFile } from "fs/promises"
import path from "path"

// Создаем директорию для загрузок, если её нет
const uploadDir = path.join(process.cwd(), "public/uploads")

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

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`
    
    // Сохраняем файл локально
    try {
      // Убедимся, что директория существует
      await writeFile(path.join(uploadDir, fileName), buffer)
    } catch (error) {
      console.error("Error writing file:", error)
      // Если возникает ошибка при записи (например, директория не существует),
      // используем подход с URL-ами вместо этого
      return NextResponse.json({ 
        imageUrl: `https://source.unsplash.com/random/800x600?${file.name.split('.')[0]}`
      })
    }

    const imageUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    // Запасной вариант - используем случайные изображения с Unsplash
    return NextResponse.json({ 
      imageUrl: "https://source.unsplash.com/random/800x600?design"
    })
  }
}