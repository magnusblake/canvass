"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(email, password)

      if (success) {
        toast.success("Вход выполнен успешно")
        router.push("/")
        router.refresh()
      } else {
        toast.error("Неверное имя пользователя или пароль")
      }
    } catch (error) {
      toast.error("Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // В будущем можно добавить возможность входа через Google
    toast.info("Вход через Google в разработке")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/">
            <Image src="/logo.svg" alt="Canvas" width={164} height={29} className="h-8 w-auto mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Войти в аккаунт</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Или{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              зарегистрироваться
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="mt-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Пароль</Label>
                <div className="mt-2">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                  {isLoading ? "Вход..." : "Войти"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Или войти через</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex justify-center"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}