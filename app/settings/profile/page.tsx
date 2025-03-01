"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import ProfileImageUpload from "@/components/profile-image-upload"
import { CheckCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function ProfileSettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    country: "",
    interests: "",
    vkLink: "",
    behanceLink: "",
    telegramLink: ""
  })
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
    
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        country: user.country || "",
        interests: (user.interests || []).join(", "),
        vkLink: user.vkLink || "",
        behanceLink: user.behanceLink || "",
        telegramLink: user.telegramLink || ""
      })
      
      setAvatarUrl(user.image)
      setBannerUrl(user.banner)
    }
  }, [user, isLoading, router])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
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
          interests,
          image: avatarUrl,
          banner: bannerUrl
        })
      })
      
      if (response.ok) {
        toast.success("Профиль успешно обновлен", {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        })
        router.refresh()
        setTimeout(() => {
          router.push(`/profile/${user?.id}`)
        }, 1000)
      } else {
        toast.error("Не удалось обновить профиль")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-pulse">Загрузка...</div>
          </div>
        </div>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Link href={`/profile/${user.id}`} className="flex items-center text-sm mr-4 text-muted-foreground">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад к профилю
            </Link>
            <h1 className="text-2xl font-bold">Настройки профиля</h1>
          </div>
          
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">Фотографии профиля</h2>
                <div className="flex flex-col space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Баннер профиля</span>
                    <ProfileImageUpload
                      type="banner"
                      currentUrl={bannerUrl}
                      onUpload={setBannerUrl}
                    />
                  </label>
                  
                  <label className="block space-y-2">
                    <span className="text-sm font-medium">Аватар</span>
                    <ProfileImageUpload
                      type="avatar"
                      currentUrl={avatarUrl}
                      onUpload={setAvatarUrl}
                    />
                  </label>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Личная информация</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя пользователя</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
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
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">О себе</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Расскажите о себе, своём опыте и специализации..."
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="interests">Интересы (через запятую)</Label>
                    <Input
                      id="interests"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="дизайн, типографика, 3D..."
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-lg font-semibold mb-4">Социальные сети</h2>
                <div className="space-y-4">
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
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" className="min-w-32" disabled={isSaving}>
                  {isSaving ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}