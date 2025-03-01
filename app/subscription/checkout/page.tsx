"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { CreditCard, Check, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") || "monthly"

  const [isLoading, setIsLoading] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Форматирование номера карты (добавление пробелов через каждые 4 цифры)
    if (name === "cardNumber") {
      const formatted = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
      setCardDetails((prev) => ({ ...prev, [name]: formatted }))
      return
    }

    // Форматирование срока действия (добавление / после месяца)
    if (name === "expiryDate") {
      const cleaned = value.replace(/\D/g, "")
      if (cleaned.length <= 2) {
        setCardDetails((prev) => ({ ...prev, [name]: cleaned }))
      } else {
        const month = cleaned.substring(0, 2)
        const year = cleaned.substring(2, 4)
        setCardDetails((prev) => ({ ...prev, [name]: `${month}/${year}` }))
      }
      return
    }

    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Имитируем обработку платежа
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Запрос на активацию премиум-подписки
      const response = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })

      if (!response.ok) {
        throw new Error("Не удалось активировать подписку")
      }

      const data = await response.json()
      updateUser({ premium: data.premium })

      toast.success("Подписка успешно оформлена!", {
        icon: <Check className="h-4 w-4 text-green-500" />,
      })

      router.push("/profile")
    } catch (error) {
      toast.error("Ошибка при оформлении подписки")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-8">
            <Link
              href="/canvasx"
              className="text-muted-foreground flex items-center hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Назад к тарифам
            </Link>
            <h1 className="text-2xl font-bold ml-4">Оформление подписки</h1>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Платежная информация</CardTitle>
                  <CardDescription>Введите данные вашей карты для оформления подписки</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Номер карты</Label>
                      <div className="relative">
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleChange}
                          maxLength={19}
                          required
                        />
                        <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardHolder">Владелец карты</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        placeholder="IVAN IVANOV"
                        value={cardDetails.cardHolder}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Срок действия</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="ММ/ГГ"
                          value={cardDetails.expiryDate}
                          onChange={handleChange}
                          maxLength={5}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          placeholder="123"
                          value={cardDetails.cvv}
                          onChange={handleChange}
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Обработка..." : "Оплатить"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о заказе</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>План</span>
                    <span className="font-medium">CanvasX {plan === "yearly" ? "годовой" : "месячный"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Стоимость</span>
                    <span className="font-medium">{plan === "yearly" ? "3 999 ₽" : "399 ₽"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Период</span>
                    <span className="font-medium">{plan === "yearly" ? "1 год" : "1 месяц"}</span>
                  </div>

                  {plan === "yearly" && (
                    <div className="flex justify-between text-primary">
                      <span>Экономия</span>
                      <span className="font-medium">20%</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Итого</span>
                    <span>{plan === "yearly" ? "3 999 ₽" : "399 ₽"}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-sm text-muted-foreground">
                  <p>
                    Нажимая кнопку "Оплатить", вы соглашаетесь с условиями использования и политикой конфиденциальности.
                  </p>
                  <p>Вы можете отменить подписку в любое время в настройках профиля.</p>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

