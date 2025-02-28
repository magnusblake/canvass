"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Package } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

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
            <Link href="/services" className="text-base font-medium hover:text-primary">
              Услуги
            </Link>
            <Link href="/blog" className="text-base font-medium hover:text-primary">
              Блог
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Здесь будет логика поиска
              console.log("Поиск:", searchQuery)
            }}
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

          <Button
            variant="default"
            className="hidden md:inline-flex bg-gradient-to-r from-[#FF4400] to-[#D30000] hover:opacity-90 text-white"
          >
            Повышение прав
          </Button>

          <ThemeToggle />

          <Button variant="outline" size="icon" className="hidden md:flex">
            <Package className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button variant="outline" className="hidden md:inline-flex">
            Войти
          </Button>

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
            <Link href="/services" className="text-base font-medium py-2">
              Услуги
            </Link>
            <Link href="/blog" className="text-base font-medium py-2">
              Блог
            </Link>
          </nav>

          <div className="relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Поиск" />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="default"
              className="w-full bg-gradient-to-r from-[#FF4400] to-[#D30000] hover:opacity-90 text-white"
            >
              Повышение прав
            </Button>

            <Button variant="outline" className="w-full">
              Войти
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

