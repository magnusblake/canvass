"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package, Plus, LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Canvas" width={164} height={29} className="h-8 w-auto" />
          </Link>
          <div className="hidden md:block h-5 w-px bg-border" />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-base font-medium hover:text-primary">
              Обзор
            </Link>
            <Link href="/best-projects" className="text-base font-medium hover:text-primary">
              Лучшие проекты
            </Link>
            <Link href="/all-projects" className="text-base font-medium hover:text-primary">
              Все проекты
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearch}
            className="relative hidden md:flex items-center"
          >
            <input
              type="text"
              placeholder="Поиск проектов"
              className="w-full h-10 pl-10 pr-4 rounded-md bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>

          {user ? (
            <>
              <Button
                variant="default"
                className="hidden md:inline-flex"
                onClick={() => router.push("/project/create")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать проект
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <Image
                      src={user.image || `https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                      alt={user.name || "User"}
                      fill
                      className="rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/profile/${user.id}`)}>
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/project/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Создать проект
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="outline" className="hidden md:inline-flex" onClick={() => router.push("/login")}>
              Войти
            </Button>
          )}

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", isMenuOpen && "bg-accent")}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          isMenuOpen ? "max-h-[400px]" : "max-h-0",
        )}
      >
        <div className="container px-4 py-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-base font-medium py-2">
              Обзор
            </Link>
            <Link href="/best-projects" className="text-base font-medium py-2">
              Лучшие проекты
            </Link>
            <Link href="/all-projects" className="text-base font-medium py-2">
              Все проекты
            </Link>
          </nav>

          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-9" 
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
            />
          </div>

          <div className="flex flex-col gap-2">
            {user ? (
              <>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    router.push("/project/create")
                    setIsMenuOpen(false)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Создать проект
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    router.push(`/profile/${user.id}`)
                    setIsMenuOpen(false)
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Профиль
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => logout()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Выйти
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  router.push("/login")
                  setIsMenuOpen(false)
                }}
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}