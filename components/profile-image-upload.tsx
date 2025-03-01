"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { Camera, RefreshCw } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProfileImageUploadProps {
  type: "avatar" | "banner"
  currentUrl?: string | null
  onUpload: (url: string) => void
  className?: string
}

export default function ProfileImageUpload({ type, currentUrl, onUpload, className }: ProfileImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null)
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Показать локальный предпросмотр
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    
    // Загрузить файл на сервер
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload image")
      }
      
      const { imageUrl } = await response.json()
      onUpload(imageUrl)
      toast.success(`${type === "avatar" ? "Аватар" : "Баннер"} успешно загружен`)
    } catch (error) {
      toast.error(`Не удалось загрузить ${type === "avatar" ? "аватар" : "баннер"}`)
      // Вернуть предыдущий URL в случае ошибки
      setPreviewUrl(currentUrl)
    } finally {
      setIsUploading(false)
    }
  }
  
  if (type === "avatar") {
    return (
      <div className={cn("relative w-24 h-24 rounded-full overflow-hidden group", className)}>
        <Image
          src={previewUrl || `/api/avatar?name=User`}
          alt="Аватар"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            {isUploading ? (
              <RefreshCw className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </label>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("relative w-full h-40 rounded-lg overflow-hidden bg-muted", className)}>
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="Баннер"
          fill
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
        <label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <Button variant="outline" className="bg-white/80 hover:bg-white">
            {isUploading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            {previewUrl ? "Изменить баннер" : "Загрузить баннер"}
          </Button>
        </label>
      </div>
    </div>
  )
}