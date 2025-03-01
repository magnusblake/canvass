"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { UploadCloud, Building2, CheckCircle2, Info } from "lucide-react"
import Header from "@/components/header"

export default function CompanyRegisterPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    inn: ""
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  if (!user) {
    router.push("/login?redirect=/companies/register")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Пожалуйста, загрузите изображение")
      return
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("Файл слишком большой. Максимальный размер: 5MB")
      return
    }

    setLogoFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleNextStep = () => {
    // Validation for step 1
    if (step === 1) {
      if (!formData.name.trim()) {
        toast.error("Введите название компании")
        return
      }
      if (!formData.inn.trim()) {
        toast.error("Введите ИНН компании")
        return
      }
      
      // Validate Russian INN format (10 or 12 digits)
      const innRegex = /^(\d{10}|\d{12})$/
      if (!innRegex.test(formData.inn)) {
        toast.error("Неверный формат ИНН. Должно быть 10 или 12 цифр")
        return
      }
    }

    setStep(prev => prev + 1)
  }

  const handlePreviousStep = () => {
    setStep(prev => prev - 1)
  }

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null
    
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("file", logoFile)
      formData.append("type", "company")
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })
      
      if (!response.ok) {
        throw new Error("Failed to upload logo")
      }
      
      const { imageUrl } = await response.json()
      return imageUrl
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Ошибка при загрузке логотипа")
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Upload logo if provided
      let logoUrl = null
      if (logoFile) {
        logoUrl = await uploadLogo()
      }
      
      // Create company
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          logo: logoUrl
        })
      })
      
      if (response.ok) {
        const company = await response.json()
        toast.success("Компания успешно зарегистрирована")
        router.push(`/companies/${company.id}`)
      } else {
        const data = await response.json()
        toast.error(data.error || "Не удалось зарегистрировать компанию")
      }
    } catch (error) {
      console.error("Error registering company:", error)
      toast.error("Произошла ошибка при регистрации компании")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Регистрация компании</h1>
            <p className="text-muted-foreground">
              Зарегистрируйте вашу компанию, чтобы размещать вакансии и находить лучших специалистов
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Шаг {step} из 3</CardTitle>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-10 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`}></div>
                  <div className={`h-2 w-10 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}></div>
                  <div className={`h-2 w-10 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`}></div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название компании *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ООО «Компания»"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="inn">ИНН компании *</Label>
                    <Input
                      id="inn"
                      name="inn"
                      value={formData.inn}
                      onChange={handleChange}
                      placeholder="7712345678"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      ИНН должен быть 10 цифр для юридических лиц или 12 цифр для ИП
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-700">Проверка компании</h4>
                        <p className="text-sm text-blue-600">
                          После регистрации компании наши модераторы проверят введенные данные. 
                          После успешной проверки вы сможете размещать вакансии.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание компании</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Расскажите о вашей компании, чем вы занимаетесь, сколько лет на рынке и т.д."
                      rows={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Веб-сайт</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo">Логотип компании</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="flex-1"
                      />
                      
                      {logoPreview && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                          <Image 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Рекомендуемый размер: 200x200 пикселей. Максимальный размер: 5MB
                    </p>
                  </div>
                  
                  <div className="bg-muted p-6 rounded-lg border mt-6">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      Финальная проверка
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Проверьте правильность введенных данных:
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium w-1/3">Название:</span>
                        <span>{formData.name}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">ИНН:</span>
                        <span>{formData.inn}</span>
                      </div>
                      {formData.website && (
                        <div className="flex">
                          <span className="font-medium w-1/3">Веб-сайт:</span>
                          <span>{formData.website}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-4 text-sm">
                      После регистрации компания пройдет модерацию, и вы сможете публиковать вакансии.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={isSubmitting}
                >
                  Назад
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  Далее
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  onClick={handleSubmit}
                  disabled={isUploading || isSubmitting}
                >
                  {isUploading ? (
                    <>
                      <UploadCloud className="mr-2 h-4 w-4 animate-pulse" />
                      Загрузка...
                    </>
                  ) : isSubmitting ? (
                    "Регистрация..."
                  ) : (
                    "Зарегистрировать компанию"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Уже зарегистрировали компанию?{" "}
            <Link href="/companies/my" className="text-primary hover:underline">
              Перейти к управлению
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}