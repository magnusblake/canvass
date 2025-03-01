"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share, Copy, Check, Facebook, Twitter, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaTelegram } from "react-icons/fa"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  title?: string
  text?: string
  url: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function ShareButton({ 
  title = document.title, 
  text = "", 
  url,
  variant = "default",
  size = "default", 
  className
}: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)
  
  // Get full URL including domain
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`
    : url

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: fullUrl,
        })
      } catch (error) {
        console.error("Error sharing content:", error)
      }
    }
  }
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setIsCopied(true)
    toast.success("Ссылка скопирована в буфер обмена!")
    
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }
  
  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`, '_blank')
  }
  
  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, '_blank')
  }
  
  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, '_blank')
  }

  // If Web Share API is available, use the native share dialog
  if (typeof navigator !== 'undefined' && navigator.share) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        onClick={handleShare}
        className={cn("gap-2", className)}
      >
        <Share className="h-4 w-4" />
        {size !== "icon" && "Поделиться"}
      </Button>
    )
  }

  // Fallback to custom dropdown if Web Share API is not available
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={cn("gap-2", className)}
        >
          <Share className="h-4 w-4" />
          {size !== "icon" && "Поделиться"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={shareOnFacebook}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter}>
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTelegram}>
          <FaTelegram className="mr-2 h-4 w-4" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyLink}>
          {isCopied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Скопировано!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Копировать ссылку
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}