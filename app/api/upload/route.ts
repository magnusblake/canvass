import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Пути для сохранения загруженных файлов
const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
const avatarsDir = path.join(uploadsDir, 'avatars')
const bannersDir = path.join(uploadsDir, 'banners')
const projectsDir = path.join(uploadsDir, 'projects')

// Создаем директории, если их нет
try {
  for (const dir of [uploadsDir, avatarsDir, bannersDir, projectsDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
} catch (error) {
  console.error('Error creating upload directories:', error)
}

export async function POST(req: Request) {
  const session = await getSession()

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string || "project"
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${uuidv4()}.${fileExtension}`
    
    // Выбираем директорию и путь на основе типа загрузки
    let targetDir = projectsDir
    let maxWidth = 1200
    let maxHeight = 1200
    
    if (type === "avatar") {
      targetDir = avatarsDir
      maxWidth = 300
      maxHeight = 300
    } else if (type === "banner") {
      targetDir = bannersDir
      maxWidth = 1920
      maxHeight = 600
    }
    
    const filePath = path.join(targetDir, fileName)
    
    // Преобразование File в Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Обработка изображения с помощью sharp
    let processedImage = sharp(buffer)
    
    // Изменяем размер изображения
    processedImage = processedImage.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    })
    
    // Оптимизируем в зависимости от формата
    if (fileExtension === 'png') {
      processedImage = processedImage.png({ quality: 90 })
    } else if (fileExtension === 'webp') {
      processedImage = processedImage.webp({ quality: 90 })
    } else {
      processedImage = processedImage.jpeg({ quality: 90 })
    }
    
    // Сохраняем файл
    await processedImage.toFile(filePath)
    
    // Формирование относительного URL для файла
    const imageUrl = `/uploads/${type === "avatar" ? "avatars" : type === "banner" ? "banners" : "projects"}/${fileName}`
    
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}