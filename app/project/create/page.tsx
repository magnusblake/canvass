"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function CreateProjectPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<"2d" | "3d">("2d")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Redirect if not authenticated
  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!imageFile) {
      toast.error("Выберите изображение")
      return
    }

    setIsUploading(true)

    try {
      // Upload image first
      const formData = new FormData()
      formData.append("file", imageFile)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image")
      }

      const { imageUrl } = await uploadResponse.json()

      // Create project
      const projectResponse = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          tags: tags.split(",").map(tag => tag.trim()),
          image: imageUrl
        }),
      })

      if (!projectResponse.ok) {
        throw new Error("Failed to create project")
      }

      const project = await projectResponse.json()
      
      toast.success("Проект успешно создан")
      router.push(`/project/${project.id}`)
    } catch (error) {
      console.error("Error creating project:", error)
      toast.error("Не удалось создать проект")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Создать проект</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Название проекта</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Название вашего проекта"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Опишите ваш проект"
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as "2d" | "3d")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2d">2D</SelectItem>
                  <SelectItem value="3d">3D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Теги (через запятую)</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="дизайн, интерфейс, веб..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Изображение проекта</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="flex-1"
                />
                
                {imagePreview && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                    <Image 
                      src={imagePreview} 
                      alt="Preview" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary" 
              disabled={isUploading}
            >
              {isUploading ? "Загрузка..." : "Создать проект"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}