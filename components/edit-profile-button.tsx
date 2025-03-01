"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { PencilIcon } from "lucide-react"

interface EditProfileButtonProps {
  className?: string
}

export default function EditProfileButton({ className }: EditProfileButtonProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    country: user?.country || "",
    interests: (user?.interests || []).join(", "),
    vkLink: user?.vkLink || "",
    behanceLink: user?.behanceLink || "",
    telegramLink: user?.telegramLink || ""
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Преобразуем строку с интересами в массив
    const interests = formData.interests
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0)
    
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          interests
        })
      })
      
      if (response.ok) {
        toast.success("Профиль успешно обновлен")
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error("Не удалось обновить профиль")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={cn(className)}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Редактировать профиль
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Страна</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interests">Интересы (через запятую)</Label>
            <Input
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="дизайн, типографика, 3D..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vkLink">VK</Label>
            <Input
              id="vkLink"
              name="vkLink"
              value={formData.vkLink}
              onChange={handleChange}
              placeholder="https://vk.com/username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="behanceLink">Behance</Label>
            <Input
              id="behanceLink"
              name="behanceLink"
              value={formData.behanceLink}
              onChange={handleChange}
              placeholder="https://behance.net/username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telegramLink">Telegram</Label>
            <Input
              id="telegramLink"
              name="telegramLink"
              value={formData.telegramLink}
              onChange={handleChange}
              placeholder="https://t.me/username"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}